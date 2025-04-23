<template>
  <div
        class="template-card">
      
  <div class="template-preview">
          <!-- <img :src="video.thumbnail_path" :alt=" video.title" /> -->
          <img
        :src="getThumbnailUrl(video.thumbnail_path)"
        :class="{'opacity-0': !isHovering && !imageError, 'opacity-80': imageError}"
        id="thumb"
        @error="handleImageError"
        loading="lazy"
      />
          <div class="template-overlay">
            <button @click="navigateToVideo" class="preview-btn">Preview</button>
            <button class="download-btn">Download</button>
          </div>
          <div class="template-label">
            <!-- <span class="template-name">Duration</span> -->
            <span class="template-category">{{ formatDuration(video.duration) }}</span>
          </div>
        </div>
        <div class="template-info">
             <div> 
            <span class="template-date">{{ formatDate(video.created_at) }}</span>
            <span class="icon">👁️</span>
             </div>
          <h3 class="template-title">{{  video.title }}</h3>
          <div class="template-source">
            <span>{{ video.source }}</span>
          </div>
          <p class="template-description">
            {{ video.description }}
          </p>
          <div class="template-tags">
            <!-- <span v-for="(tag, index) in video.tags" :key="index" class="tag">{{ tag }}</span> -->
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
