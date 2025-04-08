<!-- src/components/video/VideoPlayer.vue -->
<template>
  <div class="video-player relative w-full bg-black" :class="{ 'fullscreen': isFullscreen }">
    <!-- Video element -->
    <video
      ref="videoRef"
      class="w-full h-full"
      @click="togglePlay"
      @timeupdate="updateProgress"
      @ended="videoEnded"
      @loadedmetadata="videoLoaded"
    >
      <source :src="videoSrc" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    
    <!-- Video controls overlay -->
    <div 
      class="controls-overlay absolute inset-0 flex flex-col justify-end transition-opacity"
      :class="{ 'opacity-0': isPlaying && !isControlsVisible }"
      @mouseenter="showControls"
      @mouseleave="hideControls"
    >
      <!-- Play/Pause button overlay (center of video) -->
      <div class="absolute inset-0 flex items-center justify-center">
        <button 
          v-if="!isPlaying"
          @click="togglePlay"
          class="play-button w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-transform hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      
      <!-- Bottom controls bar -->
      <div class="bottom-controls bg-gradient-to-t from-black to-transparent px-4 pt-20 pb-4">
        <!-- Progress bar -->
        <div 
          class="progress-container h-2 bg-gray-600 rounded-full cursor-pointer"
          @click="seek"
          ref="progressContainerRef"
        >
          <div 
            class="progress-bar h-full bg-blue-500 rounded-full relative"
            :style="{ width: `${progressPercentage}%` }"
          >
            <div class="progress-thumb absolute right-0 transform translate-x-1/2 -translate-y-1/3 w-4 h-4 bg-blue-400 rounded-full shadow-lg"></div>
          </div>
        </div>
        
        <!-- Main controls -->
        <div class="flex items-center justify-between mt-4">
          <div class="left-controls flex items-center space-x-4">
            <button @click="togglePlay" class="text-white focus:outline-none">
              <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            <!-- Volume control -->
            <div class="volume-control flex items-center">
              <button @click="toggleMute" class="text-white focus:outline-none">
                <svg v-if="isMuted || volume === 0" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                <svg v-else-if="volume < 0.5" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.07 7.07a8 8 0 010 9.9" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.73 10.73a3.5 3.5 0 010 2.54" />
                </svg>
              </button>
              
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                v-model="volume"
                class="ml-2 w-20 accent-blue-500"
                @input="adjustVolume"
              />
            </div>
            
            <!-- Time display -->
            <div class="time-display text-white text-sm">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </div>
          </div>
          
          <div class="right-controls">
            <button @click="toggleFullscreen" class="text-white focus:outline-none">
              <svg v-if="isFullscreen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  videoSrc: string;
  autoplay?: boolean;
}>();

// Refs
const videoRef = ref<HTMLVideoElement | null>(null);
const progressContainerRef = ref<HTMLElement | null>(null);
const isPlaying = ref(false);
const isMuted = ref(false);
const isFullscreen = ref(false);
const isControlsVisible = ref(true);
const volume = ref(1);
const currentTime = ref(0);
const duration = ref(0);
const controlsTimeout = ref<number | null>(null);

// Computed
const progressPercentage = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
});

// Methods
const togglePlay = () => {
  if (!videoRef.value) return;
  
  if (isPlaying.value) {
    videoRef.value.pause();
  } else {
    videoRef.value.play();
  }
  
  isPlaying.value = !isPlaying.value;
  showControls();
};

const toggleMute = () => {
  if (!videoRef.value) return;
  
  isMuted.value = !isMuted.value;
  videoRef.value.muted = isMuted.value;
  
  if (isMuted.value) {
    volume.value = 0;
  } else {
    volume.value = videoRef.value.volume;
  }
  
  showControls();
};

const adjustVolume = () => {
  if (!videoRef.value) return;
  
  videoRef.value.volume = volume.value;
  isMuted.value = volume.value === 0;
  
  showControls();
};

