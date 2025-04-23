<template>
  <div class="video-platform">
    <!-- Header with browsing link and search bar -->


    <!-- Content Section -->
    <div class="content">
      <!-- Template Cards -->
      <div 
        v-for="template in filteredTemplates" 
        :key="template.id" 
        class="template-card"
      >
        <div class="template-preview">
          <img :src="template.image" :alt="template.name" />
          <div class="template-overlay">
            <button class="preview-btn">Preview</button>
            <button class="download-btn">Download</button>
          </div>
          <div class="template-label">
            <span class="template-name">Duration</span>
            <span class="template-category">{{ template.labelCategory }}</span>
          </div>
        </div>
        <div class="template-info">
          <h3 class="template-title">{{ template.name }}</h3>
          <div class="template-source">
            <span>{{ template.source }}</span>
          </div>
          <p class="template-description">
            {{ template.description }}
          </p>
          <div class="template-tags">
            <span v-for="(tag, index) in template.tags" :key="index" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoPlatform',
  data() {
    return {
      searchQuery: '',
      templates: [
        {
          id: 1,
          name: 'Animated Line Lower Third',
          category: 'Lower Thirds',
          source: 'DaVinci Resolve / comp',
          description: 'A simple lower third with an animated intro and motion blur outro.',
          tags: ['Text Field', 'Motion Blur', 'Lower Thirds'],
          image: '/api/placeholder/400/320',
          label: 'Mixkit Template',
          labelCategory: 'Animation • Free'
        },
        {
          id: 2,
          name: 'Cinematic Title Sequence',
          category: 'Titles',
          source: 'DaVinci Resolve / comp',
          description: 'Dramatic opening titles with parallax effect and modern typography.',
          tags: ['Cinematic', 'Title', 'Parallax'],
          image: '/api/placeholder/400/320',
          label: 'Premium Template',
          labelCategory: 'Cinematic • Pro'
        },
        {
          id: 3,
          name: 'Instagram Story Transition',
          category: 'Instagram',
          source: 'DaVinci Resolve / comp',
          description: 'Smooth transitions designed specifically for Instagram stories.',
          tags: ['Social Media', 'Transition', 'Story'],
          image: '/api/placeholder/400/320',
          label: 'Social Template',
          labelCategory: 'Social • Free'
        }
      ]
    };
  },
  computed: {
    filteredTemplates() {
      if (!this.searchQuery) return this.templates;
      
      const query = this.searchQuery.toLowerCase();
      return this.templates.filter(template => {
        return template.name.toLowerCase().includes(query) || 
               template.category.toLowerCase().includes(query) ||
               template.tags.some(tag => tag.toLowerCase().includes(query));
      });
    }
  }
}
</script>
