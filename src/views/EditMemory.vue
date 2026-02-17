<template>
  <div class="max-w-xl mx-auto p-6">
    <h2 class="text-xl font-bold mb-4">Erinnerung bearbeiten</h2>
    <form @submit.prevent="handleUpdate" class="space-y-4">
      <div>
        <input v-model="title" @blur="validateTitleField"
          class="input bg-[#303030] text-gray-200 placeholder:text-gray-500"
          :class="{ 'border-red-500': hasError('title') && isTouched('title') }" placeholder="Titel" />
        <p v-if="hasError('title') && isTouched('title')" class="text-red-500 text-sm mt-1">
          {{ getError('title') }}
        </p>
      </div>

      <div>
        <textarea v-model="text" @blur="validateTextField"
          class="input bg-[#303030] h-24 resize-none text-gray-200 placeholder:text-gray-500"
          :class="{ 'border-red-500': hasError('text') && isTouched('text') }" placeholder="Dein Text..." />
        <p v-if="hasError('text') && isTouched('text')" class="text-red-500 text-sm mt-1">
          {{ getError('text') }}
        </p>
      </div>

      <div>
        <select v-model="mood" @blur="validateMoodField" :class="[
          mood ? 'text-gray-200' : 'text-gray-500',
          { 'border-red-500': hasError('mood') && isTouched('mood') }
        ]" class="input bg-[#303030]">
          <option disabled value="" class="text-gray-500">Wähle eine Stimmung</option>
          <option value="happy">😊 Glücklich</option>
          <option value="sad">😢 Traurig</option>
          <option value="angry">😠 Wütend</option>
          <option value="surprised">😮 Überrascht</option>
          <option value="thoughtful">🤔 Nachdenklich</option>
        </select>
        <p v-if="hasError('mood') && isTouched('mood')" class="text-red-500 text-sm mt-1">
          {{ getError('mood') }}
        </p>
      </div>

      <button type="submit" class="btn w-full" :disabled="!isValid || isSubmitting"
        :class="{ 'opacity-50 cursor-not-allowed': !isValid || isSubmitting }">
        {{ isSubmitting ? 'Wird gespeichert...' : 'Änderungen speichern' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase/config';
import { useToast } from '@/composables/useToast';
import { useFirebaseError } from '@/composables/useFirebaseError';
import { useFormValidation, useFieldValidation } from '@/composables/useFormValidation';

const route = useRoute();
const router = useRouter();

const title = ref('');
const text = ref('');
const mood = ref('');
const memoryId = ref(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id);
const isSubmitting = ref(false);

const { showSuccess, showError } = useToast();
const { handleFirebaseError } = useFirebaseError();
const { validateRequired, validateMinLength } = useFormValidation();
const { setError, clearError, hasError, getError, isTouched, setTouched, isValid } = useFieldValidation();

/**
 * Validiert Titel Field
 */
const validateTitleField = () => {
  setTouched('title')

  if (!validateRequired(title.value)) {
    setError('title', 'Titel ist erforderlich')
    return false
  }

  if (!validateMinLength(title.value, 3)) {
    setError('title', 'Titel muss mindestens 3 Zeichen haben')
    return false
  }

  clearError('title')
  return true
}

/**
 * Validiert Text Field
 */
const validateTextField = () => {
  setTouched('text')

  if (!validateRequired(text.value)) {
    setError('text', 'Text ist erforderlich')
    return false
  }

  if (!validateMinLength(text.value, 10)) {
    setError('text', 'Text muss mindestens 10 Zeichen haben')
    return false
  }

  clearError('text')
  return true
}

/**
 * Validiert Mood Field
 */
const validateMoodField = () => {
  setTouched('mood')

  if (!validateRequired(mood.value)) {
    setError('mood', 'Bitte wähle eine Stimmung')
    return false
  }

  clearError('mood')
  return true
}

/**
 * Validiert gesamte Form
 */
const validateForm = (): boolean => {
  const isTitleValid = validateTitleField()
  const isTextValid = validateTextField()
  const isMoodValid = validateMoodField()
  return isTitleValid && isTextValid && isMoodValid
}

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
  // Touch alle Fields
  setTouched('title')
  setTouched('text')
  setTouched('mood')

  if (!auth.currentUser) {
    showError('Du musst eingeloggt sein!');
    return router.push('/login');
  }

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

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
  } finally {
    isSubmitting.value = false
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
