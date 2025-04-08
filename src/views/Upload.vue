<template>
  <div class="upload-page max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Upload Video</h1>
    <form @submit.prevent="uploadVideo" enctype="multipart/form-data" class="space-y-4">
      <!-- Title -->
      <div>
        <label class="block mb-1 font-medium">Title</label>
        <input
          v-model="form.title"
          type="text"
          placeholder="Video Title"
          required
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block mb-1 font-medium">Description</label>
        <textarea
          v-model="form.description"
          placeholder="Video Description"
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <!-- Category -->
      <div>
        <label class="block mb-1 font-medium">Category</label>
        <select
          v-model="form.category_id"
          required
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select a category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Duration -->
      <div>
        <label class="block mb-1 font-medium">Duration (seconds)</label>
        <input
          v-model.number="form.duration"
          type="number"
          min="1"
          placeholder="Duration in seconds"
          required
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Video File -->
      <div>
        <label class="block mb-1 font-medium">Video File</label>
        <input
          @change="onVideoChange"
          type="file"
          accept="video/*"
          required
          class="w-full"
        />
      </div>

      <!-- Thumbnail File -->
      <div>
        <label class="block mb-1 font-medium">Thumbnail Image</label>
        <input
          @change="onThumbnailChange"
          type="file"
          accept="image/*"
          class="w-full"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        :disabled="isUploading"
      >
        {{ isUploading ? 'Uploading...' : 'Upload Video' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '@/config'

const form = ref({
  title: '',
  description: '',
  category_id: '',
  duration: null,
})

const categories = ref([])
const videoFile = ref(null)
const thumbnailFile = ref(null)
const isUploading = ref(false)

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`)
    categories.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const onVideoChange = (e) => {
  videoFile.value = e.target.files[0]
}

const onThumbnailChange = (e) => {
  thumbnailFile.value = e.target.files[0]
}

const uploadVideo = async () => {
  if (isUploading.value) return

  isUploading.value = true

  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('description', form.value.description)
  formData.append('category_id', form.value.category_id)
  formData.append('duration', form.value.duration)
  formData.append('video_file', videoFile.value)
  
  if (thumbnailFile.value) {
    formData.append('thumbnail', thumbnailFile.value)
  }

  try {
    await axios.post(`${API_BASE_URL}/video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    })
    alert('Upload successful!')
    resetForm()
  } catch (error) {
    console.error('Upload failed:', error)
    alert(`Upload failed: ${error.response?.data?.message || error.message}`)
  } finally {
    isUploading.value = false
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    category_id: '',
    duration: null,
  }
  videoFile.value = null
  thumbnailFile.value = null
}

onMounted(fetchCategories)
</script>

<style scoped>
.upload-page {
  background-color: #f8fafc;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

input[type="file"] {
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  border-radius: 0.375rem;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>