<template>
  <svg :viewBox="viewBox" :style="style" ref="lineBox" fill="black" type="DrawLine">
    <path :svgToImage="svgToImageData" options="fill" :x="x1" :y="y1" :y2="y2" :x2="x2" :length="x2" :d="d"
      stroke-linecap="round" style="stroke: rgb(0, 0, 0); stroke-width: 3" type="DrawLine"></path>
  </svg>
</template>

<script>
export default {
  props: {
    x1: Number,
    y1: Number,
    x2: Number,
    y2: Number,
    tool: Object,
    showPublishModal: Boolean,
    id: Number,
    toolLength: Number,
    lineStart: Boolean,
    mouseUp: Boolean,
    generatePDF:Boolean
  },
  watch: {
    // mouseUp: function () {
    //   this.id === this.toolLength && this.lineStart && this.mouseUp && this.converImage();
    // },
    generatePDF: function () {
      if (this.generatePDF) {
        this.convertImage();
      }
    }
  },
  data() {
    return {
      svgToImageData: ''
    }
  },
  methods: {
    convertImage: function () {
      const svgElem = this.$refs.lineBox
      let img = new Image(),
        serializer = new XMLSerializer(),
        svgStr = serializer.serializeToString(svgElem);
      let canvas = document.createElement("canvas");
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
        this.svgToImageData = canvas.toDataURL("image/png")
      }
      img.src = 'data:image/svg+xml;base64,' + window.btoa(svgStr);
    },
  },

  computed: {
    style() {
      return {
        width: `${this.width + 10}px`,
      }
    },
    viewBox() {
      let x1 = 0
      let y1 = 0
      if (this.x1 && this.x2 && this.y1 && this.y2) {
        x1 = this.x2 < this.x1 ? this.x2 - 3 : this.x1 - 3
        y1 = Math.min(this.y1, this.y2) - 3
      }
      return `${x1} ${y1} ${this.width + 10} ${this.height + 10}`
    },
    width() {
      return Math.abs(this.x2 - this.x1)
    },
    height() {
      return Math.abs(this.y2 - this.y1)
    },
    d() {
      let y2 = 0
      let x1 = 0
      let y1 = 0
      let x2 = 0
      if (this.x1 && this.x2 && this.y1 && this.y2) {
        y2 = this.y2
        x1 = this.x1
        y1 = this.y1
        x2 = this.x2
      }
      return `M${x1},${y1}L${x2},${y2}`
    },
  },
}
</script>

<style lang="scss" scoped>
.line {
  width: 100%;
  height: 100%;
  background-color: #000;
}
</style>
