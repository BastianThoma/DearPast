<template>
    <div class="mood-selector">
      <label class="mb-2 block text-sm font-medium text-gray-700">Stimmung</label>
      <div class="flex gap-3">
        <button
          v-for="mood in moods"
          :key="mood.value"
          @click="selectMood(mood.value)"
          :class="[
            'rounded-full p-3 transition',
            selectedMood === mood.value ? 'bg-blue-500 text-white' : 'bg-gray-200'
          ]"
          :aria-label="mood.label"
        >
          {{ mood.icon }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue'
  
  const props = defineProps({
    modelValue: String
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const moods = [
    { label: 'Glücklich', icon: '😊', value: 'happy' },
    { label: 'Traurig', icon: '😢', value: 'sad' },
    { label: 'Wütend', icon: '😠', value: 'angry' },
    { label: 'Überrascht', icon: '😮', value: 'surprised' },
    { label: 'Nachdenklich', icon: '🤔', value: 'thoughtful' },
  ]
  
  const selectedMood = computed(() => props.modelValue)
  
  function selectMood(value) {
    emit('update:modelValue', value)
  }
  </script>
  
  <style scoped>
  .mood-selector button {
    font-size: 1.5rem;
    cursor: pointer;
  }
  </style>
  