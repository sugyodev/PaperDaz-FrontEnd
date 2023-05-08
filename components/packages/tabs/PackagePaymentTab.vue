<template>
  <div class="">
    <div class="flex flex-wrap w-full justify-center">
      <div class="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mb-3">
        <package-card :edited="false" :create="false" show-bottom-button class="package-card-check-width"
          :style="{ '--count': 1 }" @bottom-button-clicked="$emit('next-tab', $event)" :stagingPackage="stagingPackage"
          :disableStart="true" />
      </div>
      <div class="w-full sm:w-full md:w-2/3 lg:w-2/3">
        <form class="" @submit="submit">
          <div class="form-group">
            <label class="input-label font-bold" for="">Create business Name
            </label>
            <el-input :disabled="loading" placeholder="Name Surname" required v-model="companyName" />
          </div>
          <div class="h-1 bg-black"></div>
          <div class="h-4"></div>
          <div class="grid mb-10">
            <label class="input-label font-bold" for="">
              Credit Card
              <img class="float-right inline w-[134px]" src="~/assets/img/payment.png" />
            </label>
          </div>
          <message-alert-widget class="mb-7" :message="errorMessage" v-if="errorMessage" :type="'error'" />

          <div class="form-group">
            <label class="input-label" for="">Name of card holder</label>
            <el-input :disabled="loading" placeholder="Name Surname" required v-model="name" />
          </div>
          <div class="form-group">
            <label class="input-label" for="">Card Number</label>
            <el-input :disabled="loading" placeholder="0000-0000-0000-0000" :value="cardNumberWithDashes"
              @input="inputCardNumber" required />
          </div>
          <div class="grid gap-5 grid-cols-2">
            <div class="form-group">
              <label class="input-label" for="">Expiration Date</label>
              <el-input :disabled="loading" placeholder="MM/YY" required :value="expirationDateWithSlashes"
                @input="inputExpirationDate" />
            </div>
            <div class="form-group">
              <label class="input-label" for="">CVC</label>
              <el-input :disabled="loading" placeholder="000" required v-model="cvv" type="password" maxlength="3" />
            </div>
          </div>

          <div class="grid place-items-center mt-6">
            <button class="rounded-lg bg-paperdazgreen-400 shadow text-sm h-10 px-6 disabled:bg-opacity-50 w-full"
              :disabled="loading">
              <span class="inline-flex items-center gap-3 ">
                <span>Pay {{
                  this.packageData?.plan == "yearly" ? (stagingPackage || {}).yearlyPrice : (stagingPackage ||
                    {}).monthlyPrice
                }}</span>
                <transition name="fade" :duration="100">
                  <span v-show="loading" class="animate-spin">
                    <spinner-dotted-icon height="22" width="22" />
                  </span>
                </transition>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import PaymentIcon from '~/components/svg-icons/PaymentIcon.vue'
