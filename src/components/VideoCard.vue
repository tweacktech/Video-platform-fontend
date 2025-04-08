<template>
  <div
    class="video-card bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
    @click="navigateToVideo"
    role="button"
    tabindex="0"
  >
    <!-- Thumbnail Container -->
    <div class="relative aspect-video bg-gray-700">
      <!-- Thumbnail Image -->
      <img
        :src="getThumbnailUrl(video.thumbnail_path)"
        :alt="video.title"
        class="absolute inset-0 object-cover transition-opacity duration-300"
        :class="{ 'opacity-80': imageError }"
        @error="handleImageError"
        loading="lazy"
      />

      <!-- Fallback -->
      <div
        v-if="imageError"
        class="absolute inset-0 flex items-center justify-center bg-gray-600 text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>

      <!-- Duration Badge -->
      <div class="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white font-semibold">
        {{ formatDuration(video.duration) }}
      </div>
    </div>

    <!-- Details Section -->
    <div class="p-4 space-y-1">
      <h3 class="text-white font-semibold text-lg truncate hover:text-blue-400">
        {{ video.title }}
      </h3>

      <div class="flex items-center justify-between text-sm text-gray-400">
        <span>{{ video.user?.name }}</span>
        <span>{{ formatDate(video.created_at) }}</span>
      </div>

      <div v-if="video.category" class="pt-1">
        <span class="inline-block text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full hover:bg-blue-700 transition">
          {{ video.category.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Video } from '@/types/Video';

const props = defineProps<{ video: Video }>();

const router = useRouter();
const imageError = ref(false);

const getThumbnailUrl = (path: string): string => {
  if (!path) {
    imageError.value = true;
    return '/pexels-tima-miroshnichenko-5662857.jpg';
    // return null;
  }
  return path.startsWith('http') ? path : `http://127.0.0.1:8000/${path}`;
};

const handleImageError = (e: Event) => {
  imageError.value = true;
  const img = e.target as HTMLImageElement;
  img.src = '';
};

const formatDuration = (seconds: number): string => {
  if (!seconds) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const navigateToVideo = () => {
  router.push({ name: 'VideoDetail', params: { id: props.video.id } });
};
</script>

<style scoped>
.video-card:focus {
  outline: 2px solid #3b82f6; /* Tailwind blue-500 */
  outline-offset: 2px;
}
img {
  padding: 10px;
  transition: opacity 0.3s ease;
  width: 40%;
  border-radius: 5%;
}
.video-card{
  /* height: 50%; */
  border-radius: 2%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.video-card:hover {
  box-shadow: 0 8px 16px rgba(62, 30, 30, 0.3);
}
</style>
