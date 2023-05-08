<template>
  <div>
    <img v-if="completed" class="absolute-image" :src="completedImgData" :style="style" />
    <img v-else-if="!initialimgDisplay" src="../../../assets/img/initial-icon.png" attr="initial"
      :elemFill="uploaded && initialimgDisplay" :uploaded="uploaded" @click="setInitialImgDisplay" class="annot-button"
      :class="[
        $auth.loggedIn && !initialimgDisplay && !isCreator ? 'pulse' : ' ', isAgreedSign !== 1 && isSign ? 'pointer-events-none' : ''
      ]" width="18" />
    <img v-else-if="uploaded" class="absolute-image" :src="initial" :style="style" />
    <img v-else class="absolute-image" src="../../../assets/img/initials.png"/>
  </div>

</template>

<script>
import AddToPageDrawOrType from '~/components/modals/AddToPageDrawOrType.vue'
import SaveSignatureInitialsMixin from '~/mixins/SaveSignatureInitialsMixin'
import mixins from 'vue-typed-mixins'
import TeamAccess from '~/models/TeamAccess'
import { mapState } from 'vuex'
import DrawOrTypeModal from '~/components/modals/DrawOrTypeModal.vue'
import FileAction from '~/models/FileAction'

export default mixins(SaveSignatureInitialsMixin).extend({
  props: {
    scale: Number,
    file: Object,
    completed: String,
    setInitialSignType:Function
  },
  computed: {
    ...mapState(['loadedPdfFile']),
    isCreator() {
      return (
        this.file.userId == this.$auth?.user?.id ||
        (this.$auth?.user?.teamAccess == TeamAccess.COMPANY_FILE &&
          this.$auth?.user?.teamId == this.file.userId)
      )
    },
    isSign() {
      return String(this.file.fileAction).toLowerCase() === FileAction.SIGNED
    },
    isAgreedSign() {
      return this.$store.state.agreeSign;
    },
    isComplete() {
      return String(this.file.fileAction).toLowerCase() === FileAction.COMPLETE
    },
    uploaded() {
      switch (this.$auth.loggedIn) {
        case true:
          return this.$auth?.user?.initialURL !== null && !this.isCreator
        case false:
          return false
      }
    },
    style() {
      return {
        width: 'auto',
        height: `${(this.scale || 1) * 20}px`,
      }
    },
  },
  data() {
    return {
      showInitialModal: false,
      initial: null,
      initialimgDisplay: false,
      completedImgData: null
    }
  },
  components: { AddToPageDrawOrType, DrawOrTypeModal },
  methods: {
    changeInitialToBase64(com) {
      const toDataURL = (url) =>
        fetch(url)
          .then((response) => response.blob())
          .then(
            (blob) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
              })
          )
      if (com) {
        toDataURL(com).then((dataUrl) => {
          this.completedImgData = dataUrl
        })
      }
      toDataURL(this.$auth?.user?.initialURL).then((dataUrl) => {
        this.initial = dataUrl
      })
    },
    imageExportedLocal(image, isSignature) {
      this.$BUS.$emit(
        isSignature ? 'signature-update' : 'initials-update',
        image
      )
      this.imageExported(image, isSignature)
      // this.uploaded = true
    },
    popInitial() {
      !this.isCreator && (this.initialimgDisplay = true);
      if (this.isCreator || !this.$auth.loggedIn) return
      if (!this.uploaded) this.showInitialModal = true
    },
    setInitialImgDisplay() {
      !this.isCreator && (this.initialimgDisplay = true);
      this.$BUS.$emit('scrollToSignInitial', 'appendinitial')
      !this.uploaded && this.setInitialSignType('initial');
    },
  },
  mounted() {
    this.changeInitialToBase64()
    this.completed && this.changeInitialToBase64(this.completed)
  },
  watch: {
    '$auth.user.initialURL': async function () {
      this.changeInitialToBase64()
    },
  },
})
</script>

<style scoped>
.absolute-image {
  transition: 0.25s;
  max-width: 200px;
  width: 70px;
  height: auto;
  @apply absolute top-0 left-[5%] opacity-100;
}
</style>
