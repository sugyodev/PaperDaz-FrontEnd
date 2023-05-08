<template>
  <div class="flex gap-3 align-items-center">
    <div class="circle bg-[#757575] text-white zoom-btn" @click="$emit('zoomOut')">-</div>
    <div class="circle bg-[#757575] text-white zoom-btn" @click="$emit('zoomIn')">+</div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  emits: ['zoomOut', 'zoomIn']
})
</script>

<style scoped>
.bg-dark-opacity-600 {
  background-color: rgba(120, 120, 120, .6);
}
.zoom-btn {
  width: 1.5rem;
  height: 1.5rem;
  text-align: center;
  line-height: 1.5rem;
  font-size: 22px;
  cursor: pointer;
}
</style>