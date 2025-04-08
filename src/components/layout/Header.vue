
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoriesStore } from '../../stores/categories';
import { useAuthStore } from '../../stores/auth';

interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

const categoriesStore = useCategoriesStore();
const authStore = useAuthStore();
const router = useRouter();

const searchQuery = ref<string>('');

const categories = computed<Category[]>(() => categoriesStore.categories);

  
    const tokens = localStorage.getItem('auth_token')
    const isLoggedIn = computed(() => !!tokens);
    console.log('Login successful', isLoggedIn.value)

const reloadPage = () => {
  setTimeout(() => {
    window.location.reload();
  }, 100); // Small delay to ensure route change completes
};

onMounted(() => {
  if (categories.value.length === 0) {
    categoriesStore.fetchCategories();
  }
});

const handleSearch = (): void => {
  const query = searchQuery.value.trim();
  if (query) {
    router.push({
      name: 'home',
      query: { search: query }
    });
    searchQuery.value = '';
    reloadPage();
  }
};

const logout = async (): Promise<void> => {
  try {
    await authStore.logout();
    localStorage.removeItem('auth_token');
    router.push('/'); 
    reloadPage();
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>

<style scoped>

.header {
  background-color: #1a1a2e;
  color: white;
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.search-bar {
  display: flex;
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
}

.search-bar input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px 0 0 4px;
}

.search-bar button {
  padding: 0.5rem 1rem;
  background: #e94560;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
}
</style>
<template>
 <header class="header">
      <nav class="nav-container">
        <div class="logo">
          <router-link to="/">Videos</router-link>
        </div>
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Search videos..." 
            v-model="searchQuery" 
            @keyup.enter="handleSearch" 
          />
          <button @click="handleSearch">
            <span class="icon">🔍</span>
          </button>
        </div>
        <div class="nav-links">
          <router-link to="/">Home</router-link>
          <template v-if="isLoggedIn">
            <router-link to="/upload">Upload</router-link>
            <button @click="logout" class="logout-btn">Logout</button>
          </template>
          <router-link v-else to="/login">Login</router-link>
        </div>
      </nav>
    </header>
</template>
