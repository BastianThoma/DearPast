<template>
  <div>
    <div class="bg-amber-100 shadow-md rounded-2xl p-20 border-8" :class="moodClass">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <span class="text-2xl mr-2">{{ moodIcon }}</span>
          <h3 class="text-xl font-semibold text-purple-700">{{ memory.title }}</h3>
        </div>
        <button @click="isModalOpen = true" class="btn bg-blue-500">Bearbeiten</button>
      </div>
      <p class="text-base text-purple-500 mb-4 break-words max-h-24 overflow-y-auto">{{ memory.text }}</p>
      <div class="text-sm text-purple-500">{{ formattedDate }}</div>
    </div>

    <!-- Modal für die Bearbeitung -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h3 class="text-lg font-bold mb-4">Erinnerung bearbeiten</h3>
        <input v-model="editedMemory.title" class="input text-purple-700 mb-4" />
        <textarea v-model="editedMemory.text" class="input h-24 resize-none text-purple-700 mb-4"></textarea>
        <select v-model="editedMemory.mood" class="input text-purple-700 mb-4">
          <option value="happy">😊 Glücklich</option>
          <option value="sad">😢 Traurig</option>
          <option value="angry">😠 Wütend</option>
          <option value="surprised">😮 Überrascht</option>
          <option value="thoughtful">🤔 Nachdenklich</option>
        </select>
        <div class="flex justify-end space-x-2">
          <button @click="saveEdit" class="btn bg-green-500">Speichern</button>
          <button @click="isModalOpen = false" class="btn bg-red-500">Abbrechen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';

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

let isModalOpen = ref(false);
let editedMemory = ref({ ...props.memory });

let saveEdit = async () => {
  try {
    if (!props.memory.userId || !props.memory.id) {
      console.error('Fehlende Daten in memory:', props.memory);
      alert('Fehler: Ungültige Daten.');
      return;
    }

    let docRef = doc(db, 'users', props.memory.userId, 'memories', props.memory.id);
    await updateDoc(docRef, {
      title: editedMemory.value.title,
      text: editedMemory.value.text,
      mood: editedMemory.value.mood,
    });

    isModalOpen.value = false;
    alert('Änderungen erfolgreich gespeichert!');

    if (props.onSave) {
      props.onSave();
    }
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
    alert('Fehler beim Speichern. Bitte erneut versuchen.');
  }
};
</script>