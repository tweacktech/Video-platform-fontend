
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../src/stores/auth'
import Header from '../src/components/layout/Header.vue'

const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  try {
    await authStore.logout()
    router.push({ name: 'Home' })
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
/* Add your styles here */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}


.logout-btn {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.footer {
  background-color: #1a1a2e;
  color: white;
  text-align: center;
  padding: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="app-container">
    
    <Header class="header" />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <footer class="footer">
      <p>&copy; 2025 Video Platform</p>
    </footer>
  </div>
</template>
