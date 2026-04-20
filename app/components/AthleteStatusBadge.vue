<script setup lang="ts">
defineProps<{
  isActive: boolean
  variant?: "light" | "dark"
}>()
</script>

<template>
  <p
    class="font-heading text-[0.5625rem] tracking-[0.075rem] font-semibold uppercase"
    :class="variant === 'dark' ? 'text-white/50' : 'text-neutral-600'"
  >
    {{ isActive ? 'Активный' : 'Ветеран' }}
  </p>
</template>
