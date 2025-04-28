<template>
    <div class="max-w-xl mx-auto p-6">
      <h2 class="text-xl font-bold mb-4">Neue Erinnerung</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input v-model="title" class="input" placeholder="Titel" />
        <textarea v-model="text" class="input h-24 resize-none" placeholder="Dein Text..." />
        
        <select v-model="mood" class="input">
          <option disabled value="">Wähle eine Stimmung</option>
          <option value="happy">😊 Glücklich</option>
          <option value="sad">😢 Traurig</option>
          <option value="grateful">🙏 Dankbar</option>
          <option value="nostalgic">📸 Nostalgisch</option>
        </select>
  
        <button type="submit" class="btn">Speichern</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
  import { db } from '@/firebase/config'
  import { auth } from '@/firebase/config'
  import { useRouter } from 'vue-router'
  
  const title = ref('')
  const text = ref('')
  const mood = ref('')
  const router = useRouter()
  
  const handleSubmit = async () => {
    if (!auth.currentUser) return alert('Nicht eingeloggt')
  
    const refCol = collection(db, 'users', auth.currentUser.uid, 'memories')
    await addDoc(refCol, {
      title: title.value,
      text: text.value,
      mood: mood.value,
      createdAt: serverTimestamp()
    })
  
    title.value = ''
    text.value = ''
    mood.value = ''
  
    router.push('/memories')
  }
  </script>
  
  <style scoped>
  .input {
    @apply w-full border rounded p-2;
  }
  .btn {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
  }
  </style>
  