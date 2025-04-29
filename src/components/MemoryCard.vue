<template>
    <div class="bg-amber-100 shadow-md rounded-2xl p-4 border-8" :class="moodClass">
      <h3 class="text-lg font-semibold text-purple-700 mb-1">{{ memory.title }}</h3>
      <p class="text-sm text-purple-500 mb-2">{{ memory.text }}</p>
      <div class="text-xs text-purple-500">{{ formattedDate }}</div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  let props = defineProps({
    memory: Object
  })
  
  let formattedDate = computed(() =>
    new Date(props.memory.createdAt?.seconds * 1000).toLocaleDateString()
  )
  
  let moodClass = computed(() => {
    switch (props.memory.mood) {
      case 'happy': return 'border-yellow-400'
      case 'sad': return 'border-blue-400'
      case 'grateful': return 'border-pink-400'
      case 'nostalgic': return 'border-purple-400'
      default: return 'border-gray-300'
    }
  })
  </script>
  