<template>

  <div class="bg-[#FAF9F6] shadow-md rounded-2xl p-20 border-8 relative" :class="moodClass">
    <button @click="editMemory" class="btn bg-blue-500 absolute top-4 right-4">Bearbeiten</button>
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <span class="text-2xl mr-2">{{ moodIcon }}</span>
        <h3 class="text-xl font-semibold text-gray-800">{{ memory.title }}</h3>
      </div>

    </div>
    <p class="text-base text-gray-600 mb-4 break-words min-h-24 max-h-24 overflow-y-auto">{{ memory.text }}</p>
    <div class="text-sm text-gray-500">{{ formattedDate }}</div>
  </div>

</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const editMemory = () => {
  router.push({
    name: 'edit-memory',
    query: {
      id: props.memory.id,
      title: props.memory.title,
      text: props.memory.text,
      mood: props.memory.mood,
    },
  });
};

let moods = [
  { label: 'Glücklich', icon: '😊', value: 'happy' },
  { label: 'Traurig', icon: '😢', value: 'sad' },
  { label: 'Wütend', icon: '😠', value: 'angry' },
  { label: 'Überrascht', icon: '😮', value: 'surprised' },
  { label: 'Nachdenklich', icon: '🤔', value: 'thoughtful' },
];

let props = defineProps({
  memory: Object,
  onSave: Function,
});

let formattedDate = computed(() =>
  new Date(props.memory.createdAt?.seconds * 1000).toLocaleDateString()
);

let moodClass = computed(() => {
  switch (props.memory.mood) {
    case 'happy': return 'border-yellow-400';
    case 'sad': return 'border-blue-400';
    case 'angry': return 'border-red-400';
    case 'surprised': return 'border-green-400';
    case 'thoughtful': return 'border-gray-400';
    default: return 'border-purple-400';
  }
});

let moodIcon = computed(() => {
  let mood = moods.find((m) => m.value === props.memory.mood);
  return mood ? mood.icon : '❓';
});

</script>

<style scoped lang="postcss">
.btn {
  @apply bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700;
}
</style>