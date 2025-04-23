
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

<template>

<div class="header">
      <h2 class="header-text">Download & Watch Free Movies</h2>
      
    </div>

    <!-- Navigation Tabs -->
    <div class="navigation">
      <div class="nav-container">
        <div class="logo-circle">
          <span> <router-link to="/">+</router-link></span>
        </div>
        <nav class="nav-tabs">
          
          <div class="nav-item">
            <router-link to="/" class="nav-item">Home</router-link>
            <router-link to="/test" class="nav-item" >Test</router-link> 
            <template v-if="isLoggedIn">
              <router-link to="/upload" class="nav-item">Upload</router-link>
              <button @click="logout" class="logout-btn">Logout</button>
            </template>
            <router-link v-else to="/login">Login</router-link>
          </div>
         
        </nav>
      </div>
    </div>

</template>
