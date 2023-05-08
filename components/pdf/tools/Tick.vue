<template>
  <div class="text-field tool">
    <svg ref="tickbox" :style="style" viewBox="0 0 20 19" fill="black" xmlns="http://www.w3.org/2000/svg">
      <path svgToImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA5CAYAAACMGIOFAAAAAXNSR0IArs4c6QAAAyJJREFUaEPlmuFx1DAUhDcVQAl0AKkAqACoAFIBUAFQAaQCSAWQCoAKAhVAOggVwHwz5xthJGsl63yW0a9LTrb16a3eSu98ov+gnWyU8Y6kpzu28y1CvpX0Igje5dYg30t6NlbnliDfSXoeWX7XW4EkekQx1i62AHlP0tVEAj3tHRLAz5Jup6LIGu0ZEjAAAY21X5KwkpueIZFoChDoJ5I+8aFXyKhVhN4o6fHwd4+QGD2Gn2p7mfYKOWUVA9Nepj1C5jIpTJehTHuDJEuSaFJWAc8/Mu0JMmcVSZn2BIkXPsgcCaMy7QUyZxWTMu0B0smkcLyUxAkk2dbqkxj5x4xE+fqrIeVV7ngcqxhkSt+fuclYWyTJpD8yVjEwZWW6xjXpWoUt0zVCsgb3m+rM3tSS6dogU/WZGKst0zVBulZRLNO1QLKTYUfjNPamRTJNQfLQR8GJm/R8IemLM4rCPq5VFGfT8ThCC5naQgHJOe2mECTVnUzKqYLThdMs00/daIB09ojfJD1sBJqrz4TjrZZpKNeShU9EAZ3TnAkN7/9G0us5DySSVLRYh277IOnM7Tzqx2BfFVz7PVORs24F5G+r59+dama3RDHD004lsUxmtVpIHko0iarTcqX82D1qJjI6FiCZqbvOSCN9WJ85eym1Ch7TRKZh4ildJyErlgJoSlIlm+7wvk1kGkIyEKJRG01AGVTsXOfUZ8YCaSbTEJLPSArQW5WyjXloqVU0l+kYshUoEaXlSvmpuWwq0xgk/6tJ8+GAybZswVK/+k4JpblMU5AtQGsU3zSbjgeQqvEQkeE9mJpBl15zEJlORXL4binQg8nUgZxrLU40r3eZvdURLvrMXEny0KDOjsmZrMk+OUgu5mCLD9Z6aGoA56PXw2bDpG7gQLbw0PHzF5GpsybHA3N/n3AisohMayBbeehiMq2F5LqSQvBRZToHkmtrPXRRmc6F5HpOLfedBbjrs7hMW0CWeOii2dTdu7oBckCpm1KZn12QcgfVGpL7AcoajZU1OV1wfDsaIAN0NwPOJFJdIGLDC0XUc48K12JNOuCr6PMH4NmYqXAqaIYAAAAASUVORK5CYII=" options="fill"
        d="M7.23415 19C6.61458 19 6.02394 18.7368 5.61845 18.2763L0.51216 12.4731C-0.252486 11.6039 -0.14912 10.2957 0.743192 9.55085C1.63511 8.80517 2.97802 8.90586 3.74357 9.77552L7.08178 13.5691L17.6323 1.17605C19.2654 -1.05235 20.9748 0.181643 19.3344 2.41957L8.9652 18.132C8.5848 18.6505 7.98094 18.9697 7.32779 18.9979C7.29626 18.9992 7.26523 19 7.23415 19Z"
        fill="black" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    scale: Number,
    generatePDF: Boolean,
  },
  data() {
    return {
      svgToImageData: ''
    }
  },
  watch: {
    // generatePDF: function () {
    //   if (this.generatePDF)
    //     this.svgToImage()
    // },
  },
  computed: {
    style() {
      return {
        width: `${(this.scale || 1) * 11}px`,
        height: `${(this.scale || 1) * 11}px`,
      }
    },
  },
  methods: {
    async svgToImage() {
      this.svgToImageData = '';
      let dataPAz = ''
      await htmlToImage.toPng(this.$refs.tickbox)
        .then(function (dataUrl) {
          dataPAz = dataUrl;
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });

      this.svgToImageData = dataPAz
    },
  }
}
</script>

<style lang="scss" scoped>
input {
  border: 0.5px solid #e9e9e9;
  background-color: transparent;
  border-radius: 4px;
}
</style>
