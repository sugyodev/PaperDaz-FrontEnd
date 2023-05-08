<template>
  <div class="flex flex-col">
    <h3
      class="text-paperdazgray-700 font-semibold text-xl flex flex-col gap-3 xs:flex-row xs:items-center justify-between whitespace-nowrap"
      :class="isPaidUser ? '' : 'mb-4 mt-4'">
      <h5 class="text-lg font-semibold text-[#272727] inline-flex items-center gap-2 mr-12 float-left">
        Saved Files
      </h5>
      <div class="w-full xs:max-w-[250px] text-xs font-medium flex justify-end  items-center relative float-right ">
        <span class="el-dropdown-link left-roll mr-4">
          <input type="text"
            class="search-input h-10 transition pl-4 mr-2 bg-transparent flex-1 border-[1px] border-paperdazgreen-400 rounded-tl-lg rounded-bl-lg focus:border-paperdazgreen-700 outline-none"
            placeholder="Search Files" v-model="searchParam" />
        </span>
        <button
          class="circle circle-18 bg-paperdazgreen-400 text-white mr-2 hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150 transition duration-0 hover:duration-150">
          <search-icon width="16" height="16" currentcolor="white" />
        </button>
      </div>
    </h3>
    <div ref="ledgerContainer" class="bg-white rounded-2xl flex-1 min-h-[50vh] lg:min-h-[40vh] position-relative"
      :class="[
        (files || []).length <= 0 || $fetchState.pending
          ? 'p-5 flex justify-center'
          : 'pb-4 overflow-x-auto custom-scrollbar',
      ]">
      <!-- <transition name="fade" mode="out-in"> -->
      <img v-if="((savedFiles || []).length <= 0 && !spinner)" src="../../assets/img/dashboard-bg.png"
        class="position-absolute mt-24 md:left-[30%] md:w-auto sm:w-[200px]" />
      <div v-if="spinner" key="1" class="p-6 flex justify-center items-center">
        <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
      </div>
      <!-- Start:: empty file ledger -->
      <!-- End:: empty file ledger -->
      <table key="3" ref="fileLedgerTable" class="file-ledger-table" v-else>
        <thead>
          <tr class="text-left">
            <th class="w-12 text-left fixed-col left">No</th>
            <th class="text-left !pl-16">File Name</th>
            <th class="text-center">Actions</th>
            <th class="text-center">Date & time</th>
            <!-- <th class="fixed-col text-right"></th> -->
            <th class="fixed-col right text-right"></th>
          </tr>
        </thead>
        <tbody v-if="(savedFiles.length > 0)">
          <tr v-for="(file, i) in savedFiles" :key="file.favouriteId"
            :class="{ highlight: file.favouriteId == highlightedFileId }">
            <td class="text-left fixed-col left">{{ i + 1 + returnedDataPage }}</td>
            <td class="text-center">
              <div class="flex items-center gap-1.5">
                <div class="border border-paperdazgreen-300 p-0.5"
                  :class="[file.role == userType.PAID ? 'rounded-md w-9 h-9' : 'circle circle-17']">
                  <img :src="
                    (file.fileOwner || {}).profile_picture ||
                    '/img/placeholder_picture.png'
                  " alt=""
                    :class="[file.role == userType.PAID ? 'w-full h-full rounded-md' : 'w-full h-full rounded-full']" />
                </div>
                <div>
                  <p class="text-sm font-medium text-center">
                    <nuxt-link :to="`/pdf/${file.paperLink}`">
                      <!-- {{ file.fileName.length > 32 ? `${file.fileName.substr(0, 24)} ...` : file.fileName }} -->
                      {{ file.fileName | removeExtension }}
                    </nuxt-link>
                  </p>
                  <p class="text-xs">
                    {{ (file || {}).userName }}
                  </p>
                </div>
              </div>
            </td>
            <td class="text-center">
              {{ file.fileAction || "-" }}
            </td>
            <td class="text-center">
              {{ formatDateTime(file.updatedAt) }}
            </td>
            <td class="fixed-col right">
              <SearchShare :file="file" :showShareIcon="true" />
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="i in 10" :key="i">
            <td class="text-left fixed-col left">{{ i }}</td>
            <td class="text-center">
            </td>
            <td class="text-center">
            </td>
            <td class="text-center">
            </td>
            <td class="text-center">
            </td>
            <td class="fixed-col">
            </td>
            <td class="fixed-col right">
            </td>
          </tr>
        </tbody>
      </table>
      <!-- </transition> -->
    </div>
    <FilePagination :totalFile="totalFile" @setPage="setPage" v-if="(savedFiles.length > 10)" />
    <ShareFilesModal :userFile="userFile" @qrLoad="showQrcodeFileFunc" v-model="showShareCompanyFiles" />
    <CreateCompanyFolder @refresh="setRefresh" :userFile="userFile" @resetUserFile="resetUserFile"
      v-model="showCreateCompanyFolder" />
    <upload-document-modal @resetUserFolder="resetUserFolder" :folder="fileProps" v-model="showUploadDocumentModal" />
    <QrcodeShare :userFile="userFile" v-model="showQrcodeFiles" />
    <CreateTeam @refresh="setRefresh" v-model="showCreateTeam" />
  </div>
