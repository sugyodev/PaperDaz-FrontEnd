<template>
  <form @submit.prevent="onSubmit" ref="form" class="profile-info-form grid grid-cols-1 gap-5">
    <message-alert-widget :message="errorMessage" v-show="errorMessage" type="error" class="my-2 w-[100%] ml-[0%]" />

    <div class="flex justify-between w-full">
      <div class="mx-2 w-1/2">
        <label for="">Email</label>
        <el-input placeholder="email" v-model="formData.email" type="text" :disabled="!editingDetails" />
      </div>
      <div class="mx-2 w-1/2">
        <label for="">Phone</label>
        <el-input v-model="formData.phone" placeholder="Enter phone number..." :disabled="!editingDetails"
          type="phone" />
      </div>
    </div>

    <div class="mx-2 w-full">
      <label for="">Business Name</label>
      <el-input placeholder="business name" class="pr-4" v-model="formData.name" type="text"
        :disabled="!editingDetails" />
    </div>
    <div class="flex justify-between w-full">
      <div class="mx-2 w-1/2">
        <label for="" class="mb block">Country</label>
        <input ref="countryInitial" class="custom-input py-2 px-2 text-[14px] width-full pl-4 text-paperdazgray-300"
          :class="[
            editingDetails == false ? 'text-black' : 'text-paperdazgray-300',
          ]" v-model="country" :disabled="!editingDetails" @input="displayCountry" type="text" placeholder="country" />
        <div v-if="setDropDown" class="dropdown cursor-pointer z-10">
          <div v-for="(country, i) in dropDownContent" class="flex items-center my-2 px-1">
            <img :src="country.flags.png" class="w-8 h-6 rounded-md mr-2 dd-image" />
            <li @click="setCountryInfo" :id="country.dial_code">
              {{ country.name.common }}
            </li>
          </div>
        </div>
      </div>
      <div class="mx-2 w-1/2">
        <label for="">Timezone</label>
        <el-select placeholder="Timezone" class="w-full" filterable v-model="formData.timezone"
          :disabled="!editingDetails">
          <el-option :value="timezone" :label="timezone" v-for="(timezone, i) in timezones" :key="i" />
        </el-select>
      </div>
    </div>
    <transition name="fade">
      <div class="flex items-center justify-center mt-2" v-show="editingDetails">
        <button :disabled="!editingDetails || loading"
          class="shadow h-10 px-5 text-white rounded-md bg-paperdazgreen-300 disabled:opacity-50">
          <span class="inline-flex items-center gap-3">
            <span>Update</span>
            <transition name="fade" :duration="100">
              <span v-show="loading" class="animate-spin">
                <spinner-dotted-icon height="22" width="22" />
              </span>
            </transition>
          </span>
        </button>
      </div>
    </transition>
  </form>
</template>

<script>
import Vue from 'vue'
import mixins from 'vue-typed-mixins'
import InputField from '~/components/widgets/InputField.vue'
import AuthUser from '~/models/AuthUser'
import timezones from '~/assets/json/timezones'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import login from '~/mixins/login'
import { countryCode } from '~/assets/json/countryCode'
import { countryList } from '~/assets/json/coutry'
import MessageAlertWidget from '~/components/widgets/MessageAlertWidget.vue'
import { ErrorHandler } from '~/types/ErrorFunction'

