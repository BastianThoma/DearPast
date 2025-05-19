<template>
  <div class="bg-gradient-to-br from-gray-800 to-gray-900 shadow-md rounded-2xl p-20 border-8 relative"
    :class="moodClass">
    <button @click="editMemory"
      class="btn bg-gradient-to-br from-gray-800 to-gray-900 shadow-md absolute top-4 right-4 border-2"
      :class="moodClass">
      Bearbeiten
    </button>

    <button @click="confirmDelete" class="btn bg-red-600 absolute bottom-4 right-4 border-2 text-white">
      Löschen
    </button>

    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <span class="text-2xl mr-2 text-white">{{ moodIcon }}</span>
        <h3
          class="text-xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          {{ memory.title }}
        </h3>
      </div>
    </div>

    <p class="text-base text-gray-400 mb-4 break-words min-h-24 max-h-24 overflow-y-auto">
      {{ memory.text }}
    </p>
    <div class="text-sm text-blue-300">{{ formattedDate }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { doc, deleteDoc } from 'firebase/firestore'
import { db, auth } from '@/firebase/config'

const props = defineProps({
  memory: Object,
  onSave: Function,
})

const router = useRouter()

const editMemory = () => {
  router.push({
    name: 'edit-memory',
    query: {
      id: props.memory.id,
      title: props.memory.title,
      text: props.memory.text,
      mood: props.memory.mood,
    },
  })
}

const confirmDelete = async () => {
  if (!props.memory.id || !auth.currentUser) {
    alert('Fehler: Erinnerung oder Benutzer nicht gefunden.')
    return
  }

  const confirmed = confirm('Möchtest du diese Erinnerung wirklich löschen?')
  if (!confirmed) return

  try {
    const docRef = doc(
      db,
      'users',
      auth.currentUser.uid,
      'memories',
      props.memory.id
    )
    await deleteDoc(docRef)

    alert('Erinnerung gelöscht.')

    if (props.onSave) props.onSave()
  } catch (err) {
    console.error('Löschen fehlgeschlagen:', err)
    alert('Konnte die Erinnerung nicht löschen.')
  }
}

const formattedDate = computed(() =>
  new Date(props.memory.createdAt?.seconds * 1000).toLocaleDateString()
)

const moods = [
  { label: 'Glücklich', icon: '😊', value: 'happy' },
  { label: 'Traurig', icon: '😢', value: 'sad' },
  { label: 'Wütend', icon: '😠', value: 'angry' },
  { label: 'Überrascht', icon: '😮', value: 'surprised' },
  { label: 'Nachdenklich', icon: '🤔', value: 'thoughtful' },
]

const moodIcon = computed(() => {
  const mood = moods.find((m) => m.value === props.memory.mood)
  return mood ? mood.icon : '❓'
})

const moodClass = computed(() => {
  switch (props.memory.mood) {
    case 'happy':
      return 'border-yellow-400'
    case 'sad':
      return 'border-blue-400'
    case 'angry':
      return 'border-red-400'
    case 'surprised':
      return 'border-green-400'
    case 'thoughtful':
      return 'border-gray-400'
    default:
      return 'border-purple-400'
  }
})
</script>

<style scoped lang="postcss">
.btn {
  @apply text-purple-500 px-4 py-2 rounded hover:text-purple-700 hover:from-gray-900 hover:to-gray-800;
}

.border-yellow-400 p::-webkit-scrollbar-thumb,
.border-yellow-400 p {
  scrollbar-color: #facc15 #23272f;
}

.border-blue-400 p::-webkit-scrollbar-thumb,
.border-blue-400 p {
  scrollbar-color: #60a5fa #23272f;
}

.border-red-400 p::-webkit-scrollbar-thumb,
.border-red-400 p {
  scrollbar-color: #f87171 #23272f;
}

.border-green-400 p::-webkit-scrollbar-thumb,
.border-green-400 p {
  scrollbar-color: #34d399 #23272f;
}

.border-gray-400 p::-webkit-scrollbar-thumb,
.border-gray-400 p {
  scrollbar-color: #a1a1aa #23272f;
}

.border-purple-400 p::-webkit-scrollbar-thumb,
.border-purple-400 p {
  scrollbar-color: #a78bfa #23272f;
}

p {
  scrollbar-width: thin;
  scrollbar-color: #facc15 #23272f;
}
</style>
