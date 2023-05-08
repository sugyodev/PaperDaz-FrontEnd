<template>
  <div class="tool">
    <svg ref="crossbox" :style="style" viewBox="0 0 19 19" fill="black" xmlns="http://www.w3.org/2000/svg">
      <path svgToImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAYBJREFUWEfF2W2SwiAMBuB4Mvcmqyfb9SbrzZy3M3HSLg35IvJPi+UxQAP0QvtyI6IrEd0P33d9/CGiJxH9coMX0TJwqICCCt1ItA0DCtrekAyUODZ3IiWO29+QAI5wncgR7o0EEJH6VgbZykhqOJAe3MWfQE5x6F05STqRJpycJHLMre5uM24E5EfMKqQLdwZchXTjNGA1MoSbAauQYZwFmEWmcFZgFJnGeYBeZAnOC7QiUY9XJaMM+phc3/1GZhIlHe8uzTKOdh8XLhJBa8ZJR45vEIlgBOmOXAXQMia3JZNnzB1Dn4kg7jWbrfwnwtuHDNCCk8MhhIwCPbgUMgKM4MJIL3CGw4RAKVtPeoAWHGeQ2cPcvBGzAj0463PShLQAI7gy5AyYwZUgNWAFLo08A1biUsgRcAUujDwCV+JCSAnswLmRDOzEuZAAfgJnRs4OMFOLTeMmR0uLd+0IuAOnRfJ9BMyV5FFwJ26E/HeILpFfmT2EsVvPqqG7/+RriBe0s4oo0F+4rgAAAABJRU5ErkJggg==" options="fill"
        d="M19 17.0864L17.0864 19L9.5 11.4136L1.91357 19L0 17.0864L7.58643 9.5L0 1.91357L1.91357 0L9.5 7.58643L17.0864 0L19 1.91357L11.4136 9.5L19 17.0864Z"
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
  computed: {
    style() {
      return {
        width: `${(this.scale || 1) * 11}px`,
        height: `${(this.scale || 1) * 11}px`,
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
      await htmlToImage.toPng(this.$refs.crossbox)
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
