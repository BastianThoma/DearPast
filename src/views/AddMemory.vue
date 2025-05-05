<template>
    <div class="max-w-xl mx-auto p-6">
      <h2 class="text-xl font-bold mb-4">Neue Erinnerung</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input v-model="title" class="input text-purple-700 placeholder:text-purple-400" placeholder="Titel" />
        <textarea v-model="text" class="input h-24 resize-none text-purple-700 placeholder:text-purple-400" placeholder="Dein Text..." />
        
        <select 
          v-model="mood" 
          :class="mood ? 'text-purple-700' : 'text-purple-400'" 
          class="input">
          <option disabled value="" class="text-purple-400">Wähle eine Stimmung</option>
          <option value="happy" class="text-purple-400">😊 Glücklich</option>
          <option value="sad" class="text-purple-400">😢 Traurig</option>
          <option value="angry" class="text-purple-400">😠 Wütend</option>
          <option value="surprised" class="text-purple-400">😮 Überrascht</option>
          <option value="thoughtful" class="text-purple-400">🤔 Nachdenklich</option>
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
  
  let title = ref('')
  let text = ref('')
  let mood = ref('')
  let router = useRouter()
  
  let handleSubmit = async () => {
    if (!auth.currentUser) return alert('Nicht eingeloggt')
  
    let refCol = collection(db, 'users', auth.currentUser.uid, 'memories')
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
  