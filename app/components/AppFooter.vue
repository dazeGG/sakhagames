<script setup lang="ts">
const socials = [
  { name: "telegram", label: "Telegram" },
  { name: "vk", label: "ВКонтакте" },
  { name: "youtube", label: "YouTube" },
  { name: "instagram", label: "Instagram" },
]
</script>

<template>
  <footer class="px-6 pt-10 pb-0 font-heading">
    <div class="text-[1.125rem] font-bold text-neutral-900 mb-1 tracking-[-0.01rem]">
      SakhaGames
    </div>
    <div class="font-serif-classic text-[0.875rem] text-neutral-600 italic mb-7">
      Archive of the Arctic Spirit
    </div>

    <div class="flex gap-3 mb-7">
      <a
        v-for="social in socials"
        :key="social.name"
        href="#"
        :aria-label="social.label"
        class="flex items-center justify-center size-11 -ml-2 text-neutral-900"
      >
        <UIcon
          :name="`i-simple-icons-${social.name}`"
          class="size-5"
        />
      </a>
    </div>

    <div class="bg-neutral-100 -mx-6 px-6 py-5 grid gap-1">
      <div class="text-[0.6875rem] text-neutral-900 font-sans">
        © 2026 SakhaGames. Все права защищены.
      </div>
      <div class="text-[0.625rem] tracking-[0.14rem] text-neutral-600 font-semibold uppercase">
        ЯКУТСК · РЕСПУБЛИКА САХА
      </div>
    </div>
  </footer>
</template>
