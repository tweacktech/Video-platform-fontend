<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { API_BASE_URL, URL } from '@/config'
import VideoCard from '@/components/VideoCard.vue'

const route = useRoute()
const router = useRouter()
const video = ref(null)
const relatedVideos = ref([])
const isLoading = ref(true)
const error = ref(null)
const showFullDescription = ref(false)

// Formatting video publish date
const formattedDate = computed(() => {
  if (!video.value?.created_at) return ''
  const date = new Date(video.value.created_at)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

// Format view count with commas for thousands
const formattedViews = computed(() => {
  if (!video.value?.views) return '0'
  return video.value.views.toLocaleString()
})

// Truncate description for initial display
const truncatedDescription = computed(() => {
  if (!video.value?.description) return ''
  return video.value.description.length > 150 
    ? video.value.description.substring(0, 150) + '...' 
    : video.value.description
})

// Check if description needs "Show More" button
const hasLongDescription = computed(() => {
  return video.value?.description && video.value.description.length > 150
})

// Methods
const fetchVideo = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await axios.get(`${API_BASE_URL}/videos/${route.params.id}`)
    video.value = response.data.data.video
    await fetchRelatedVideos()
  } catch (err) {
    error.value = 'Failed to load video. Please try again later.'
    console.error('Failed to load video', err)
  } finally {
    isLoading.value = false
  }
}

const fetchRelatedVideos = async () => {
  if (!video.value?.category_id) return
  
  try {
    const response = await axios.get(`${API_BASE_URL}/videos`, {
      params: {
        category_id: video.value.category_id,
        exclude_id: video.value.id,
        per_page: 4
      }
    })
    relatedVideos.value = response.data.data
  } catch (err) {
    console.error('Failed to load related videos', err)
  }
}

const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value
}

const navigateToVideo = (videoId) => {
  router.push({ name: 'video', params: { id: videoId } })
}

// Lifecycle hooks
onMounted(() => {
  fetchVideo()
})
</script>

<template>
  <div class="video-page">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading video...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchVideo" class="retry-button">Try Again</button>
    </div>
    
    <!-- Video content -->
    <div v-else-if="video" class="video-content">
      <div class="video-player-container">
        <video
          controls
          :src="`${URL}${video.file_path}`"
          class="video-player"
          poster="https://api.placeholder/400/250"
          preload="metadata"
        ></video>
      </div>
      
      <div class="video-details">
        <h1 class="video-title">{{ video.title }}</h1>
        
        <div class="video-meta">
          <div class="meta-item views">
            <span class="icon">👁️</span>
            <span>{{ formattedViews }} views</span>
          </div>
          <div class="meta-item category">
            <span class="icon">🏷️</span>
            <span>{{ video.category?.name || 'Uncategorized' }}</span>
          </div>
          <div class="meta-item date">
            <span class="icon">📅</span>
            <span>{{ formattedDate }}</span>
          </div>
        </div>
        
        <div class="video-actions">
          <button class="action-button like">
            <span class="icon">👍</span>
            <span>Like</span>
          </button>
          <button class="action-button share">
            <span class="icon">📤</span>
            <span>Share</span>
          </button>
          <button class="action-button save">
            <span class="icon">🔖</span>
            <span>Save</span>
          </button>
        </div>
        
        <div class="description-container">
          <p class="video-description">
            {{ showFullDescription ? video.description : truncatedDescription }}
          </p>
          <button 
            v-if="hasLongDescription" 
            @click="toggleDescription" 
            class="show-more-button"
          >
            {{ showFullDescription ? 'Show Less' : 'Show More' }}
          </button>
        </div>
      </div>
      
      <!-- Related videos section -->
      <div class="related-videos" v-if="relatedVideos.length > 0">
        <h2>Related Videos</h2>
        <div class="related-videos-grid">
          <div 
            v-for="relatedVideo in relatedVideos" 
            :key="relatedVideo.id"
            class="related-video-card"
            @click="navigateToVideo(relatedVideo.id)"
          >
            <div class="thumbnail">
              <img :src="`${URL}${relatedVideo.thumbnail_path}`" :alt="relatedVideo.title">
              <div class="duration">{{ relatedVideo.duration || '0:00' }}</div>
            </div>
            <div class="details">
              <h3>{{ relatedVideo.title }}</h3>
              <div class="meta">
                <span>{{ relatedVideo.views?.toLocaleString() || 0 }} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: 'Segoe UI', Arial, sans-serif;
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #e94560;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error state */
.error-container {
  text-align: center;
  padding: 2rem;
  background-color: #fff3f3;
  border-radius: 8px;
  margin: 2rem 0;
}

.retry-button {
  background-color: #e94560;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #d63151;
}

/* Video content */
.video-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.video-player-container {
  width: 100%;
  background-color: #000;
  position: relative;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
  border-radius: 8px;
}

.video-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-details {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.video-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #333;
}

.video-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.95rem;
}

.icon {
  font-size: 1.1rem;
}

.video-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f0f0f0;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #e0e0e0;
}

.action-button.like:hover {
  background-color: #e3f2fd;
  color: #1976d2;
}

.action-button.share:hover {
  background-color: #e8f5e9;
  color: #388e3c;
}

.action-button.save:hover {
  background-color: #fff3e0;
  color: #f57c00;
}

.description-container {
  margin-top: 1.5rem;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
}

.video-description {
  line-height: 1.6;
  margin: 0;
  color: #444;
}

.show-more-button {
  background: none;
  border: none;
  color: #e94560;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  transition: color 0.2s;
}

.show-more-button:hover {
  color: #d63151;
  text-decoration: underline;
}

/* Related videos */
.related-videos {
  margin-top: 1rem;
}

.related-videos h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #333;
  border-left: 4px solid #e94560;
  padding-left: 0.8rem;
}

.related-videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.related-video-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.related-video-card:hover {
  transform: translateY(-5px);
}

.thumbnail {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
}

.thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.details {
  padding: 0.8rem;
  background-color: white;
}

.details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  line-height: 1.4;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.details .meta {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.8rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .video-title {
    font-size: 1.5rem;
  }
  
  .video-meta {
    gap: 1rem;
  }
  
  .video-actions {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .action-button {
    white-space: nowrap;
  }
  
  .related-videos-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 576px) {
  .video-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-button {
    padding: 0.5rem 1rem;
  }
  
  .related-videos-grid {
    grid-template-columns: 1fr;
  }
}
</style>