<template>
    <!-- Start:: Body -->
    <section class="bg-gradient-to-t from-white to-transparent text-center">
        <div class="container py-20">
            <div class="w-full max-w-md mx-auto bg-white shadow-2xl rounded-xl px-6 py-10">
          <message-alert-widget :message="alertMessage.message" v-show="alertMessage.message"
            :type="alertMessage.isSuccess ? 'success' : 'error'" class="mb-8" />
                <div class="flex justify-center pb-2">
                    <CheckedFillIcon width="70" />
                </div>
                <h1 class="text-lg font-medium mb-2 text-[#737373]">Reset Link Sent</h1>

                <div>
                    <span class="text-[12px] text-[#737373]">Haven't received the link on {{ user_email }} ?</span>
                    <button class="ml-1 text-paperdazgreen-300 text-[12px]" @click="handleClickResend"> Resend</button>
                </div>
                <div class="mt-6">
                    <span class="text-[12px] text-[#737373]">Need assistance?</span>
                    <button class="ml-1 text-paperdazgreen-300 text-[12px]"> Click here</button>
                </div>
            </div>
        </div>
    </section>
    <!-- end :: body -->
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
import CheckedFillIcon from '../components/svg-icons/CheckedFillIcon.vue'
import MessageAlertWidget from '~/components/widgets/MessageAlertWidget.vue'

export default Vue.extend({
    name: 'ResetPasswordSuccess',
    auth: 'guest',
    layout: 'landing',
    components: { SpinnerDottedIcon, CheckedFillIcon,
    MessageAlertWidget, },
    model: {
    },
    props: {
    },
    data() {
        return {
            user_email: localStorage.getItem("reset_user_mail"),
            alertMessage: {
                isSuccess: false,
                message: '',
            },
        }
    },
    watch: {

    },
    mounted() {
    },
    methods: {
        handleClickResend: function(){
            this.$axios
                .$post(`/users`, {
                    action: "forgot_password",
                    email: this.user_email
                })
                .then((response) => {
                    this.alertMessage.isSuccess = true
                    this.alertMessage.message = 'resend request'
                })
                .catch(({ response }) => {
                    this.alertMessage.isSuccess = false
                    this.alertMessage.message = response.data.message || 'unable to reset password'
                })
                .finally(() => {
                })
        }
    },
})

</script>
    
<style scoped>

</style>
    