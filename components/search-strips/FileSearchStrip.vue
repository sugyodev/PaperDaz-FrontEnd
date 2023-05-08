<template>
  <article
    class="cursor-pointer w-full py-4 text-[#9F9F9F] grid grid-cols-[max-content,1fr,max-content] gap-4 items-center relative"
  >
  <div 
  v-if="isPrivate"
  class="absolute top-[calc(25%-12px)] left-0 bg-white p-1 rounded-full">
    <EyeSlashedIcon width="20px" height="20px" color="rgb(98,164,78)"/></div>
    <img
      v-if="record.profilePicture "
     :src="record.profilePicture"
      alt=""
      class="h-16 w-16 rounded-lg object-cover"
    />
    <letter-avatar
      v-else
      class="h-16 w-16 rounded-1 object-cover"
      :username="(record.user || {}).companyName || (record.user || {}).firstName"
    />
    <nuxt-link  class="overflow-hidden w-[100%]" :to="`/pdf/${record.paperLink}`">
    <div class="overflow-hidden w-[80%]">
      <p class="text-sm text-black mb-1 truncate w-[100%]">{{record.fileName.replace(/.pdf/g, '') }}</p>
      <p class="text-sm text-[#222] truncate">{{(record.user || {}).company_name}}</p>
      <!-- <p class="text-[11px] mt-0.5 truncate">{{(record.user || {}).firstName + " " + (record.user || {}).lastName}}</p> -->
      <p class="text-[11px] mt-0.5 truncate">{{record.paperLink}}</p>
    </div>
    </nuxt-link>
    <SearchShare :showShareIcon="true" :file="record" :link="link"/>
  </article>
</template>

<script >
import Vue from 'vue'
import SearchShare from './component/SearchShare.vue'
import LockFillIcon from '../svg-icons/LockFillIcon.vue'
import FilePrivacy from '~/models/FilePrivacy'
import EyeSlashedIcon from '../svg-icons/EyeSlashedIcon.vue'
import LetterAvatar from '../widgets/LetterAvatar.vue'

export default Vue.extend({
  components: { SearchShare, LockFillIcon, EyeSlashedIcon, LetterAvatar },
  name: 'FileSearchStrip',
  computed:{
    isPrivate(){
      return (this.record || {}).filePrivacy == FilePrivacy.PRIVATE
    },
    link(){
      return (`${window.location.origin}/profile-folder/${this.record.paperLink}`)
    },
    fileName() {
      const fileName = (this.record || {}).fileName;

      return fileName.substring(0, fileName.lastIndexOf('.'));
    }
  },
  props: {
    record: {
      type: Object,
      required: true,
    },
  },
  mounted(){
  },
})
</script>
