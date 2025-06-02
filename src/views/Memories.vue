<template>
  <div class="max-w-5xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Deine Erinnerungen</h2>

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <input v-model="searchQuery" type="text" placeholder="Suche nach Titel oder Text..." class="w-full md:w-1/2 px-4 py-2 border rounded placeholder:text-purple-400 bg-gradient-to-br from-gray-800 to-gray-900 shadow-md text-purple-500
hover:text-purple-700 hover:from-gray-900 hover:to-gray-800" />

      <div class="flex gap-2 w-full md:w-auto ">
        <select v-model="sortOrder" class="px-4 py-2 border rounded bg-gradient-to-br from-gray-800 to-gray-900 shadow-md text-purple-500
hover:text-purple-700 hover:from-gray-900 hover:to-gray-800 hover:cursor-pointer">
          <option class="bg-gray-800 hover:cursor-pointer" value="desc">Neueste zuerst</option>
          <option class="bg-gray-800 hover:cursor-pointer" value="asc">Älteste zuerst</option>
        </select>

        <button @click="resetFilters" class="px-4 py-2 border rounded bg-gradient-to-br from-gray-800 to-gray-900 shadow-md text-purple-500
hover:text-purple-700 hover:from-gray-900 hover:to-gray-800">
          Zurücksetzen
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-gray-500">Lade Erinnerungen...</div>
    <div v-else-if="filteredAndSortedMemories.length === 0" class="text-gray-500">
      Keine passenden Erinnerungen gefunden.
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <MemoryCard v-for="memory in filteredAndSortedMemories" :key="memory.id" :memory="memory"
        :onSave="fetchMemories" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import MemoryCard from '@/components/MemoryCard.vue';

const memories = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const sortOrder = ref('desc');
const resetFilters = () => {
  searchQuery.value = '';
  sortOrder.value = 'desc';
};

const fetchMemories = async () => {
  try {
    loading.value = true;

    if (!auth.currentUser) {
      loading.value = false;
      return;
    }

    const colRef = collection(db, 'users', auth.currentUser.uid, 'memories');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    memories.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      userId: auth.currentUser.uid,
      ...doc.data(),
    }));

    loading.value = false;
  } catch (error) {
    console.error('Fehler beim Laden:', error);
    loading.value = false;
  }
};

// 🔄 Gefiltert + Sortiert
const filteredAndSortedMemories = computed(() => {
  const filtered = memories.value.filter((memory) => {
    const search = searchQuery.value.toLowerCase();
    return (
      memory.title?.toLowerCase().includes(search) ||
      memory.text?.toLowerCase().includes(search)
    );
  });

  return filtered.sort((a, b) => {
    const dateA = a.createdAt?.seconds || 0;
    const dateB = b.createdAt?.seconds || 0;
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB;
  });
});

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchMemories();
    } else {
      loading.value = false;
    }
  });
});
</script>
