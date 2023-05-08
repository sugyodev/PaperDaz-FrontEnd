<template>
  <section class="flex flex-wrap w-full md:justify-between font-family">
    <ballloader v-if="imageUpload" />
    <el-dialog :visible.sync="dialogVisible" id="profile-image-cropper" title="Profile Image" width="50%">
      <div>
        <div class="upload-example__cropper-wrapper">
          <cropper ref="cropper" class="upload-example__cropper" :stencil-size="{
            width: 140,
            height: 140
          }" :stencil-props="{
  handlers: {},
  movable: false,
  resizable: false,
  aspectRatio: 1,
}" :transitions="true" image-restriction="stencil" @change="updateSize" :default-boundaries="boundaries"
            :src="image.src" />
          <vertical-buttons>
            <square-button title="Zoom In" @click="zoom(2)">
              <img :src="require('~/assets/icons/zoom-in.svg')" />
            </square-button>
            <square-button title="Zoom Out" @click="zoom(0.5)">
              <img :src="require('~/assets/icons/zoom-out.svg')" />
            </square-button>
            <square-button title="Move Top" @click="move('top')">
              <img :src="require('~/assets/icons/arrow-top.svg')" />
            </square-button>
            <square-button title="Move Left" @click="move('left')">
              <img :src="require('~/assets/icons/arrow-left.svg')" />
            </square-button>
            <square-button title="Move Right" @click="move('right')">
              <img :src="require('~/assets/icons/arrow-right.svg')" />
            </square-button>
            <square-button title="Move Bottom" @click="move('bottom')">
              <img :src="require('~/assets/icons/arrow-bottom.svg')" />
            </square-button>
          </vertical-buttons>
          <div class="upload-example__reset-button" title="Reset Image" @click="reset()">
            <img :src="require('~/assets/img/reset.svg')" />
          </div>
          <div class="upload-example__file-type" v-if="image.type">
            {{ image.type }}
          </div>
        </div>
        <div class="upload-example__buttons-wrapper">
          <button class="upload-example__button" @click="$refs.file2.click()">
            <input ref="file2" type="file" accept="image/*" @change="loadImage($event)" />
            Browse image
          </button>

        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveImage">
            Upload
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- logo container -->
    <div class="bg-white md:w-3/12 lg:w-[19%] w-full profile-image-container">
      <div class="icon-img relative" @click="toggleShow">
        <input type="file" class="hidden" v-show="false" @change="uploadProfilePicture" ref="referenceInput" />
        <img v-if="profilePhoto != null" :src="profilePhoto" id="referenceImg"
          class="top-profile-image cursor-pointer" />
        <span v-else>
          {{ firstCompanyName }}
        </span>
      </div>
      <div v-if="isUser" class="text-wrapper" @click="toggleShow">Click to upload an image</div>
    </div>
    <!-- end of logo container -->
    <!-- dentals container -->
    <div class="bg-white sm:w-12/12 md:w-9/12 lg:w-[80%] w-full profile-dental-container">
      <!-- <h1>{{user.companyName || ''}}</h1> -->
      <div class="input-wrapper-title">
        <!-- <input type="text" v-model="name" placeholder="Apple Dental" :disabled="true"
          class="text-black text-2xl" /> -->
        <span class="text-2xl text-grey pl-3"> {{ userInfo.companyName }}</span>
        <button @click="toggleInput" class="float-right">
          <Pencil :width="18" />
        </button>
      </div>
      <!--<div class="text-sm px-2 border-b w-full py-2 text-gray-400"><i>@hookname</i></div>-->
      <div class="input-wrapper">
        <input type="text" v-model="address" placeholder="Company`s address" :disabled="editEnalble"
          :class="[editEnalble ? 'text-gray-400' : 'text-black']" />
        <!-- <button v-if="isUser" @click="toggleInput">
          <Pencil v-if="initialInput" :width="18" />
          <span class="text-[15px] font-[900] text-paperdazgreen-500" v-else>&#x2715;</span>
        </button> -->
      </div>
      <div class="input-wrapper">
        <input type="number" v-model="phone" placeholder="Company`s phone number" :disabled="editEnalble"
          :class="[editEnalble ? 'text-gray-400' : 'text-black']" />
        <!-- <button v-if="isUser" @click="toggleInput2">
          <Pencil v-if="initialInput2" :width="18" />
          <span class="text-[15px] font-[900] text-paperdazgreen-500" v-else>&#x2715;</span>
        </button> -->
      </div>
      <div class="w-full grid place-items-center">
        <button
          class="w-[160px] flex justify-center items-center text-white py-2 mt-3 text-center border-none bg-paperdazgreen-400 rounded-md"
          v-if="showUpdateButton" :class="[isLoading ? 'opacity-50' : 'opacity-100']" :disabled="isloading"
          @click="patchUser">
          Update
          <SpinnerDottedIcon v-if="isLoading" height="20" width="20" class="animate-spin ml-2" />
        </button>
      </div>
    </div>
    <!-- end of dentals container -->
  </section>
</template>
<style src="~/assets/cropper.css">

