<template>
  <div class="max-w-xl mx-auto p-6">
    <h2 class="text-xl font-bold mb-4">Erinnerung bearbeiten</h2>
    <form @submit.prevent="handleUpdate" class="space-y-4">
      <input v-model="title" class="input bg-[#303030] text-gray-200 placeholder:text-gray-500" placeholder="Titel" />
      <textarea v-model="text" class="input bg-[#303030] h-24 resize-none text-gray-200 placeholder:text-gray-500"
        placeholder="Dein Text..." />

      <select v-model="mood" :class="mood ? 'text-gray-200' : 'text-gray-500'" class="input bg-[#303030]">
        <option disabled value="" class="text-gray-500">Wähle eine Stimmung</option>
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
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase/config';
import { useToast } from '@/composables/useToast';
import { useFirebaseError } from '@/composables/useFirebaseError';

const route = useRoute();
const router = useRouter();

const title = ref('');
const text = ref('');
const mood = ref('');
const memoryId = ref(route.params.id);

const { showSuccess, showError } = useToast();
const { handleFirebaseError } = useFirebaseError();

onMounted(async () => {
  if (!auth.currentUser) {
    showError('Du musst eingeloggt sein!');
    return router.push('/login');
  }

  try {
    const docRef = doc(db, 'users', auth.currentUser.uid, 'memories', memoryId.value);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      showError('Erinnerung nicht gefunden');
      return router.push('/memories');
    }

    const data = snapshot.data();
    title.value = data.title;
    text.value = data.text;
    mood.value = data.mood;
  } catch (err) {
    handleFirebaseError(err, 'Fehler beim Laden der Erinnerung');
    router.push('/memories');
  }
});

const handleUpdate = async () => {
  if (!auth.currentUser) {
    showError('Du musst eingeloggt sein!');
    return router.push('/login');
  }

  try {
    const docRef = doc(db, 'users', auth.currentUser.uid, 'memories', memoryId.value);
    await updateDoc(docRef, {
      title: title.value,
      text: text.value,
      mood: mood.value,
    });

    showSuccess('Änderungen gespeichert! ✅');
    router.push('/memories');
  } catch (err) {
    handleFirebaseError(err, 'Fehler beim Aktualisieren');
  }
};
</script>

<style scoped lang="postcss">
.input {
  @apply w-full border rounded p-2;
}

.btn {
  @apply px-4 py-2 border rounded bg-gradient-to-br from-gray-800 to-gray-900 shadow-md text-purple-500 hover:text-purple-700 hover:from-gray-900 hover:to-gray-800;
}
</style>
