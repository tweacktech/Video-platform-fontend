<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { API_BASE_URL } from '@/config'
import { URL } from '@/config'

const route = useRoute()
const video = ref(null)

onMounted(async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/videos/${route.params.id}`)
    video.value = response.data.data.video  // 🟢 Extracting correct nested data
  } catch (error) {
    console.error('Failed to load video', error)
  }
})
</script>

<template>
  <div class="video-detail">
    <div v-if="video">
      <h1>Title: <i>{{ video.title }}</i></h1>
      <video
        controls
        :src="`${URL}${video.file_path}`"
        style="width: 100%;"
      ></video>
      <p>Views: {{ video.views }}</p>
      <p>Category: {{ video.category?.name }}</p>
      <p>Description: {{ video.description }}</p>
    </div>
    <div v-else>
      <p>Loading video...</p>
    </div>
  </div>
</template>
