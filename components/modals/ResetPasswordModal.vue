<template>
  <el-dialog :visible.sync="showModal" :append-to-body="true" style="" :show-close="false" center
    class="relative text-[#414042]">

    <template #title>
      <span class="text-center font-semibold text-xl"></span>
    </template>
    <!-- Start:: Body -->
    <div class="flex justify-center pb-2">
      <CheckedFillIcon width="70" />
    </div>
    <p class="w-full text-center block py-0 px-2 pb-8 text-[28px] break-normal">
      Reset Link Sent</p>
    <div>
      <span>Haven't received the link on {email} ?</span>
      <button class="ml-1 text-paperdazgreen-300"> Resend</button>
    </div>
    <div class="mt-2">
      <span>Need assistance?</span>
      <button class="ml-1 text-paperdazgreen-300"> Click here</button>
    </div>
    <!-- end :: body -->
  </el-dialog>
</template>
  
<script>
import Vue from 'vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import axios from 'axios'
import { scrapPdfData } from '~/types/scrapPdfData'
import { ExtractFormPdf } from '~/types/extractFormPdf'
import AuthUser from '~/models/AuthUser'
import jwt, { decode, JsonWebTokenError } from 'jsonwebtoken'
import UserTypeEnum from '~/models/UserTypeEnum'
import FileAction from '~/models/FileAction'
import CheckedFillIcon from '../svg-icons/CheckedFillIcon.vue'

export default Vue.extend({
  name: 'ResetPasswordModal',
  components: { SpinnerDottedIcon, CheckedFillIcon },
  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    file: { type: Object }
  },
  data() {
    return {
      showModal: false,
      errorMessage: '',
      loading: false,
      newSaveData: {},
      // file: {},
      sendAction: null,
    }
  },
  watch: {
    visible(val) {
      this.showModal = val
    },
    showModal(val) {
      this.$emit('updateVisibility', val)
    },
  },
  mounted() {
    this.showModal = this.visible
  },
  methods: {
    closeModal() {
      this.$emit('updateVisibility', false)
    },

  },
})

</script>
  
<style scoped>
*>>>.el-dialog {
  width: 416px !important;
  max-width: 95% !important;
  border-radius: 20px !important;
  border-radius: 8px !important;
  position: relative !important;
  overflow: hidden;
}

*>>>.el-dialog__header {
  padding-bottom: 20px;
}

*>>>.el-dialog__header,
*>>>.el-dialog__footer {
  text-align: left !important;
}

*>>>.el-dialog__body {
  /* padding-top: 0 !important;
    padding-bottom: 0 !important; */
  background: #fcfcfd;
}

*>>>.el-select .el-input__inner {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
  