</style>
<script>
import Pencil from '~/assets/recent-icons/pencil.vue'
import Vue from 'vue'
//   import VueQrcode from 'vue-qrcode'
import QRCode from 'qrcode'
import login from '~/mixins/login'
import mixins from 'vue-typed-mixins'
import SpinnerDottedIcon from '../svg-icons/SpinnerDottedIcon.vue'
import ballloader from '../loader/ballloader.vue'
import { ErrorHandler } from '~/types/ErrorFunction'
import { Cropper } from 'vue-advanced-cropper';
import VerticalButtons from './cropper/VerticalButtons';
import SquareButton from './cropper/SquareButton';
//import 'vue-advanced-cropper/dist/style.css';
// This function is used to detect the actual image type,
function getMimeType(file, fallback = null) {
  const byteArray = new Uint8Array(file).subarray(0, 4);
  let header = '';
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }
  switch (header) {
    case '89504e47':
      return 'image/png';
    case '47494638':
      return 'image/gif';
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'image/jpeg';
    default:
      return fallback;
  }
}
export default mixins(login).extend({
  name: 'profile-top-info',
  props: ['userInfo'],
  data() {
    return {
      editEnalble: true,
      showScanner: false,
      profilePicsSrc: '',
      qrCls: 'qrcode',
      qrText: 'https://photophobic.web.app',
      size: 170,
      background: 'transparent',
      phone: '',
      address: '',
      name: '',
      profilePhoto: null,
      isLoading: false,
      imageUpload: false,
      dialogVisible: false,
      image: {
        src: null,
        type: null,
      },
      size: {
        width: null,
        height: null,
      },
    }
  },
  // async asyncData({ params, query, $axios}) {
  //    let companyUser = $axios.get(`/users/${}`)
  // },
  components: { Pencil, SpinnerDottedIcon, Cropper, VerticalButtons, SquareButton, ballloader },
  methods: {
    toggleShow() {
      //this.show = !this.show;
      //this.imageUpload = true;
      this.dialogVisible = !this.dialogVisible
    },
    getTeamPublicFolder() {
      this.$axios.get()
    },
    patchUser() {
      if (
        (this.address.trim() == '' && this.phone.trim() == '') ||
        this.isLoading
      )
        return
      this.isLoading = true
      this.$axios
        .$patch(`/users/${this.$auth.user.id}`, {
          address: this.address,
          phone: this.phone
        })
        .then(() => {
          this.$notify.success({
            message: 'Updated successfully'
          })
          this.initialInput = true
          this.initialInput2 = true
          this.showUpdateButton = false
          this.isLoading = false
        })
        .catch(({ response }) => {
          let message = ErrorHandler(response)
          this.$notify
            .error({
              message: message
            })
            .finally(() => {
              this.isLoading = false
            })
        })
    },
    toggleInput() {
      this.editEnalble = !this.editEnalble
    },
    changeProfileimage() {
      // console.log('change image');
      // if (!this.isUser) return;
      //this.$refs.referenceInput.click()
    },
    async uploadProfilePicture(event) {
      // if (!this.isUser) return;
      let fileInput = event.target
      if (
        fileInput.files.length < 1 ||
        fileInput.files[0].size / 1024 / 1024 > 2
      ) {
        this.$notify.error({
          message: 'File size must be less than 2MB'
        })
        return
      }
      let formdata = new FormData()
      formdata.append('upload', fileInput.files[0], 'user-profile-picture.jpg')
      formdata.append('type', 'profilePicture')
      formdata.append('userId', this.user.id)
      await this.$axios
        .$patch(`/files`, formdata)
        .then((response) => {
          //@ts-ignore
          //console.log("response",response.profilePicture)
          this.profilePhoto = response.profilePicture;
          this.filterUsers()
        })
        .catch(() => {
          this.$notify.error({
            message: 'Unable to upload profile picture'
          })
        })
    },
    async uploadProfilePicture2(image) {
      this.imageUpload = true;
      let formdata = new FormData()
      formdata.append('upload', image, 'user-profile-picture.jpg')
      formdata.append('type', 'profilePicture')
      formdata.append('userId', this.user.id)
      await this.$axios
        .$patch(`/files`, formdata)
        .then((response) => {
          //@ts-ignore
          //console.log("response",response.profilePicture)
          this.profilePhoto = response.profilePicture;
          this.dialogVisible = false;
          this.imageUpload = false;
          this.reset();
          this.filterUsers()
        })
        .catch(() => {
          this.imageUpload = false;
          this.$notify.error({
            message: 'Unable to upload profile picture'
          })
        })
    },
    saveImage() {
      const { canvas } = this.$refs.cropper.getResult();
      canvas.toBlob((blob) => {
        //saveAs(blob);
        this.uploadProfilePicture2(blob);
      }, this.image.type);
    },
    reset() {
      this.image = {
        src: null,
        type: null,
      };
      const input = this.$refs.file2
      input.type = 'text'
      input.type = 'file'
    },
    loadImage(event) {
      // Reference to the DOM input element
      const { files } = event.target;
      // Ensure that you have a file before attempting to read it
      if (files && files[0]) {
        // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
        if (this.image.src) {
          URL.revokeObjectURL(this.image.src);
        }
        // 2. Create the blob link to the file to optimize performance:
        const blob = URL.createObjectURL(files[0]);
        // 3. The steps below are designated to determine a file mime type to use it during the
        // getting of a cropped image from the canvas. You can replace it them by the following string,
        // but the type will be derived from the extension and it can lead to an incorrect result:
        //
        // this.image = {
        //    src: blob;
        //    type: files[0].type
        // }
        // Create a new FileReader to read this image binary data
        const reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.image" refers to the image of Vue component
          this.image = {
            // Read image as base64 and set it as src:
            src: blob,
            // Determine the image type to preserve it during the extracting the image from canvas:
            type: getMimeType(e.target.result, files[0].type),
          };
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsArrayBuffer(files[0]);
      }
    },
    zoom(factor) {
      this.$refs.cropper.zoom(factor);
    },
    move(direction) {
      if (direction === 'left') {
        this.$refs.cropper.move(-this.size.width / 4);
      } else if (direction === 'right') {
        this.$refs.cropper.move(this.size.width / 4);
      } else if (direction === 'top') {
        this.$refs.cropper.move(0, -this.size.height / 4);
      } else if (direction === 'bottom') {
        this.$refs.cropper.move(0, this.size.height / 4);
      }
    },
    updateSize({ coordinates }) {
      this.size.width = Math.round(coordinates.width);
      this.size.height = Math.round(coordinates.height);
    },
    boundaries({ cropper, imageSize }) {
      return {
        width: cropper.clientWidth,
        height: cropper.clientHeight,
      };
    },
  },
  destroyed() {
    // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
  },
  mounted() {

    console.log('>>>>>>>>>>>>???', this.userInfo)
    this.phone = this.userInfo?.phone
    this.address = this.userInfo?.address
    this.name = this.userInfo?.companyName
    //this.profilePhoto = this.userInfo?.profilePhoto
    // QRCode.toCanvas(this.$refs.qrcancas, this.qrCodeurl, function () {});
    //  await this.$nextTick()
    // ;(this.$refs.qrcancas as HTMLElement).removeAttribute('style')
    // ;(this.$refs.qrcancas as HTMLElement).removeAttribute('height')
    // ;(this.$refs.qrcancas as HTMLElement).removeAttribute('width')
    //     },
  },
  computed: {
    firstCompanyName() {
      return (this.userInfo?.companyName || '').charAt(0).toUpperCase()
    },
    showUpdateButton() {
      return !this.editEnalble || !this.editEnalble
    },
    qrCodeurl() {
      return `${window.origin}/public/profile/${this.userInfo?.id}`
    },
    login() {
      return this.$auth.loggedIn
    },
    user() {
      return this.$auth?.user
    },
    isUser() {
      return this.user?.id == this.userInfo?.id
    },
    /*profilePhoto () {
      return this.userInfo?.profilePicture
    }*/
  },
  watch: {
    '$auth.user': function () {
      this.address = this.$auth.user?.address || ''
      this.phone = this.$auth.user?.phone || ''
      // QRCode.toCanvas(this.$refs.qrcancas, this.qrCodeurl, function () {});
    },
    userInfo(newValue, oldValue) {
      this.profilePhoto = newValue.profilePicture;
      //this.params.userId = newValue.id;
      //console.log("newValue", newValue.profilePicture, oldValue)
    }
  }
})
</script>
<style lang="scss" scoped>
.font-family {
  font-family: inherit !important;
}

