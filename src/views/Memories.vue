<template>
    <div class="max-w-5xl mx-auto p-6">
      <h2 class="text-2xl font-bold mb-6">Deine Erinnerungen</h2>
  
      <div v-if="loading" class="text-gray-500">Lade Erinnerungen...</div>
      <div v-else-if="memories.length === 0" class="text-gray-500">Noch keine Erinnerungen gespeichert.</div>
  
      <div class="grid gap-4 md:grid-cols-2">
        <MemoryCard v-for="memory in memories" :key="memory.id" :memory="memory" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { collection, getDocs, query, orderBy } from 'firebase/firestore'
  import { db, auth } from '@/firebase/config'
  import MemoryCard from '@/components/MemoryCard.vue'
  
  let memories = ref([])
  let loading = ref(true)
  
  let fetchMemories = async () => {
    if (!auth.currentUser) return
  
    let colRef = collection(db, 'users', auth.currentUser.uid, 'memories')
    let q = query(colRef, orderBy('createdAt', 'desc'))
  
    let snapshot = await getDocs(q)
    memories.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  
    loading.value = false
  }
  
  onMounted(() => {
    fetchMemories()
  })
  </script>
  