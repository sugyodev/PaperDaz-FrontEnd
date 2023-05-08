<template>
  <div class="tool">
    <svg ref="dotbox" viewBox="0 0 24 24" :style="style" fill="black">
      <path options="dot" svgToImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAZVJREFUWEfdmD8yBUEQh793BDICF1DlBCISCRkSAglOICEkcQJPIiBBRiIhcgJVLiAg4wrqV7WrtsbOm+l9s16XzXa3t/vb/jPdMwOcXwPnfPx7wClgEVgA5gDd6/oC3oAX4Lm67xSsrh7cAnaApUyrT8AFcJUp/yNmBRTYKTBjNVTJfwAHFtBcQIXuDNjoCBZ+dgPs54Q+B1D59TCG12L/JG+uVHka/e8UYF9wNVASchSgwvrag+dCbwlyPhbuUYDXBXMulbrKyc02oRigqvUypbXw++226o4Bvv9BaNtCPRs+bAOchPdqrl9ebAN8NHSIwlFGHWe5qTQEVOV+lrZq1DfdrOgQcBW4MyosLb4G3NdKQ8BD4Li0RaO+I+AkBjgEdo0KS4ufA3sxQC2Y66UtGvXdNhtEGGL3gO5D7L5I3C8z7hdqFZzrVidA98OCIF2PW5PyomlgFaTrkV+A7jdNgnS97ax7fF+QyT2xAFIb9xrS9dFHc1pye3gUjnRuj99CULcHmMYhubt4bpF0tzDml+4BvwGpVFYpgkx7hgAAAABJRU5ErkJggg=="
        d="M 22 12 a 10 10 0 0 0 -10 -10 a 10 10 0 0 0 -10 10 a 10 10 0 0 0 10 10 a 10 10 0 0 0 10 -10" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    scale: Number,
    generatePDF: Boolean,
  },
  computed: {
    style() {
      return {
        width: `${(this.scale || 1) * 13}px`,
        height: `${(this.scale || 1) * 13}px`,
        fill: `black`,
      }
    },
  },
  watch: {
    // generatePDF: function () {
    //   if (this.generatePDF)
    //     this.svgToImage()
    // },
  },
  data() {
    return {
      svgToImageData: ''
    }
  },
  methods: {
    async svgToImage() {
      this.svgToImageData = '';
      let dataPAz = ''
      await htmlToImage.toPng(this.$refs.dotbox)
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

</style>
