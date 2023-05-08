<template>
  <div class="lg:pt-4 min-h-full flex flex-col">
    <top-details-card-container v-model="activeTab" :tabs="tabs" />
    <!-- <leaves-details-container class="mb-9" /> -->
    <save-file-ledger @setUploadpaperlink="setUploadpaperlink" ref="savefileLedger" class="flex-1" />
    <MaxPaperlinkModal :totalFile="totalRegisteredPaperlink" v-model="showMaxPaperlinkModal" />
    <RequestSentNotificationModal v-model="showRequestSentModal" />
    <CongratulationsModal v-model="showCongratulationsModal" />
  </div>
</template>

<script>
import Vue from 'vue'

import SaveFileLedger from '~/components/savefiles/SaveFileLedger.vue'
import LedgerIcon from "~/components/svg-icons/LedgerIcon.vue"
import TopDetailsCardContainer from '~/components/savefiles/TopDetailsCardContainer.vue'
import CalendarIcon from '~/components/svg-icons/CalendarIcon.vue'
import CheckCircleIcon from '~/components/svg-icons/CheckCircleIcon.vue'
import MoveIcon from '~/components/svg-icons/MoveIcon.vue'
import NoteAndPenIconVue from '~/components/svg-icons/NoteAndPenIcon.vue'
import PageIconVue from '~/components/svg-icons/PageIcon.vue'
import TickCircleIconVue from '~/components/svg-icons/TickCircleIcon.vue'
import TrashXIcon from '~/components/svg-icons/TrashXIcon.vue'
import { mapState } from 'vuex'
import { ErrorHandler } from '~/types/ErrorFunction'
import UserTypeEnum from '~/models/UserTypeEnum'
import MaxPaperlinkModal from '~/components/company-files/Tabs/MaxPaperlinkModal.vue'
import CongratulationsModal from '~/components/modals/CongratulationsModal.vue'
import RequestSentNotificationModal from '~/components/company-files/Tabs/RequestSentNotificationModal.vue'

export default Vue.extend({
  components: {
    TopDetailsCardContainer,
    SaveFileLedger,
    CongratulationsModal,
    MoveIcon,
    TrashXIcon,
    CheckCircleIcon,
    CalendarIcon,
    LedgerIcon,
    MaxPaperlinkModal,
    RequestSentNotificationModal
  },
  layout: 'dashboard',
  // auth:'guest',
  data() {
    return {
      // ledger, confirmed, signed, saved, shared
      activeTab: 'ledger',
      totalRegisteredPaperlink: null,
      totalUploadPaperlink: null,
      showMaxPaperlinkModal: false,
      showUploadIcon: false,
      showRequestSentModal: false,
      tabs: [
        {
          label: 'ledger',
          key: 'ledger',
          action: 'ledger',
          count: 896,
          icon: LedgerIcon,
        },
        {
          label: 'completed',
          key: 'completed',
          count: 25,
          action: 'complete',
          icon: PageIconVue,
        },
        {
          label: 'confirmed',
          key: 'confirmed',
          count: 25,
          action: 'confirm',
          icon: TickCircleIconVue,
        },
        {
          label: 'signed',
          key: 'signed',
          count: 25,
          action: 'sign',
          icon: NoteAndPenIconVue,
        },
        // {
        //   label: 'saved',
        //   key: 'saved',
        //   count: 25,
        //   action: 'save',
        //   icon: DisketIconVue,
        // },
        // {
        //   label: 'shared',
        //   key: 'shared',
        //   count: 25,
        //   action: 'share',
        //   icon: ShareIconVue,
        // },
      ],
      showUploadDocumentModal: false,
    }
  },
  watch: {
    "$auth.user": function () {
      this.checkTeamParams()
      this.maxFileUpload()
    }
  },
  computed: {
    ...mapState(['beTeamMember']),
    isPaid() {
      return this.$auth.user.role == UserTypeEnum.PAID || this.$auth.user.role == UserTypeEnum.TEAM
    },
    showCongratulationsModal(){
      return this.$store.state.showCongratulationsModal;
    }
  },
  mounted() {
    this.maxFileUpload()
    if (sessionStorage.getItem("fileActionWhenSearch")) {
      this.showRequestSentModal = true
    }
  },
  methods: {
    checkingLaggedPackage() {
      let packageDetails = JSON.parse(localStorage.getItem("package-not-loggedin"))
      let toCreate = localStorage.getItem("create-package-not-loggedin")
      switch (toCreate) {
        case 'true':
          this.$nuxt.$router.push('/package?tablevel=1')
          break;

        default:
          this.$store.commit('PACKAGE_INFO', packageDetails)
          this.$nuxt.$router.push('/packages?tablevel=3')
          break;
      }
    },
    showMaxPaperlinkModalFunc() {
      this.showMaxPaperlinkModal = true
    },
    setUploadpaperlink(val) {
      this.totalUploadPaperlink = val
    },
    async maxFileUpload() {
      this.$auth.user.subscriptionId && await this.$axios.get(`/subscriptions/${this.$auth.user.subscriptionId}`)
        .then((response) => {
          this.totalRegisteredPaperlink = response?.data?.paperlink
        })
        .finally(() => { this.showUploadIcon = true })
    },
    showUploadModalFunction() {
      if (!this.showUploadIcon) return

      if (this.isPaid) {
        if (this.totalUploadPaperlink >= this.totalRegisteredPaperlink) {
          this.showMaxPaperlinkModal = true
        } else {
          this.showUploadDocumentModal = true
        }
      }
      else {
        this.$nuxt.$router.push("/packages?type=default")
      }

    },
    async checkTeamParams() {
      let getTeamObject = JSON.parse(localStorage.getItem('team_member_object'))

      if (!getTeamObject || !this.beTeamMember || !getTeamObject.teamId) return

      this.teamData = {
        teamId: Number(getTeamObject.teamId),
        userId: Number(this.$auth.user.id),
        action: getTeamObject.action
      }

      await this.$axios.$post(`/users`, { ...this.teamData })
        .then((response) => {
          localStorage.removeItem('team_member_object')
          window.location.reload()
        })
        .catch(async ({ response }) => {
          let message = ErrorHandler(response)
          this.$notify.error({
            title: "Team",
            message: message
          })

          if (!(message).includes("Network")) {
            localStorage.removeItem('team_member_object')
          }
        })

      this.$store.commit('TEAM_MEMBER', false)
    },
  }
})
</script>
