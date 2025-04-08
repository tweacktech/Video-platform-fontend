<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useVideosStore } from '../stores/videos'
import VideoCard from '../components/VideoCard.vue'
import { API_BASE_URL } from '../config'

const videoStore = useVideosStore()
const categories = ref([])
const selectedCategory = ref(null)

const videos = computed(() => videoStore.videos)
const loading = computed(() => videoStore.loading)
const currentPage = computed(() => videoStore.pagination.current_page)
const totalPages = computed(() => Math.ceil(videoStore.pagination.total / videoStore.pagination.per_page))

// Featured videos filtering
const featuredVideos = computed(() => {
  return videos.value.filter(video => video.is_featured).slice(0, 3)
})

// Pagination buttons logic
const paginationButtons = computed(() => {
  const buttons = []
  const maxButtons = 5
  
  if (totalPages.value <= maxButtons) {
    for (let i = 1; i <= totalPages.value; i++) {
      buttons.push(i)
    }
  } else {
    if (currentPage.value <= 3) {
      for (let i = 1; i <= 4; i++) {
        buttons.push(i)
      }
      buttons.push('...')
      buttons.push(totalPages.value)
    } else if (currentPage.value >= totalPages.value - 2) {
      buttons.push(1)
      buttons.push('...')
      for (let i = totalPages.value - 3; i <= totalPages.value; i++) {
        buttons.push(i)
      }
    } else {
      buttons.push(1)
      buttons.push('...')
      buttons.push(currentPage.value - 1)
      buttons.push(currentPage.value)
      buttons.push(currentPage.value + 1)
      buttons.push('...')
      buttons.push(totalPages.value)
    }
  }
  
  return buttons
})

// Methods
const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`)
    categories.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch categories', error)
  }
}

// Fetch videos and categories on mount
onMounted(async () => {
  await fetchCategories()
  await videoStore.fetchVideos()
})

// Watch for category changes
watch(selectedCategory, (newCategory) => {
  videoStore.updateFilters({ category_id: newCategory })
  videoStore.fetchVideos() // Trigger a new fetch when category changes
})

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId === selectedCategory.value ? null : categoryId
}

const changePage = (page) => {
  if (typeof page === 'number') {
    videoStore.setPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="home-page">
    <section class="featured-section" v-if="featuredVideos.length > 0">
      <h2>Featured Videos</h2>
      <div class="featured-grid">
        <VideoCard 
          v-for="video in featuredVideos" 
          :key="video.id" 
          :video="video" 
          class="featured-item"
        />
      </div>
    </section>
    
    <section class="filters-section">
      <div class="categories">
        <button 
          class="category-btn" 
          :class="{ active: !selectedCategory }" 
          @click="selectCategory(null)"
        >
          All
        </button>
        <button 
          v-for="category in categories" 
          :key="category.id" 
          class="category-btn" 
          :class="{ active: selectedCategory === category.id }" 
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
    </section>
    
    <section class="videos-section">
      <template v-if="loading">
        <div class="skeleton-loader" v-for="i in 8" :key="i"></div>
      </template>
      <template v-else-if="videos.length === 0">
        <div class="no-results">
          <p>No videos found. Try a different search or category.</p>
        </div>
      </template>
      <template v-else>
        <div class="videos-grid">
          <VideoCard 
            v-for="video in videos" 
            :key="video.id" 
            :video="video" 
          />
        </div>
      </template>
    </section>
    
    <div class="pagination" v-if="totalPages > 1">
      <button 
        class="page-btn" 
        :disabled="currentPage === 1" 
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>
      
      <button 
        v-for="page in paginationButtons" 
        :key="page" 
        class="page-btn" 
        :class="{ active: currentPage === page }" 
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      
      <button 
        class="page-btn" 
        :disabled="currentPage === totalPages" 
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.featured-section {
  margin-bottom: 2rem;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.featured-item {
  transform: scale(1);
  transition: transform 0.3s ease;
}

.featured-item:hover {
  transform: scale(1.03);
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.categories {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.category-btn {
  background: #f0f0f0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-btn:hover {
  background: #e0e0e0;
}

.category-btn.active {
  background: #e94560;
  color: white;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.skeleton-loader {
  height: 100px;
  background: linear-gradient(
    90deg,
    rgba(240, 240, 240, 0.6) 25%,
    rgba(240, 240, 240, 0.8) 50%,
    rgba(240, 240, 240, 0.6) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

.no-results {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.page-btn:hover:not(:disabled) {
  background: #f0f0f0;
}

.page-btn.active {
  background: #e94560;
  color: white;
  border-color: #e94560;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .featured-grid {
    grid-template-columns: 1fr;
  }
  
  .videos-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .categories {
    gap: 0.3rem;
  }
  
  .category-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>