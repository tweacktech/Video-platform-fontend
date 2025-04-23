
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../src/stores/auth'
import Header from '../src/components/layout/Header.vue'
import Footer from '../src/components/layout/Footer.vue'

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

<template>
    <Header class="header" />

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

  <Footer class="footer" />
</template>