import MessageAlertWidget from '~/components/widgets/MessageAlertWidget.vue'
import login from '~/mixins/login'
import { ErrorHandler } from '~/types/ErrorFunction'
import PackageCard from '~/components/settings/PackageCard.vue'
import UserTypeEnum from '~/models/UserTypeEnum'
export default Vue.extend({
  components: { SpinnerDottedIcon, MessageAlertWidget, PackageCard },
  name: 'PackagePaymentTab',
  data() {
    return {
      loading: false,
      errorMessage: '',
      cardNumberWithDashes: '',
      name: '',
      cvv: '',
      cardId: undefined,
      expirationDateWithSlashes: '',
      companyName: '',
      createFlage: true
    }
  },
  props: {
    stagingPackageInfo: {
      type: Object,
      default: () => ({}),
    },
    packages: {
      type: Array,
      default: () => [],
    },
  },
  async beforeMount() {
    !this.$auth.loggedIn ? this.notLoggedIn() : null
  },
  computed: {
    ...mapState(['setPackage', 'createPackage']),
    packageData() {
      let newPackageData
      let {
        name,
        paperlink,
        teamMembers,
        monthlyPrice,
        id,
        isMonthly,
        userId,
        yearlyPrice,
        publicProfile,
        companyLedger,
        activationCode,
        cc,
        companyName,
        companyEmail,
      } = this.setPackage
      if (this.createPackage && this.createPackage == true) {
        newPackageData = {
          plan: isMonthly ? 'monthly' : 'yearly',
          action: 'subscribe',
          companyName,
          companyEmail,
          custom: {
            name,
            paperlink,
            teamMembers,
            publicProfile,
            companyLedger,
            cc,
          },
        }
        return newPackageData
      } else if (this.createPackage == false) {
        newPackageData = {
          packageId: id,
          action: 'subscribe',
          companyName,
          companyEmail,
          plan: isMonthly ? 'monthly' : 'yearly',
        }
        return newPackageData
      }
    },
    cardNumber() {
      return this.cardNumberWithDashes.replace(/-+/g, '')
    },
    expirationDateString() {
      return this.expirationDateWithSlashes.split('/').join('') || ''
    },
    expYear() {
      return this.expirationDateString.split('').splice(2, 4).join('')
    },
    expMonth() {
      return this.expirationDateString.split('').splice(0, 2).join('')
    },
    stagingPackage() {
      return this.$store.state.setPackage
    },
  },
  methods: {
    notLoggedIn() {
      localStorage.setItem(
        'package-not-loggedin',
        JSON.stringify(this.setPackage)
      )
      localStorage.setItem('create-package-not-loggedin', this.createPackage)
      this.$nuxt.$router.push('/register')
    },
    inputCardNumber(val) {
      if (val.length > 19) return;
      let temp = val.replace(/(-+)|([^0-9]+)/g, '')
      this.cardNumberWithDashes = (temp.match(/.{1,4}/g) || []).join('-')
    },
    inputExpirationDate(val) {
      let temp = val.replace(/\/+|[^0-9]+/g, '')
      if (temp.length > 4) return

      // Check if the month is greater than 12
      if (temp.length === 2) {
        if (Number(temp) > 12) temp = '0' + temp
        if (Number(temp) == 0) temp = '01'
      }

      if (temp.length == 4 && Number(temp.substring(2, 4)) == 0) {
        temp = temp.substring(0, 2) + '01'
      }

      let finalVal = (temp.match(/.{1,2}/g) || []).join('/')
      this.expirationDateWithSlashes = finalVal
    },
    updateCard(id, data) {
      return this.$axios.$patch(`/card/${id}`, data).catch((error) => {
        let message = ''
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message = error.response.data.message
        } else {
          message = 'Server not reachable'
        }
        this.errorMessage = message
        this.loading = false
      })
    },

    async submit(event) {
      event?.preventDefault()

      if (!this.expYear || !this.expMonth || isNaN(this.cvv)) {
        this.errorMessage = 'Please review the inputed information'
        return
      }

      //code to check if name contains special symbols
      // var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/
      // this.errorMessage = 'Name not correct'
      // if (format.test(this.name.trim())) return

      // var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/
      // this.errorMessage = 'Company name not correct'
      // if (format.test(this.companyName.trim())) return

      if (this.loading) return

      const userId = (this.$auth.user || { id: '' }).id

      const data = {
        card_holder_name: this.name,
        card_number: this.cardNumber,
        exp_year: this.expYear,
        exp_month: this.expMonth,
        cvv: this.cvv,
      }

      this.loading = true
      this.errorMessage = ''

      let proceedToPayment = false

      await this.$axios
        .$post('/cards', data)
        .then((response) => {
          let { id } = response
          this.cardId = id
          proceedToPayment = true
        })
        .catch(async ({ response }) => {
          this.errorMessage = ErrorHandler(response)
          this.loading = false
        })

      if (!proceedToPayment) {
        this.loading = false
        return
      }
      this.$axios
        .$post('/subscriptions', {
          ...this.packageData,
          companyName: this.companyName,
          createFlage: true,
          cardId: this.cardId
        })
        .then(async () => {
          this.$notify.success({
            title: 'Package Subscription',
            message: 'You have successfully subscribed for this package',
          })
          setTimeout(() => {
            this.$nuxt.$router.push('/dashboard');
            this.$store.commit('SET_CONGRAT_SUCCESS');
          }, 1000)
        })
        .catch(async ({ response }) => {
          this.errorMessage = ErrorHandler(response)
          await this.$axios.$delete(`/cards/${this.cardId}`)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  mounted() {
    // console.log(this.$store.state.setPackage, 'packages')
  },
})
</script>

<style lang="scss" scoped>
form {
  @apply p-6 rounded-xl border-4 border-paperdazgreen-400;
  width: 100%;
  max-width: 580px;
  margin: 0 auto;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.input-label {
  @apply font-bold text-sm block;

  &+* {
    @apply mt-1;
  }
}

.form-group {
  &:not(:last-child) {
    @apply mb-5;
  }
}
</style>
