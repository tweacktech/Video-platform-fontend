<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useVideosStore } from '../stores/videos'
import VideoCard from '../components/VideoCard.vue'
import { API_BASE_URL } from '../config'
import VCard from '../components/VCard.vue'

const videoStore = useVideosStore()
const categories = ref([])
const selectedCategory = ref(null)
const showAllCategories = ref(false)
const searchQuery = ref('')

const videos = computed(() => videoStore.videos)
const loading = computed(() => videoStore.loading)
const currentPage = computed(() => videoStore.pagination.current_page)
const totalPages = computed(() => Math.ceil(videoStore.pagination.total / videoStore.pagination.per_page))

// Featured videos filtering
const featuredVideos = computed(() => {
  return videos.value.filter(video => video.is_featured).slice(0, 3)
})

// Top recent movies - get the newest 4 videos
const recentVideos = computed(() => {
  return [...videos.value]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4)
})

// Display logic for categories
const displayedCategories = computed(() => {
  if (showAllCategories.value || categories.value.length <= 6) {
    return categories.value
  }
  return categories.value.slice(0, 6)
})

// Filtered videos based on search query
const filteredVideos = computed(() => {
  if (!searchQuery.value) return videos.value
  
  const query = searchQuery.value.toLowerCase()
  return videos.value.filter(video => 
    video.title.toLowerCase().includes(query) || 
    video.description?.toLowerCase().includes(query)
  )
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

const loadVideos = async () => {
  await videoStore.fetchVideos({
    category_id: selectedCategory.value,
    page: currentPage.value,
    search: searchQuery.value
  })
}

const selectCategory = async (categoryId: number | null) => {
  selectedCategory.value = categoryId === selectedCategory.value ? null : categoryId
  await videoStore.setPage(1)
  await loadVideos()
}

const toggleCategoriesDisplay = () => {
  showAllCategories.value = !showAllCategories.value
}

const handleSearch = async () => {
  await videoStore.setPage(1)
  await loadVideos()
}

const changePage = async (page: number) => {
  if (typeof page === 'number') {
    await videoStore.setPage(page)
    await loadVideos()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// onMounted fetch
onMounted(async () => {
  await fetchCategories()
  await loadVideos()
})
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
    
    <section class="recent-section" v-if="recentVideos.length > 0">
      <h2>Top Recent Movies</h2>
      <div class="recent-grid">
        <VCard 
          v-for="video in recentVideos" 
          :key="video.id" 
          :video="video" 
          class="recent-item"
        />
      </div>
    </section>
    
    <section class="filters-section">
      <h2>Browse All Videos</h2>
      
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search videos..." 
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch" class="search-btn">Search</button>
      </div>
      
      <div class="filter-container">
        <h3>Filter by Category</h3>
        <div class="categories">
          <button 
            class="category-btn" 
            :class="{ active: !selectedCategory }" 
            @click="selectCategory(null)"
          >
            All
          </button>
          <button 
            v-for="category in displayedCategories" 
            :key="category.id" 
            class="category-btn" 
            :class="{ active: selectedCategory === category.id }" 
            @click="selectCategory(category.id)"
          >
            {{ category.name }}
          </button>
          <button 
            v-if="categories.length > 6" 
            class="show-more-btn"
            @click="toggleCategoriesDisplay"
          >
            {{ showAllCategories ? 'Show Less' : 'Show More' }}
          </button>
        </div>
      </div>
    </section>
    
    <section class="videos-section">
      <template v-if="loading">
        <div class="skeleton-loader" v-for="i in 8" :key="i"></div>
      </template>
      <template v-else-if="filteredVideos.length === 0">
        <div class="no-results">
          <p>No videos found. Try a different search or category.</p>
        </div>
      </template>
      <template v-else>
        <div class="videos-grid">
          <VCard 
            v-for="video in filteredVideos" 
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #333;
  border-left: 4px solid #e94560;
  padding-left: 0.8rem;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  font-weight: 500;
}

/* Featured Section */
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.featured-item:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

/* Recent Section */
.recent-section {
  margin-bottom: 2rem;
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.recent-item {
  transition: transform 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.recent-item:hover {
  transform: translateY(-5px);
}

/* Filters Section */
.filters-section {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.filter-container {
  margin-top: 1rem;
}

.search-bar {
  display: flex;
  margin-bottom: 1.5rem;
  max-width: 500px;
}

.search-bar input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
}

.search-btn {
  background: #e94560;
  color: white;
  border: none;
  padding: 0 1.5rem;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-btn:hover {
  background: #d63151;
}

.categories {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.category-btn {
  background: #f0f0f0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.category-btn:hover {
  background: #e0e0e0;
}

.category-btn.active {
  background: #e94560;
  color: white;
}

.show-more-btn {
  background: none;
  border: none;
  color: #e94560;
  cursor: pointer;
  font-size: 0.9rem;
  margin-left: 0.5rem;
}

.show-more-btn:hover {
  text-decoration: underline;
}

/* Videos Section */
.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.skeleton-loader {
  height: 280px;
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
  background: #f9f9f9;
  border-radius: 8px;
}

/* Pagination */
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
  transition: all 0.2s ease;
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

@media (max-width: 992px) {
  .recent-grid {
    grid-template-columns: repeat(2, 1fr);
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
    font-size: 0.85rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .recent-grid {
    grid-template-columns: 1fr;
  }
  
  .search-bar {
    flex-direction: column;
  }
  
  .search-bar input {
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }
  
  .search-btn {
    border-radius: 4px;
    padding: 0.5rem;
  }
}
</style>