<template>
    <div>
       <div class="g-signin2" data-onsuccess="onSignIn"></div>
    </div>
</template>

<script>
    export default {
   name:"google-sign",
    head() {
    return {
        meta:[
            { name: 'google-signin-client_id', content:'287621881624-vdt9hrug587dva8hvla8dlhidc73kdbu.apps.googleusercontent.com' },
        ],
      script: [
        // ...
        {
          src: 'https://apis.google.com/js/platform.js',
          defer: true,
          async: true
        },
      ],
    }
  },
  methods:{
    onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    }
  }
    }
</script>

<style scoped>

</style>