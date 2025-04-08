import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE_URL } from '../config'

interface Category {
  id: number
  name: string
}


interface CategoriesState {
  categories: Category[]
  isLoading: boolean
  errorMessage: string | null
  initialized: boolean
}

export const useCategoriesStore = defineStore('categories', {
  state: (): CategoriesState => ({
    categories: [],
    isLoading: false,
    errorMessage: null,
    initialized: false,
  }),

  actions: {
    async fetchCategories(forceReload = false) {
      if (this.initialized && !forceReload) return

      this.isLoading = true
      this.errorMessage = null

      try {
        const response = await axios.get(`${API_BASE_URL}/categories`)
        this.categories = response.data.data
        this.initialized = true
      } catch (error: any) {
        this.errorMessage = error?.message || 'Failed to load categories'
        console.error('[CategoriesStore] Error fetching categories:', error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
