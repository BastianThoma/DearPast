<template>
  <div class="max-w-xl mx-auto p-6 text-center">
    <h2 class="text-2xl font-bold mb-6">Zufällige Erinnerung</h2>

    <div v-if="loading" class="text-gray-500">Wird geladen...</div>

    <MemoryCard v-if="randomMemory" :memory="randomMemory" />
    <div v-else-if="!loading" class="text-gray-400">Keine Erinnerungen gefunden.</div>

    <button @click="drawRandom" class="btn mt-6">Noch eine!</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db, auth } from '@/firebase/config'
import MemoryCard from '@/components/MemoryCard.vue'

const loading = ref(false)
const randomMemory = ref(null)

const drawRandom = async () => {
  loading.value = true
  randomMemory.value = null

  if (!auth.currentUser) return

  const colRef = collection(db, 'users', auth.currentUser.uid, 'memories')
  const snapshot = await getDocs(colRef)

  const memories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  if (memories.length > 0) {
    const rand = Math.floor(Math.random() * memories.length)
    randomMemory.value = memories[rand]
  }

  loading.value = false
}

drawRandom()
</script>

<style scoped lang="postcss">
.btn {
  @apply px-4 py-2 border rounded bg-gradient-to-br from-gray-800 to-gray-900 shadow-md text-purple-500 hover:text-purple-700 hover:from-gray-900 hover:to-gray-800;
}
</style>