.profile-image-container {
  @apply bg-white flex justify-center flex-wrap items-center py-4 rounded-[10px];

  .icon-img {
    @apply w-40 h-40 font-[900] text-[6em] text-paperdazgreen-500 cursor-pointer border-2 border-paperdazgreen-400/60 grid place-items-center rounded-[8px];
    text-shadow: 1px 5px 7px rgb(148 148 148);
  }

  .text-wrapper {
    @apply block w-full text-center text-[0.8rem] text-paperdazgray-400 mt-1;
  }
}

.profile-dental-container {
  @apply py-4 rounded-[10px];

  h1 {
    @apply border-b-2 border-paperdazgray-200 py-4 text-[1.2rem] pl-4 font-medium;
  }

  .input-wrapper {
    @apply border-paperdazgray-200 py-2;

    input {
      @apply border-none bg-transparent px-3 text-[16px];
      width: calc(100% - 40px);
      outline: none !important;
    }

    button {}
  }

  .input-wrapper-title {
    @apply py-2;

    input {
      @apply border-none bg-transparent px-3 text-[24px];
      width: calc(100% - 40px);
      outline: none !important;
    }
  }
}

.scanner-container {
  @apply bg-white rounded-[10px] py-4;

  b {
    @apply block text-center text-[0.8rem];
  }
}

.top-profile-image {
  @apply absolute w-[90%] h-[90%] mt-[5%] ml-[5%] object-cover rounded-lg m-2;
}

.spinner-container {
  z-index: 9999;
}
</style>