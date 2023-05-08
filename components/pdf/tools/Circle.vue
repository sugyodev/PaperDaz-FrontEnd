<template>
  <div class="tool">
   <svg 
   ref="circlebox"
   :style="style" version="1.1" :scale="scale" viewBox="0 0 20 20" fill="black">
   <path
    svgToImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAtBJREFUWEfVmYFR1UAQhn8qQCuAV4FSgVABWoFagVIBWIFQAVABWoFagVCBWIFagc7HZJ3Nvk3uEkJeuJk3DLzk7rv99/Z2ly2NH88lvZC0L2lXEr/7cS3pVtJXSd8k8fvgsTXwDUBeS3rTQA15HdgLSZcNeNW7tYBPJB1Lel81a/mhU0kfJP0uPVoD+FLSuSQgpxzAvZX0qW/SEuDHgtU+NwsgHwuan+GPbIif+OhhDwTWPOr6vguQyYHD1+L400Cz86JEzcvMhxLAbCdz4ptYc210ASJpBoffsEgtWFwQUPwYf44jhcwAAXgX3sZqSDUqVCQwSE/4idY8iy4VAZHhKkx408iDn005CFm4ybMw6St/cDwg5v8RTiuWY7dTwxkTkKjiLYn7rMyNPGAm7d6EsnZZHwN8D1/+l9oA2QnW84MDcTKlpj1zsU48OFjx1gDjA0gL9NjTOnRfuBdu5KW+M5ABYj2AbBCTOPZzDsIPsdcGwCsAMx94OqP1DAgr/goW2QMwknN9EW42MQg7/lo8AjD+cRPymjHWjAUgR9wnmwdNlN+EBbmtvriFrwH8G3WfIfZVx8QMsJSCPbRlWwZ7lIBzXG+DJOay9hnFkg7JTRZmSL9JHDYx0jCz+EC9+KsOKbmYdxaWLPwkgelKt1pZ7QzOmGXzrXRriQnrXUb1aFJ+VMyyWqQmcD9k0USy4tsqrWy+puwkkFMKTg2JW1HixrZdZ9lpZyGr7rAkN8yUhTtpVWxIFQt3g6QeoQ8YB8UVk4wtpgCia5FVi/QN19otfc0jLJlBAsftQ2lQCwoYcwGWtfFSOKxTyv0yub1VKRfosSA9zu3bb5SQ1n7rq3HWZPULlAB5lsmRPGub3SeGsyEkvVcD05eEyBO7XmMBsRrzFV2kxoIegtDArvn4u7sGlLsVJfhUh6yhgB7E/Mv+DRHbaLTt7N8Q5qc1G2k98w+d4Kpkd7K8EgAAAABJRU5ErkJggg=="
    options="fill" d="M10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 C20,4.5 15.5,0 10,0 L10,0 Z M10,18 C5.6,18 2,14.4 2,10 C2,5.6 5.6,2 10,2 C14.4,2 18,5.6 18,10 C18,14.4 14.4,18 10,18 L10,18 Z" id="Shape"/>
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

  watch:{
    // generatePDF: function(){
    //   if(this.generatePDF)
    //   this.svgToImage()
    // },
  },

  data() {
    return {
      svgToImageData:''
    }
  },
  methods:{
    async svgToImage() {
      this.svgToImageData = '';
      let dataPAz = ''
      await htmlToImage.toPng(this.$refs.circlebox)
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

<style lang="scss" scoped></style>
