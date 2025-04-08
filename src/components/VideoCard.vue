<template>
  <div
    class="video-card bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
    @click="navigateToVideo"
    role="button"
    tabindex="0"
  >
    <!-- Thumbnail Container -->
    <div class="relative aspect-video bg-gray-700">
      
      <div 
        class="absolute inset-0 flex items-center justify-center bg-gray-600 text-white transition-opacity duration-300"
        :class="{'opacity-0': isHovering}"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <!-- Thumbnail Image (visible on hover) -->
      <img
        :src="getThumbnailUrl(video.thumbnail_path)"
        class="absolute inset-0 object-cover transition-opacity duration-300"
        :class="{'opacity-0': !isHovering && !imageError, 'opacity-80': imageError}"
        @error="handleImageError"
        loading="lazy"
      />
      
      <!-- Duration Badge -->
      <div class="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white font-semibold z-10">
        Duration: {{ formatDuration(video.duration) }}
      </div>
    </div>
    
    <!-- Details Section -->
    <div class="p-4 space-y-1">
      <h3 class="text-white font-semibold text-lg truncate hover:text-blue-400">
        Title: {{ video.title }}
      </h3>
      <div class="flex items-center justify-between text-sm text-gray-400">
        <span>{{ video.user?.name }}</span>
        <span>{{ formatDate(video.created_at) }}</span>
      </div>
      <div v-if="video.category" class="pt-1">
        <span class="inline-block text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full hover:bg-blue-700 transition">
          Category: {{ video.category.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Video } from '@/types/Video';
import { URL } from '@/config'


const props = defineProps<{ video: Video }>();
const router = useRouter();
const imageError = ref(false);
const isHovering = ref(false);

const getThumbnailUrl = (path: string): string => {
  if (!path) {
    imageError.value = true;
    return;
  }
  return path.startsWith('http') ? path : `${URL}${path}`;
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
.video-card {
  border-radius: 2%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.video-card:hover {
  box-shadow: 0 8px 16px rgba(62, 30, 30, 0.3);
}

.video-card:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

img {
  transition: opacity 0.3s ease;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-card:hover .opacity-0 {
  opacity: 1 !important;
}

.video-card:hover img {
  opacity: 1 !important;
}
</style>