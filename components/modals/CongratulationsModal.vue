<template>
  <el-dialog :visible.sync="showModal" :append-to-body="true" style="" :show-close="false" center
    class="relative text-[#414042]">

    <template #title>
      <div class="text-center font-semibold text-xl">
        Congratulations
      </div>
    </template>
    <!-- Start:: Body -->
    <p class="w-full text-center block py-0 px-2 pb-8 break-normal">
      Your business page has been
      created. You can switch accounts
      by changing your profile. t</p>
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
  name: 'CongratulationsModal',
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
  padding-top: 50px;
  padding-bottom: 50px;
  width: 416px !important;
  max-width: 95% !important;
  border-radius: 20px !important;
  border-radius: 8px !important;
  position: relative !important;
  overflow: hidden;
  background: linear-gradient(180deg, #E4F3E0 0%, #FFFFFF 100%);border: 5px solid #77B550;box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.4);
border-radius: 16px;
}

*>>>.el-dialog__header {
  padding-bottom: 20px;
  text-align: center;
}

*>>>.el-dialog__header,
*>>>.el-dialog__footer {
  text-align: left !important;
}

*>>>.el-dialog__body {
  /* padding-top: 0 !important;
    padding-bottom: 0 !important; */
  /* background: #fcfcfd; */
}

*>>>.el-select .el-input__inner {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
  