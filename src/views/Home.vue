<template>
    <div class="text-center py-20 max-w-2xl mx-auto px-4">
      <h1 class="text-4xl font-bold mb-4 text-purple-700">Willkommen bei DearPast 💌</h1>
      <p class="text-gray-600 mb-6 text-lg">Schreibe Erinnerungen auf, halte deine Gefühle fest und blicke zurück, wann immer du willst.</p>
  
      <div class="flex justify-center gap-4">
        <RouterLink to="/register" class="btn">Jetzt starten</RouterLink>
      </div>
    </div>
  </template>
  
  <style scoped lang="postcss">
  .btn {
    @apply bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700;
  }
  .btn-secondary {
    @apply border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-100;
  }
  </style>
  