const seek = (event: MouseEvent) => {
  if (!videoRef.value || !progressContainerRef.value) return;
  
  const rect = progressContainerRef.value.getBoundingClientRect();
  const clickPosition = (event.clientX - rect.left) / rect.width;
  const seekTime = clickPosition * duration.value;
  
  videoRef.value.currentTime = seekTime;
  currentTime.value = seekTime;
  
  showControls();
};

const toggleFullscreen = () => {
  const videoContainer = videoRef.value?.parentElement;
  
  if (!videoContainer) return;
  
  if (!isFullscreen.value) {
    if (videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen();
    } else if ((videoContainer as any).webkitRequestFullscreen) {
      (videoContainer as any).webkitRequestFullscreen();
    } else if ((videoContainer as any).msRequestFullscreen) {
      (videoContainer as any).msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }
  
  showControls();
};

const updateProgress = () => {
  if (!videoRef.value) return;
  
  currentTime.value = videoRef.value.currentTime;
};

const videoLoaded = () => {
  if (!videoRef.value) return;
  
  duration.value = videoRef.value.duration;
  
  // Apply autoplay if provided
  if (props.autoplay) {
    togglePlay();
  }
};

const videoEnded = () => {
  isPlaying.value = false;
  showControls();
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const showControls = () => {
  isControlsVisible.value = true;
  
  // Clear any existing timeout
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value);
  }
  
  // Hide controls after 3 seconds of inactivity
  if (isPlaying.value) {
    controlsTimeout.value = setTimeout(() => {
      isControlsVisible.value = false;
    }, 3000);
  }
};

const hideControls = () => {
  if (isPlaying.value) {
    isControlsVisible.value = false;
  }
};

// Event listeners for fullscreen changes
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  if (!videoRef.value) return;
  
  switch (event.key) {
    case ' ':
    case 'k':
      // Space or K to toggle play/pause
      event.preventDefault();
      togglePlay();
      break;
    case 'f':
      // F to toggle fullscreen
      event.preventDefault();
      toggleFullscreen();
      break;
    case 'm':
      // M to toggle mute
      event.preventDefault();
      toggleMute();
      break;
    case 'ArrowRight':
      // Right arrow to seek forward
      event.preventDefault();
      videoRef.value.currentTime += 10;
      showControls();
      break;
    case 'ArrowLeft':
      // Left arrow to seek backward
      event.preventDefault();
      videoRef.value.currentTime -= 10;
      showControls();
      break;
    case 'ArrowUp':
      // Up arrow to increase volume
      event.preventDefault();
      volume.value = Math.min(1, volume.value + 0.1);
      adjustVolume();
      break;
    case 'ArrowDown':
      // Down arrow to decrease volume
      event.preventDefault();
      volume.value = Math.max(0, volume.value - 0.1);
      adjustVolume();
      break;
  }
};

// Lifecycle hooks
onMounted(() => {
  // Add event listeners
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('msfullscreenchange', handleFullscreenChange);
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  // Remove event listeners
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.removeEventListener('msfullscreenchange', handleFullscreenChange);
  document.removeEventListener('keydown', handleKeydown);
  
  // Clear any timeout
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value);
  }
});

// Watch for prop changes
watch(() => props.videoSrc, () => {
  // Reset player state when video source changes
  if (videoRef.value) {
    videoRef.value.currentTime = 0;
    currentTime.value = 0;
    isPlaying.value = false;
  }
});
</script>

<style scoped>
.video-player {
  aspect-ratio: 16/9;
}

.video-player.fullscreen {
  aspect-ratio: unset;
}

.controls-overlay {
  opacity: 1;
  transition: opacity 0.3s ease;
}

input[type="range"] {
  -webkit-appearance: none;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

button {
  transition: transform 0.2s ease;
}

button:hover {
  transform: scale(1.1);
}

.progress-thumb {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.progress-container:hover .progress-thumb {
  opacity: 1;
}
</style>