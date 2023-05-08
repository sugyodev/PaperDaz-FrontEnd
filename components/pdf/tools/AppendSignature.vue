<template>
  <div>
    <img v-if="completed" class="absolute-image" :src="completedImgData" :style="style" />
    <img v-else-if="!initialimgDisplay" src="../../../assets/img/sign-icon.png" attr="sign"
      :elemFill="uploaded && initialimgDisplay" :uploaded="uploaded" @click="setInitialImgDisplay" class="annot-button"
      :class="[
        $auth.loggedIn && !initialimgDisplay && !isCreator ? 'pulse' : ' ', isAgreedSign !== 1 && isSign ? 'pointer-events-none' : ''
      ]" width="18" />
    <img v-else-if="uploaded" class="absolute-image" :src="signature" :style="style" />
    <img v-else class="absolute-image" src="../../../assets/img/sign.png" />

  </div>

</template>

<script>
import DrawOrTypeModal from '~/components/modals/DrawOrTypeModal.vue'
import SaveSignatureInitialsMixin from '~/mixins/SaveSignatureInitialsMixin'
import mixins from 'vue-typed-mixins'
import TeamAccess from '~/models/TeamAccess'
import { mapState } from 'vuex'
import FileAction from '~/models/FileAction'

export default mixins(SaveSignatureInitialsMixin).extend({
  props: {
    scale: Number,
    file: Object,
    completed: String,
    setInitialSignType:Function
  },
  data() {
    return {
      showSignatureModal: false,
      signature: null,
      initialimgDisplay: false,
      completedImgData: null
    }
  },
  mounted() {
    this.changeSignToBase64()
    this.completed && this.changeSignToBase64(this.completed)
  },
  computed: {
    ...mapState(['loadedPdfFile']),
    uploaded() {
      switch (this.$auth.loggedIn) {
        case true:
          return this.$auth?.user?.signatureURL !== null && !this.isCreator

        case false:
          return false
      }
    },
    isSign() {
      return String(this.file.fileAction).toLowerCase() === FileAction.SIGNED
    },
    isComplete() {
      return String(this.file.fileAction).toLowerCase() === FileAction.COMPLETE
    },
    isAgreedSign() {
      return this.$store.state.agreeSign;
    },
    isCreator() {
      return (
        this.file.userId == this.$auth?.user?.id ||
        (this.$auth?.user?.teamAccess == TeamAccess.COMPANY_FILE &&
          this.$auth?.user?.teamId == this.file.userId)
      )
    },
    style() {
      return {
        width: 'auto',
        height: `${(this.scale || 1) * 20}px`,
      }
    },
  },
  methods: {
    changeSignToBase64(com) {
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
      toDataURL(this.$auth?.user?.signatureURL).then((dataUrl) => {
        this.signature = dataUrl
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
    popSign() {
      !this.isCreator && (this.initialimgDisplay = true);

      if (this.isCreator || !this.$auth.loggedIn) return
      if (!this.uploaded) this.showSignatureModal = true
    },
    setInitialImgDisplay() {
      !this.isCreator && (this.initialimgDisplay = true);
      this.$BUS.$emit('scrollToSignInitial', 'appendsign')
      !this.uploaded && this.setInitialSignType('sign');
    },
  },
  components: { DrawOrTypeModal },
  watch: {
    '$auth.user.signatureURL': async function () {
      this.changeSignToBase64()
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
