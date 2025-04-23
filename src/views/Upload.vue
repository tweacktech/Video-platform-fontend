<template>
  <div class="upload-page">
    <h1 class="form-title">Upload Your Video</h1>
    <form @submit.prevent="uploadVideo" enctype="multipart/form-data" class="upload-form">
      <!-- Title -->
      <div class="form-group">
        <label>Title</label>
        <input v-model="form.title" type="text" placeholder="Enter video title" required />
      </div>

      <!-- Description -->
      <div class="form-group">
        <label>Description</label>
        <textarea v-model="form.description" placeholder="Write a short description..."></textarea>
      </div>

      <!-- Category -->
      <div class="form-group">
        <label>Category</label>
        <select v-model="form.category_id" required>
          <option value="" disabled>Select a category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Duration -->
      <div class="form-group">
        <label>Duration (seconds)</label>
        <input v-model.number="form.duration" type="number" min="1" placeholder="Enter duration" required />
      </div>

      <!-- Video File -->
      <div class="form-group">
        <label>Video File</label>
        <input @change="onVideoChange" type="file" accept="video/*" required />
      </div>

      <!-- Thumbnail File -->
      <div class="form-group">
        <label>Thumbnail Image</label>
        <input @change="onThumbnailChange" type="file" accept="image/*" />
      </div>

      <!-- Submit Button -->
      <button type="submit" :disabled="isUploading">
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
  max-width: 700px;
  margin: 3rem auto;
  background: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
  color: #444;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #3b82f6;
}

button {
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #1e40af;
}

button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}
</style>
