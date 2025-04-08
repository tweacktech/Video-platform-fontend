<script setup lang="ts">
import Header from '../components/layout/Header.vue';

</script>
<template>
  <div class="app-container">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
  </div>
   
</template>