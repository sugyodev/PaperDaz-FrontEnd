<template>
  <div
    class="text-field tool"
    style="height: 19px; display: flex; align-items: end"
  >
    <input
      type="text"
      v-model="text"
      v-if="(isActive || justMounted) && !isCreator"
      :style="style"
      class="input-annotation"
      placeholder="Type here..."
      ref="text_box"
      @blur="$emit('onBlur')"
    />
    <p v-else :style="style">{{ text || 'Type here...' }}</p>
    <span :style="hideStyle" ref="text_hidden">{{ text || 'Type here...' }}</span>
  </div>
</template>

<script>
import TeamAccess from '~/models/TeamAccess'

export default {
  props: {
    isActive: Boolean,
    fontSize: Number,
    value: String,
    file: Object,
    justMounted: Boolean
  },
  data: () => ({
    text: null,
    inputWidth: 0,
  }),
  created () {
    this.text = this.value;
  },
  mounted(){
    this.$refs.text_box && this.$refs.text_box.focus()
  },
  methods: {
    onBlur: () => {
      console.log("onBlur")
    }
  },
  watch: {
    value (v) {
      if (this.text != v) this.text = v
    },
    text (v) {
      if (this.value != v) this.$emit('input', v)
      if (this.$refs.text_box && this.$refs.text_hidden) {
        if (!v || v.length === 1) {
          setTimeout(() => {
            const inputWidth = this.$refs.text_hidden.clientWidth
            this.$refs.text_box.style.width = `${inputWidth}px`
            this.inputWidth = inputWidth
          }, 200)
        } else {
          const extra = this.fontSize || 11
          if (v.length < this.value.length) {
            const inputWidth = this.$refs.text_hidden.clientWidth
            this.$refs.text_box.style.width = `${inputWidth}px`
            this.inputWidth = inputWidth
          } else {
            const inputWidth = this.$refs.text_hidden.clientWidth + extra
            this.$refs.text_box.style.width = `${inputWidth}px`
            this.inputWidth = inputWidth
          }
        }
      }
    },
    fontSize() {
      if (this.$refs.text_box && this.$refs.text_hidden) {
        const extra = this.fontSize || 11
        const inputWidth = this.$refs.text_hidden.clientWidth + extra
        this.$refs.text_box.style.width = `${inputWidth}px`
        this.inputWidth = inputWidth
      }
    }
  },
  computed: {
    isCreator () {
      return (
        this.file.userId == this.$auth.user.id ||
        (this.$auth.user.teamAccess == TeamAccess.COMPANY_FILE &&
          this.$auth.user.teamId == this.file.userId)
      )
    },
    style () {
      return {
        fontSize: `${this.fontSize || 11}px`,
        // width: `${this.inputWidth}px`
      }
    },
    hideStyle () {
      return {
        fontSize: `${this.fontSize || 11}px`,
        visibility: 'hidden',
        position: 'absolute'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.input-annotation:focus {
  border:none;
  border-left: 1px solid #5FA348;
  border-bottom: 1px solid #5FA348;
  background-color: transparent;
}

.input-annotation:blur {
  border: transparent;
}
</style>
