<template>
  <div>
    <!-- Start:: header -->
    <header class="flex items-center flex-wrap gap-4 justify-between">
      <h5 class="text-lg font-semibold text-[#272727] inline-flex items-center gap-2">
        Company Files <a :href="`/public/profile/${mainUserLink}`" target="_blanck">
          <!-- <company-icon /> -->
          <img src="../../assets/img/company-icon.png" />
        </a>
        <img src="../../assets/img/users-icon.png" @click="showCreateTeamFunc" class="-ml-8 cursor-pointer" />
      </h5>
      <div class="text-white flex items-center">
        <div action="" class="w-full xs:max-w-[280px] text-xs font-medium flex items-center relative justify-end mr-2"
          @submit.prevent="$event.preventDefault()">
          <span class="el-dropdown-link left-roll mr-2">
            <input type="text"
              class="search-input h-10 pl-4 mr-2 text-black bg-transparent flex-1 border-[1px] border-paperdazgreen-400 rounded-tl-lg rounded-bl-lg focus:border-paperdazgreen-700 outline-none"
              placeholder="Search Files" v-model="folderSearch" />
          </span>
          <button
            class="circle circle-18 bg-paperdazgreen-400 text-white hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150 transition duration-0 hover:duration-150">
            <search-icon width="16" height="16" currentcolor="white" />
          </button>
        </div>
        <button @click="showCreateCompanyFolderFunc"
          class="circle circle-18 bg-paperdazgreen-400 text-xl hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150 transition duration-0 hover:duration-150">
          <folder-plus-icon />
        </button>
        <button @click="showUploadModalFunction"
          class="circle circle-18 p-2 ml-2 bg-paperdazgreen-400 text-xl hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150 transition duration-0 hover:duration-150">
          <plus-icon />
        </button>
      </div>
    </header>
    <!-- End:: header -->
    <transition name="fade" mode="out-in" :duration="100">
      <!-- <empty-file-ledger class="min-h-[55vh]" v-if="pdfUser < 1" :isPaidUser= "isPaidUser"/> -->
      <div class="bg-white rounded-3xl pb-4 text-[#272727] min-h-[55vh] overflow-hidden">
        <!-- Start:: Folders -->
        <div v-if="(folders.length > 0 && !folderSelected)">
          <h4 class="text-xl text-paperdazgreen-400 font-medium px-5 border-b border-gray-100 h-16 flex items-center">
            Folders
          </h4>
          <div class="overflow-x-auto custom-scrollbar relative">
            <!-- START: spinner container -->
            <div v-if="folderSpinner"
              class="absolute z-10 w-full h-full bg-white top-0 left-0 rounded-lg flex justify-center items-center">
              <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
            </div>
            <div
              class="my-12 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] md:grid-cols-4 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-2 sm:gap-x-[3.5rem] gap-y-6 px-[3rem]">
              <div class="items-center border-2 py-[15px] pl-[15px] rounded-[16px] border-[#909090]"
                v-for="(content, i) in folders" :key="i">
                <div class="overflow-hidden px-[10px] flex justify-between">
                  <div class="float-left flex">
                    <span class="border-none inline-block	float-left pt-[4px]">
                      <img class="w-[28px]" src="~/assets/img/Vector.png" />
                    </span>
                    <p @click="showFolderFilesFunc(content)"
                      class="text-base font-medium text-center text-[#414142] truncate cursor-pointer inline-block ml-[27px]">
                      {{ content.name }}
                    </p>
                  </div>
                  <div class="float-right flex">
                    <span>{{ content.files.length }}</span>
                    <div class="grid place-items-center -mt-1">
                      <el-dropdown trigger="click">
                        <button class="el-dropdown-link w-8 h-8 cursor-pointer grid place-items-center rounded-full"
                          :class="[createdByTeamMember(content.createdBy) && isTeam ? 'bg-paperdazgreen-300/20' : '']">
                          <ellipsis-icon-vertical-icon />
                        </button>
                        <el-dropdown-menu slot="dropdown" class="table-menu-dropdown-menu">
                          <div class="no-access" v-if="!createdByTeamMember(content.createdBy)">no access right</div>
                          <ul v-else class="min-w-[150px]">
                            <li class="dropdown-item" @click="showEditCompanyFolderFunc(content)">
                              <span>Edit</span>
                            </li>
                            <li class="dropdown-item" @click="showDeleteCompanyFolderFunc(content)">
                              <span>Remove</span>
                            </li>
                            <li class="dropdown-item" @click="showAddCompanyFolderFunc(content)">
                              <span>Add Files</span>
                            </li>
                          </ul>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- End:: Folders -->
        <FilePagination :totalFile="totalFolder" @setPage="setFolderPage" />
        <!-- Start:: Files -->
        <h4 class="text-xl text-paperdazgreen-400 font-medium px-5 border-b border-gray-100 h-16 flex items-center"
          v-if="folders.length > 0 && !folderSelected">
          Files
        </h4>
        <div v-if="folderSelected"
          class="text-xl text-paperdazgreen-400 font-medium px-5 border-b border-gray-100 h-16 flex items-center">
          <button class="bg-paperdazgreen-400 p-2 text-white text-lg rounded-lg" @click="backFolder">Back</button>
          <h2 class="text-paperdazgreen-400 font-bold w-5/6 text-center">{{ FilesInFolerContent.name }}</h2>
        </div>
        <div class="overflow-x-auto custom-scrollbar relative">
          <!-- START: spinner container -->
          <div v-if="fileSpinner"
            class="absolute z-10 w-full h-full bg-white top-0 left-0 rounded-lg flex justify-center items-center">
            <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
          </div>
          <!-- END: spinner container -->
          <empty-file-ledger class="min-h-[55vh]" v-if="pdfUser < 1" :isPaidUser="isPaidUser" />
          <!--START: No files container-->
          <table class="custom-table" v-else>
            <thead class="text-[#414142]">
              <tr>
                <th class="w-12 text-left fixed-col left">No</th>
                <th class="text-left !pl-16">File name</th>
                <th class="text-center">Action required</th>
                <th class="text-center">Privacy</th>
                <th class="text-center">Date &amp; Time</th>
                <th class="text-center fixed-col right"></th>
              </tr>
            </thead>
            <tbody class="text-[#505050]">
              <tr v-for="(file, i) in pdfUser" :key="i">
                <td class="fixed-col left">{{ i + 1 + returnedDataPage }}</td>
                <td class="text-left">
                  <div class="flex items-center gap-3 whitespace-nowrap min-w-[150px] max-w-[400px]">
                    <span class="p-0.5 border border-paperdazgreen-400"
                      :class="[
                        (file.role == userType.PAID && $auth.user.id != file.userId)
                          ? 'rounded-md w-9 h-9 min-w-[36px] min-h-[36px]'
                          : 'circle circle-17']"
                    >
                      <img :src="
                        (file.user || {}).profile_picture ||
                        '/img/placeholder_picture.png'
                      " alt=""
                        :class="[file.role == userType.PAID ? 'w-full h-full rounded-md' : 'w-full h-full rounded-full']" />
                    </span>
                    <div class="overflow-hidden">
                      <p class="text-base font-medium text-[#414142] truncate">
                        <nuxt-link :to="`/pdf/${file.paperLink}`">
                          {{ file.fileName | removeExtension }}
                        </nuxt-link>
                      </p>
                      <p class="text-xs text-[#878686] truncate">
                        {{ file.userName }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="text-sm text-center">{{ file.fileAction && file.fileAction !== 'share' ? file.fileAction : "-" }}</td>
                <td class="text-sm text-center capitalize">{{ (file || {}).filePrivacy }}</td>
                <td class="text-center">
                  {{ formatDateTime(file.updatedAt) }}
                </td>
                <td class="fixed-col right w-[50px]">
                  <div class="w-full h-full grid place-items-center">
                    <el-dropdown trigger="click">
                      <button class="el-dropdown-link w-8 h-8 cursor-pointer grid place-items-center rounded-full"
                        :class="[createdByTeamMember(file.uploadedBy) && isTeam ? 'bg-paperdazgreen-300/20' : '']">
                        <ellipsis-icon-vertical-icon />
                      </button>
                      <el-dropdown-menu slot="dropdown" class="table-menu-dropdown-menu">
                        <div class="no-access" v-if="!createdByTeamMember(file.uploadedBy)">no access right</div>
                        <ul class="min-w-[150px]" v-else>
                          <li class="dropdown-item" @click="showShareCompanyFileFunc(file)" divided>
                            <div class="flex justify-between w-full">
                              <share-icon width="16" height="16" class="inline-block float-left" />
                              <span>Share</span>
                            </div>
                          </li>
                          <li @click="showRequestModalFunc(file)" class="dropdown-item">
                            <div class="flex justify-between w-full border-t border-gray-200">
                              <request-icon width="20" height="20" class="inline-block float-left" />
                              <span>Request</span>
                            </div>
                          </li>
                          <li class="dropdown-item" @click="showPapertagsModalFunc(file)">
                            <div class="flex justify-between w-full border-t border-gray-200" >
                              <span width="20" height="20" class="inline-block float-left">#</span>
                              <span>Paper Tag</span>
                            </div>
                          </li>
                          <li class="dropdown-item" @click="showCCFlowModalFunc(file)">
                            <div class="flex justify-between w-full border-t border-gray-200">
                              <FileSolidIcon width="16" height="16" class="inline-block float-left" />
                              <span class="ml-1">Carbon Copy</span>
                            </div>
                          </li>
                          <li class="dropdown-item" @click="showEditCompanyFileFunc(file)">
                            <div class="flex justify-between w-full border-t border-gray-200">
                              <PenIcon width="16" height="16" class="inline-block float-left" />
                              <span class="ml-1">Edit</span>
                            </div>
                          </li>
                          <li class="dropdown-item" @click="showMoveCompanyFileFunc(file)">
                            <div class="flex justify-between w-full border-t border-gray-200">
                              <MoveIcon width="16" height="16" class="inline-block float-left" />
                              <span class="ml-1">Move</span>
                            </div>
                          </li>
                          <li class="dropdown-item" @click="showQrcodeFileFunc(file)">
                            <div class="flex justify-between w-full border-t border-gray-200">
                              <QrcodeIcon width="16" height="16" class="inline-block float-left" />
                              <span class="ml-1">QR Code</span>
                            </div>
                          </li>
                          <li class="dropdown-item" @click="showRemoveCompanyFileFunc(file)">
                            <div class="flex justify-between w-full border-t border-gray-200">
                              <trash-can-icon width="16" height="16" class="inline-block float-left" />
                              <span>Remove</span>
                            </div>
                          </li>
                        </ul>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- End:: Files -->
      </div>
    </transition>
    <FilePagination :totalFile="totalFile" @setPage="setPage" />
    <upload-document-modal @resetUserFolder="resetUserFolder" :folder="fileProps" v-model="showUploadDocumentModal" />
    <CreateCompanyFolder @refresh="setRefresh" :userFile="userFile" @resetUserFile="resetUserFile"
      v-model="showCreateCompanyFolder" />
    <EditCompanyFolder @refresh="setRefresh" :file="fileProps" v-model="showEditCompanyFolder" />
    <EditCompanyFile @refresh="setRefresh" :file="fileProps" v-model="showEditCompanyFile" />
    <QrCode @refresh="setRefresh" :file="fileProps" v-model="showQrCode" />
    <DeleteCompanyFolder @refresh="setRefresh" :file="fileProps" v-model="showDeleteCompanyFolder" />
    <CreateTeam @refresh="setRefresh" v-model="showCreateTeam" />
    <DeleteCompanyFolder @refresh="setRefresh" :file="fileProps" v-model="showDeleteCompanyFolder" />
    <RemoveCompanyFile @refresh="setRefresh" :userFile="userFile" v-model="showRemoveCompanyFiles" />
    <PdfPapertagsModal @refresh="setRefresh" :file="userFile" v-model="showPapertagsModal" />
    <MoveCompanyFiles @refresh="setRefresh" :userFile="userFile" @resetUserFile="resetUserFile"
      @createFolderEmit="showCreateCompanyFolderFunc" v-model="showMoveCompanyFiles" />
    <ShareFilesModal @refresh="setRefresh" :userFile="userFile" @qrLoad="showQrcodeFileFunc"
      v-model="showShareCompanyFiles" />
    <RequestModal @refresh="setRefresh" :userFile="userFile" @qrLoad="showQrcodeFileFunc" v-model="showRequestModal" />
    <AddCompanyfiles @refresh="setRefresh" :file="fileProps" :totalFile="totalFile"
      @createFile="showUploadDocumentModal = true" v-model="showAddCompanyFiles" />
    <FilesInFolder :folder="FilesInFolerContent" v-model="showFilesInFolder" />
    <QrcodeShare :userFile="userFile" v-model="showQrcodeFiles" />
    <MaxPaperlinkModal v-model="showMaxPaperlinkModal" :totalFile="totalFile" />
    <PdfCCFlowModal :file="userFile" v-model="showCCFlowModal" />
  </div>
</template>
<script>
import Vue from 'vue'
import UploadDocumentModal from '../dashboard/UploadDocumentModal.vue'
import CompanyIcon from '../svg-icons/CompanyIcon.vue'
import EllipsisIconVerticalIcon from '../svg-icons/EllipsisIconVerticalIcon.vue'
import HeartOutlineIcon from '../svg-icons/HeartOutlineIcon.vue'
import SearchIcon from '../svg-icons/SearchIcon.vue'
import QrcodeIcon from '../svg-icons/QrcodeIcon.vue'
import PenIcon from '../svg-icons/PenIcon.vue'
import ShareOutlineIcon from '../svg-icons/ShareOutlineIcon.vue'
import ExportIcon from '../svg-icons/ExportIcon.vue'
import MoveIcon from '../svg-icons/MoveIcon.vue'
import ShareIcon from '../svg-icons/ShareIcon.vue'
import FileSolidIcon from '../svg-icons/FileSolidIcon.vue'
import RequestIcon from '../svg-icons/RequestIcon.vue'
import CopyIcon from '../svg-icons/CopyIcon.vue'
import TrashCanIcon from '../svg-icons/TrashCanIcon.vue'
import PdfPapertagsModal from '../pdf/modals/PdfPapertagsModal.vue'
import PdfCCFlowModal from '../pdf/modals/PdfCCFlowModal.vue'
import EmptyFileLedger from '../widgets/EmptyFileLedger.vue'
import FloatingActionButton from '../widgets/FloatingActionButton.vue'
import CreateCompanyFolder from './Tabs/CreateCompanyFolder.vue'
import CreateTeam from './Tabs/CreateTeam.vue'
import EditCompanyFolder from './Tabs/EditCompanyFolder.vue'
import EditCompanyFile from './Tabs/EditCompanyFile.vue'
import QrCode from './Tabs/QrCode.vue'
import DeleteCompanyFolder from './Tabs/DeleteCompanyFolder.vue'
import AddCompanyfiles from './Tabs/AddCompanyfiles.vue'
import RemoveCompanyFile from './Tabs/RemoveCompanyFile.vue'
import MoveCompanyFiles from './Tabs/MoveCompanyFiles.vue'
import ShareFilesModal from './Tabs/ShareFilesModal.vue'
import FolderPlusIcon from '../svg-icons/FolderPlusIcon.vue'
import PlusIcon from '../svg-icons/PlusIcon.vue'
import { mapState } from 'vuex'
import DateFormatter from '~/utils/DateFormatter'
import SpinnerDottedIcon from '../svg-icons/SpinnerDottedIcon.vue'
import QrcodeShare from './Tabs/QrcodeShare.vue'
import FilePagination from '../pagination/FilePagination.vue'
import UserTypeEnum from '~/models/UserTypeEnum'
import RequestModal from './Tabs/RequestModal.vue'
import TeamAccess from '~/models/TeamAccess'
import FilesInFolder from './Tabs/FilesInFolder.vue'
import MaxPaperlinkModal from './Tabs/MaxPaperlinkModal.vue'
export default Vue.extend({
  components: {
    EmptyFileLedger,
    FloatingActionButton,
    UploadDocumentModal,
    SearchIcon,
    ExportIcon,
    ShareIcon,
    PdfCCFlowModal,
    CopyIcon,
    FileSolidIcon,
    TrashCanIcon,
    CompanyIcon,
    RequestIcon,
    PlusIcon,
    MoveIcon,
    PenIcon,
    FolderPlusIcon,
    EllipsisIconVerticalIcon,
    HeartOutlineIcon,
    ShareOutlineIcon,
    CreateCompanyFolder,
    PdfPapertagsModal,
    CreateTeam,
    EditCompanyFolder,
    EditCompanyFile,
    QrCode,
    DeleteCompanyFolder,
    AddCompanyfiles,
    RemoveCompanyFile,
    MoveCompanyFiles,
    SpinnerDottedIcon,
    ShareFilesModal,
    QrcodeShare,
    FilePagination,
    FilePagination,
    RequestModal,
    FilesInFolder,
    MaxPaperlinkModal,
    QrcodeIcon
  },
  name: 'CompanyFileLedger',
  data() {
    return {
      showUploadDocumentModal: false,
      searchParam: '',
      returnedDataPage: 0,
      totalFile: null,
      showCreateCompanyFolder: false,
      showCreateTeam: false,
      showQrCode:false,
      showEditCompanyFolder: false,
      showEditCompanyFile:false,
      showDeleteCompanyFolder: false,
      folderProperty: '',
      showAddCompanyFiles: false,
      showRemoveCompanyFiles: false,
      showMoveCompanyFiles: false,
      showShareCompanyFiles: false,
      showQrcodeFiles: false,
      showCCFlowModal: false,
      showRequestModal: false,
      fileSpinner: true,
      folderSpinner: true,
      showPapertagsModal: false,
      folders: [],
      fileProps: {},
      userFile: {},
      refresh: false,
      show: false,
      folderSearch: '',
      returnedFolderPage: 0,
      totalFolder: null,
      showFilesInFolder: false,
      FilesInFolerContent: {},
      showUploadIcon: false,
      totalRegisteredPaperlink: null,
      showMaxPaperlinkModal: false,
      folderSelected: false
    }
  },
  methods: {
    async maxFileUpload() {
      this.$auth.user.subscriptionId && await this.$axios.get(`/subscriptions/${this.$auth.user.subscriptionId}`)
        .then((response) => {
          this.totalRegisteredPaperlink = response?.data?.paperlink
        })
        .finally(() => { this.showUploadIcon = true })
    },
    showUploadModalFunction() {
      if (!this.showUploadIcon) return
      if (this.totalFile >= this.totalRegisteredPaperlink)
        this.showMaxPaperlinkModal = true
      else
        this.showUploadDocumentModal = true
    },
    createdByTeamMember(val) {
      switch (this.$auth.user.role) {
        case (UserTypeEnum.TEAM):
          if (this.$auth.user.teamAccess == TeamAccess.COMPANY_FILE)
            return true
          else if (this.$auth.user.teamAccess == TeamAccess.OWN_FILE)
            return (this.$auth.user.id == val)
        case (UserTypeEnum.PAID):
          return true
      }
    },
    backFolder() {
      this.folderSelected = false;
      this.setRefresh();
    },
    showFolderFilesFunc(val) {
      this.FilesInFolerContent = val
      this.folderSelected = true;
      // this.showFilesInFolder = true
      this.$store.commit('ADD_USER', this.FilesInFolerContent.files || [])
    },
    resetUserFolder() {
      this.fileProps = {}
    },
    resetUserFile() {
      this.userFile = {}
    },
    setFolderPage(val) {
      this.returnedFolderPage = val
    },
    setPage(page) {
      this.returnedDataPage = page
    },
    setRefresh() {
      this.refresh = !this.refresh
    },
    showCreateCompanyFolderFunc() {
      this.showCreateCompanyFolder = true
    },
    showCreateTeamFunc() {
      this.showCreateTeam = true
    },
    showEditCompanyFolderFunc(file) {
      this.fileProps = file
      this.showEditCompanyFolder = true
    },
    showEditCompanyFileFunc(file) {
      this.fileProps = file
      this.showEditCompanyFile = true
    },
    showDeleteCompanyFolderFunc(file) {
      this.fileProps = file
      this.showDeleteCompanyFolder = true
    },
    showAddCompanyFolderFunc(file) {
      this.fileProps = file
      this.showAddCompanyFiles = true
    },
    showRemoveCompanyFileFunc(file) {
      this.userFile = file
      this.showRemoveCompanyFiles = true
    },
    showMoveCompanyFileFunc(file) {
      this.userFile = file
      this.showMoveCompanyFiles = true
    },
    showShareCompanyFileFunc(file) {
      this.userFile = file
      this.showShareCompanyFiles = true
    },
    showPapertagsModalFunc(file) {
      this.userFile = file
      this.showPapertagsModal = true
    },
    showCCFlowModalFunc(file) {
      this.userFile = file
      this.showCCFlowModal = true
    },
    showRequestModalFunc(file) {
      this.userFile = file
      this.showRequestModal = true
    },
    showQrcodeFileFunc() {
      this.showQrcodeFiles = true
    },
    formatDateTime(dateVal) {
      return `${DateFormatter.getDateString(
        dateVal
      )}  ${DateFormatter.getFormattedTime(dateVal)}`
    },
    async fetchFiles(page, search) {
      //---- checking the user role ---
      let paramsId = (this.$auth.user.role == UserTypeEnum.TEAM ? this.$auth.user.teamId : this.$auth.user.id)
      //<------------------- START: fetching of folder ------------>>
      await this.$axios.$get(`/files/?userId=${paramsId}&fileName[$like]=${search}%&$skip=${page}&$sort[updatedAt]=-1`, {
        params: {
          isEditing: 0
        }
      })
        .then((response) => {
          const filesData = response.data.map((el) => {
            return el
          })
          // set the data.file
          this.files = filesData
          // push files to store
          this.$store.commit('ADD_USER', this.files)
          // to stop spinner
          this.fileSpinner = false
          this.totalFile = response.total
        })
        .finally(() => {
          this.fileSpinner = false
        })
      //<------------------- START: fetching of folder ------------>>
    },
    async fetchFolder(page, search) {
      //---- checking the user role ---
      let paramsId = this.$auth.user.role == UserTypeEnum.TEAM ? this.$auth.user.teamId : this.$auth.user.id
      //<------------------- START: fetching of folder ------------>>
      await this.$axios
        .$get(`/folders/?userId=${paramsId}&name[$like]=${search}%&$sort[updatedAt]=-1&$skip=${page}`)
        .then((response) => {
          const filesData = response.data.map((el) => {
            return el
          })
          this.totalFolder = response.total
          // set the data.file
          this.folders = filesData
          // to stop spinner
          this.folderSpinner = false
        })
        .finally(() => {
          this.folderSpinner = false
        })
      //<------------------- START: fetching of folder ------------>>
    },
  },
  mounted() {
    this.fetchFiles(this.returnedDataPage, this.folderSearch)
    this.fetchFolder(this.returnedFolderPage, this.folderSearch)
    this.maxFileUpload()
  },
  filters: {
    removeExtension(filename) {
      return filename.replace(/\.[^\/.]+$/, '');
    }
  },
  computed: {
    // getting state from the store
    ...mapState(['filterUser', 'pdfUser']),
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
    teamMemberCanAccess() {
      switch (this.$auth.user.role + this.$auth.user.teamAccess) {
        case (UserTypeEnum.TEAM + TeamAccess.OWN_FILE):
          return false
        case (UserTypeEnum.TEAM + TeamAccess.COMPANY_FILE):
          return true
      }
    },
    isTeam() {
      return (this.$auth.user.role == UserTypeEnum.TEAM)
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
    refresh: function () {
      this.$nuxt.refresh()
      this.fetchFiles(this.returnedDataPage, this.folderSearch)
      this.fetchFolder(this.returnedFolderPage, this.folderSearch)
    },
    returnedDataPage: function () {
      this.fileSpinner = true
      this.fetchFiles(this.returnedDataPage, this.folderSearch)
    },
    returnedFolderPage: function () {
      this.folderSpinner = true
      this.fetchFolder(this.returnedFolderPage, this.folderSearch)
    },
    folderSearch: function () {
      this.folderSpinner = true
      this.fetchFolder(this.returnedFolderPage, this.folderSearch)
      this.fileSpinner = true
      this.fetchFiles(this.returnedDataPage, this.folderSearch)
    },
    "$auth.user": function () {
      this.fetchFiles(this.returnedDataPage, this.folderSearch)
      this.fetchFolder(this.returnedFolderPage, this.folderSearch)
      this.maxFileUpload()
    }
  },
})
</script>
<style lang="postcss" scoped>
.no-access {
  @apply p-2 text-[14px] capitalize;
}
.dropdown-item {
  border-top: 1px
}
.custom-table {
  height: fit-content;
  & th {
    @apply pt-8 pb-3 sm:text-[12px] md:text-base;
    background: var(--background);
    padding-top: 20px;
  }
  & td {
    @apply py-3 sm:text-[12px] md:text-base;
  }
}
</style>