</template>
<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import ScribbleIcon from '../svg-icons/ScribbleIcon.vue'
import SearchIcon from '../svg-icons/SearchIcon.vue'
import TreeIcon from '../svg-icons/TreeIcon.vue'
import DateFormatter from '~/utils/DateFormatter'
import ShareIcon from '../svg-icons/ShareIcon.vue'
import SpinnerDottedIcon from '../svg-icons/SpinnerDottedIcon.vue'
import HeartOutlineIcon from '../svg-icons/HeartOutlineIcon.vue'
import ShareOutlineIcon from '../svg-icons/ShareOutlineIcon.vue'
import ShareFilesModal from '../company-files/Tabs/ShareFilesModal.vue'
import QrcodeShare from '../company-files/Tabs/QrcodeShare.vue'
import FilePagination from '../pagination/FilePagination.vue'
import UserTypeEnum from '~/models/UserTypeEnum'
import FolderPlusIcon from '../svg-icons/FolderPlusIcon.vue'
import PlusIcon from '../svg-icons/PlusIcon.vue'
import SearchShare from '../search-strips/component/SearchShare.vue'
import CreateCompanyFolder from '../company-files/Tabs/CreateCompanyFolder.vue'
import UploadDocumentModal from './UploadDocumentModal.vue'
import CreateTeam from '../company-files/Tabs/CreateTeam.vue'
import EmptyFileLedger from '../widgets/EmptyFileLedger.vue'
export default Vue.extend({
  components: {
    TreeIcon,
    FolderPlusIcon,
    PlusIcon,
    ScribbleIcon,
    SearchShare,
    SearchIcon,
    ShareIcon,
    SpinnerDottedIcon,
    HeartOutlineIcon,
    ShareOutlineIcon,
    ShareFilesModal,
    QrcodeShare,
    FilePagination,
    UploadDocumentModal,
    CreateCompanyFolder,
    CreateTeam,
    EmptyFileLedger
  },
  props: ['searchContect'],
  filters: {
    removeExtension(filename) {
      return filename.replace(/\.[^\/.]+$/, '');
    }
  },
  async fetch() { },
  data() {
    return {
      searchParam: '',
      totalFile: null,
      returnedDataPage: 0,
      spinner: true,
      show: false,
      showQrcodeFiles: false,
      showShareCompanyFiles: false,
      userFile: {},
      userId: (this.$auth.user).id,
      filterTitle: '',
      searchValue: '',
      ledgerFiles: [],
      showScribble: false,
      files: [],
      fileProps: {},
      copyFiles: [],
      refresh: false,
      highlightedFileId: undefined,
      scrollObserver: undefined,
      showUploadDocumentModal: false,
      showCreateCompanyFolder: false,
      showCreateTeam: false
    }
  },
  mounted() {
    this.handleFileHighlight()
    this.handleShowingLedger()
    this.tableScrollObserver()
    // this.fetchFiles(this.returnedDataPage, this.searchValue)
    this.getSavedFiles()
  },
  methods: {
    showCreateCompanyFolderFunc() {
      this.showCreateCompanyFolder = true
    },
    showUploadModalFunction() {
      this.showUploadDocumentModal = true
    },
    getSavedFiles() {
      if (!this.$auth.loggedIn) return
      this.$axios
        .$get(`/favourites/?userId=${this.$auth?.user?.id}`)
        .then((response) => {
          if(response.total > 0){
            response.data.map((val) => {
            val.file['favourite'] = 1
            val.file['favouriteId'] = val.id
          })
          response.data = response.data.map((val) => val.file)
          }
          this.$store.commit('ADD_SAVE_USER', response.data)
          this.totalFile = response.total
        })
        .finally(() => {
          this.spinner = false
        })
    },
    setRefresh() {
      this.refresh = !this.refresh
    },
    resetUserFolder() {
      this.fileProps = {}
    },
    resetUserFile() {
      this.userFile = {}
    },
    showCreateTeamFunc() {
      this.showCreateTeam = true
    },
    searchFiles(event) {
      this.searchValue = event.target.value
    },
    setPage(page) {
      this.returnedDataPage = page
    },
    showShareCompanyFilesFunc(data) {
      this.userFile = data
      this.showShareCompanyFiles = true
    },
    showQrcodeFileFunc() {
      this.showQrcodeFiles = true;
    },
    async fetchFiles(page, search) {
      // this.isPaidUser ? this.ledgerFiles(page, search) : this.ledgerFiles(page, search)
    },
    handleFileHighlight() {
      this.highlightedFileId = this.$nuxt.$route.query.highlight_file
      setTimeout(() => {
        this.highlightedFileId = undefined
      }, 20000)
    },
    shareFile(file) {
      const url = location.origin.replace(/\/+$/, '') + `/pdf/${file.id}`
      navigator.share({
        url,
        title: file_name,
      })
    },
    async tableScrollObserver() {
      await this.$nextTick()
      if (this.scrollObserver) {
        try {
          this.scrollObserver.disconnect()
          this.scrollObserver = undefined
        } catch (e) { }
      }
      const options = {
        root: this.$refs.ledgerContainer,
        // root: document,
        rootMargin: '0px',
        threshold: 1.0,
      }
      const callback = (
        entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            entry.target.classList.add('scrolled')
          } else {
            entry.target.classList.remove('scrolled')
          }
        })
      }
      const observer = new IntersectionObserver(callback, options)
      const fixedCols = document.querySelectorAll('.fixed-col')
      fixedCols.forEach((el) => {
        observer.observe(el)
      })
      this.scrollObserver = observer
    },
    formatDateTime(dateVal) {
      return `${DateFormatter.getDateString(
        dateVal
      )}  ${DateFormatter.getFormattedTime(dateVal)}`
    },
    handleShowingLedger() {
      const ledgerContainer = this.$refs.ledgerContainer
      if (!ledgerContainer) return
      const options = {
        root: null,
        threshold: 0.75,
        rootMargin: '0px',
      }
      const callback = (
        entries,
        _observer
      ) => {
        entries.forEach((entry) => {
          if (entry.target === ledgerContainer) {
            if (entry.isIntersecting) {
              this.showScribble = true
            } else {
              this.showScribble = false
            }
          }
        })
      }
      const observer = new IntersectionObserver(callback, options)
      observer.observe(ledgerContainer)
    },
  },
  updated() {
    this.tableScrollObserver()
  },
  computed: {
    ...mapState(['filterUser', 'savedFiles']),
    userType() {
      return (UserTypeEnum)
    },
    isPaidUser() {
      switch (this.$auth?.user?.role) {
        case UserTypeEnum.PAID:
          return true
        case UserTypeEnum.TEAM:
          return true
        case UserTypeEnum.FREE:
          return false
      }
    },
    mainUserLink() {
      switch (this.$auth?.user?.role) {
        case UserTypeEnum.PAID:
          return (this.$auth.user || {}).id
        case UserTypeEnum.TEAM:
          return (this.$auth.user || {}).mainAccountId
      }
      (this.$auth.user || {}).id
    }
  },
  watch: {
    '$auth.user': function () {
      // this.fetchFiles(this.returnedDataPage, this.searchParam)
      this.getSavedFiles()
    },
    'returnedDataPage': function () {
      this.spinner = true;
      // this.fetchFiles(this.returnedDataPage, this.searchParam)
    },
    'searchParam': function () {
      this.spinner = true;
      // this.fetchFiles(this.returnedDataPage, this.searchParam)
      this.$store.commit('SEARCH_SAVED_FILES', this.searchParam)
      setTimeout(() => { this.spinner = false }, 1000)
    },
    savedFiles: function () {
    },
    refresh: function () {
      this.$nuxt.refresh()
      // this.fetchFiles(this.returnedDataPage, this.folderSearch)
      // this.fetchFolder(this.returnedFolderPage, this.folderSearch)
    },
  },
})
</script>
<style lang="postcss" scoped>
.file-ledger-table {
  --background: white;
  @apply text-sm w-full whitespace-nowrap;
  border-collapse: separate;
  border-spacing: 0px 0px;
  height: fit-content;
  & tr {
    @apply border-b border-gray-100;
    transition: all 0.2s ease-in-out;
    &.highlight {
      --background: rgba(233, 254, 219, 0.46);
    }
  }
  & th {
    @apply pt-8 pb-3 text-base;
    background: var(--background);
  }
  & td {
    @apply py-3 text-base;
  }
  & td,
  & th {
    @apply px-2 border-b border-gray-100;
    transition: all 0.2s ease-in-out;
    background: var(--background);
    &:first-child {
      @apply pl-5;
    }
    &:last-child {
      @apply pr-5;
    }
    &.fixed-col {
      position: sticky;
      background: white;
      background: var(--background);
      &.left {
        left: -0.1px;
      }
      &.right {
        right: -0.1px;
      }
    }
  }
}
/* .search-input {
  & ~ .search-dropdown {
    @apply opacity-0 translate-y-[5%] pointer-events-none;
  }
  &:active,
  &:focus {
    & ~ .search-dropdown {
      @apply opacity-100 translate-y-0 pointer-events-auto;
    }
  }
} */
</style>