export default mixins(login).extend({
  name: 'CompanyForm',
  components: { InputField, SpinnerDottedIcon, MessageAlertWidget },
  data() {
    return {
      dropDownContent: [],
      setDropDown: false,
      country: '',
      state: '',
      errorMessage: '',
      formData: {
        name: (this.$auth.user.companyName),
        email: (this.$auth.user.email),
        state: '',
        country: '',
        phone: '',
        timezone: ''
      },
      countries: [],
      states: [],
      timezones,
      loading: false,
      errorMessage: '',
    }
  },
  props: {
    editingDetails: {
      type: Boolean,
      default: false,
    },
  },
  async fetch() {
    await this.fetchCountries()
    await this.fetchStates()

    this.formData.state = this.$auth.user ? this.$auth.user.state : ''
  },
  mounted() {
  },
  beforeMount() {
    for (const key of Object.keys(this.formData)) {
      if ((this.$auth?.user)[key]) this.formData[key] = this.$auth.user[key]
    }
    ; (this.country = this.$auth.user.country),
      (this.state = this.$auth.user.state)
  },
  methods: {
    inputValid(val, title) {
      let valid = true
      let format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/
      if (format.test(val)) {
        this.errorMessage = `${title} format not correct`
        valid = false
      }
      return valid
    },
    inputPhone(val, title) {
      let valid = true
      let format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~a-zA-Z]/
      if (format.test(val)) {
        this.errorMessage = `${title} format not correct`
        valid = false
      }
      return valid
    },
    cancleOut(e) {
      if (e.target.tagname != 'LI') {
        this.setDropDown = false
      }
    },
    setCountryInfo(e) {
      this.country = e.target.textContent.trim().toLowerCase()
      this.setDropDown = false

      //set the state AND TIMEZONE
      try {
        let countryData = countryList.filter((item) =>
          item.name.common.toLowerCase().startsWith(this.country)
        )[0]
        this.formData.timezone = countryData.timezones[0]
        this.state = countryData.capital[0]
      } catch (err) {
        this.state = ''
      }
    },
    displayCountry() {
      if (this.country.trim() != '') {
        this.setDropDown = true

        this.dropDownContent = countryList
          .map((item) => item)
          .filter((item) =>
            item.name.common.toLowerCase().startsWith(this.country)
          )
          .sort((a, b) => a.name.common.localeCompare(b.name.common))
      } else {
        this.setDropDown = false
      }
    },

    fetchCountries() { },
    fetchStates() { },
    onSubmit() {
      event?.preventDefault()

      if (!(this.inputValid(this.formData.name, 'Company name') &&
        // this.inputValid(this.formData.email, 'Email') &&
        this.inputValid(this.country, 'Country') &&
        this.inputPhone(this.formData.phone, 'Phone'))) {
        this.$refs.form.scrollIntoView()
        return
      }

      // return

      let newFormData = {
        ...this.formData,
        companyName: this.formData.name,
        country: this.country,
      }

      if (this.loading) return
      let userId = this.$auth.user?.id
      this.loading = true
      this.errorMessage = ''
      this.$axios
        .$patch(`/users/${userId}`, newFormData)
        .then(async () => {
          this.filterUsers()
          this.$notify.success({
            title: 'Data write',
            message: 'Data updated successfully!',
          })

          this.loading = false
          await this.$nextTick()
          this.$emit('stop-editing')
        })
        .catch(({ response }) => {
          let message = ErrorHandler(response)
          this.errorMessage = message
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  watch: {
    '$auth.user': function () {
      for (const key of Object.keys(this.formData)) {
        this.formData[key] = this.$auth.user ? this.$auth.user[key] : ''
      }
      this.formData.name =
        this.$auth.user.companyName
    },
  },
  mounted: function () {
  }
})
</script>

<style lang="postcss" scoped>
.profile-info-form label {
  @apply block font-medium mb-0.5;
  color: #282533;
}

.dropdown {
  @apply absolute top-[100%] left-0 w-full bg-white p-2;
  max-height: 150px;
  overflow-y: scroll;
  margin-top: 5px;
  border-radius: 5px;
  box-shadow: 1px 3px 5px rgba(203, 206, 206, 0.692);
}

.dropdown::-webkit-scrollbar {
  width: 5px;
  height: 3px;
  cursor: pointer;
}

.dropdown::-webkit-scrollbar-thumb {
  @apply bg-paperdazgreen-400;
  width: 5px;
  border-radius: 50px;
  cursor: pointer;
}

.dropdown::-webkit-scrollbar-track {
  cursor: pointer;
  @apply border-[1px] border-transparent;
}

.dropdown>div>li {
  list-style-type: none;
  @apply py-2 px-1;
  transition: 0.2s;
}

.dd-image {
  transition: 0.2s;
}

.dropdown>div:hover .dd-image {
  width: 20px;
  height: 20px;
  border-radius: 50px;
}

.dropdown>div>li:hover {
  padding-left: 10px;
}

.custom-input {
  @apply w-12 text-center outline-none rounded-lg border-[1px] border-paperdazgray-200 mr-2;
}

.width-full {
  width: 100%;
  text-align: left;
}
</style>
