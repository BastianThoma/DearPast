<template>
  <div class="max-w-xl mx-auto p-6">
    <h2 class="text-xl font-bold mb-4">Erinnerung bearbeiten</h2>
    <form @submit.prevent="handleUpdate" class="space-y-4">
      <input v-model="title" class="input text-purple-700 placeholder:text-purple-400" placeholder="Titel" />
      <textarea v-model="text" class="input h-24 resize-none text-purple-700 placeholder:text-purple-400" placeholder="Dein Text..." />
      
      <select 
        v-model="mood" 
        :class="mood ? 'text-purple-700' : 'text-purple-400'" 
        class="input">
        <option disabled value="" class="text-purple-400">Wähle eine Stimmung</option>
        <option value="happy">😊 Glücklich</option>
        <option value="sad">😢 Traurig</option>
        <option value="angry">😠 Wütend</option>
        <option value="surprised">😮 Überrascht</option>
        <option value="thoughtful">🤔 Nachdenklich</option>
      </select>

      <button type="submit" class="btn">Änderungen speichern</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase/config';

const route = useRoute();
const router = useRouter();

const title = ref('');
const text = ref('');
const mood = ref('');
const memoryId = ref('');

onMounted(() => {
  title.value = route.query.title || '';
  text.value = route.query.text || '';
  mood.value = route.query.mood || '';
  memoryId.value = route.query.id || '';
});

const handleUpdate = async () => {
  if (!auth.currentUser) return alert('Nicht eingeloggt');

  try {
    const docRef = doc(db, 'users', auth.currentUser.uid, 'memories', memoryId.value);
    await updateDoc(docRef, {
      title: title.value,
      text: text.value,
      mood: mood.value,
    });

    alert('Erinnerung erfolgreich aktualisiert!');
    router.push('/memories');
  } catch (err) {
    console.error('Update-Fehler:', err);
    alert('Fehler beim Speichern. Bitte erneut versuchen.');
  }
};
</script>

<style scoped lang="postcss">
.input {
  @apply w-full border rounded p-2;
}
.btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}
</style>
