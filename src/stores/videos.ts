import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE_URL } from '../config'

interface Video {
  id: number
  user_id: number
  category_id: number
  title: string
  description: string
  file_path: string
  thumbnail_path: string
  status: string
  duration: number
  is_featured: boolean | number
  views: number
  created_at: string
  updated_at: string
  category: {
    id: number
    name: string
    slug: string
    description: string
    created_at: string
    updated_at: string
  }
  // Add user interface if needed
  user?: {
    id: number
    name: string
    email: string
  }
}

interface Pagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface ApiResponse {
  data: Video[]
  current_page: number
  last_page: number
  // Include other pagination fields if needed
}

export const useVideosStore = defineStore('videos', {
  state: () => ({
    videos: [] as Video[],
    featuredVideos: [] as Video[],
    currentVideo: null as Video | null,
    isLoading: false,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 12,
      total: 0
    } as Pagination,
    filter: {
      category: null as number | null,
      search: null as string | null
    }
  }),

  getters: {
    currentPage: (state) => state.pagination.current_page,
    totalPages: (state) => state.pagination.last_page
  },

  actions: {
    async fetchVideos() {
      this.isLoading = true
      try {
        const params: Record<string, any> = {
          page: this.pagination.current_page
        }

        if (this.filter.category) params.category_id = this.filter.category
        if (this.filter.search) params.search = this.filter.search

        const {  data: response } = await axios.get<ApiResponse>(`${API_BASE_URL}/videos`, { params })
        
        this.videos = response.data.data
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: this.pagination.per_page, // Keep existing or use from response if available
          total: response.data.total || 0
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error)
        throw error // Re-throw to handle in components
      } finally {
        this.isLoading = false
      }
    },

    async fetchFeaturedVideos() {
      try {
        const { data:response} = await axios.get<ApiResponse>(`${API_BASE_URL}/videos`, {
          params: { featured: true, per_page: 3 } // Limit featured videos
        })
        console.log('Featured videos response:',response.data) // Log the entire response

        this.featuredVideos = response.data.data
      } catch (error) {
        console.error('Failed to fetch featured videos:', error)
        throw error
      }
    },

    async fetchVideo(id: number): Promise<Video | null> {
      this.isLoading = true
      try {
        const { data:response } = await axios.get<{ data: Video }>(`${API_BASE_URL}/videos/${id}`)
        this.currentVideo = response.data.data
        return response.data.data
      } catch (error) {
        console.error(`Failed to fetch video ${id}:`, error)
        return null
      } finally {
        this.isLoading = false
      }
    },


    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
      this.pagination.current_page = 1 // Reset to first page when filters change
      this.fetchVideos() // Reload videos with new filters
    },


    setFilter(filter: Partial<{ category: number | null; search: string | null }>) {
      this.filter = { ...this.filter, ...filter }
      this.pagination.current_page = 1
      return this.fetchVideos()
    },

    setPage(page: number) { 
      if (page >= 1 && page <= this.pagination.last_page) {
        this.pagination.current_page = page
        return this.fetchVideos()
      }
      return Promise.resolve()
    }
  }
})

export default defineStore('videos', { /* ... */ })