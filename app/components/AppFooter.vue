<script setup lang="ts">
const route = useRoute()

const links = [
  { label: "СПОРТСМЕНЫ", to: "/athletes" },
  { label: "АРХИВ ИГР", to: "/games" },
  { label: "ПРАВИЛА", to: "/rules" },
  { label: "О ПРОЕКТЕ", to: "/about" },
  { label: "КОНТАКТЫ", to: "/contacts" },
]

const socials = ["telegram", "vk", "youtube", "instagram"]
</script>

<template>
  <footer class="px-6 pt-10 pb-8 font-heading">
    <div class="text-[1.125rem] font-bold text-neutral-900 mb-1 tracking-[-0.01rem]">
      SakhaGames
    </div>
    <div class="font-serif-classic text-[0.875rem] text-neutral-600 italic mb-7">
      Archive of the Arctic Spirit
    </div>

    <div class="grid gap-3.5 pt-6 mb-7 border-t border-neutral-300 text-[0.75rem] tracking-[0.14rem] font-semibold uppercase">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="[transition:color_150ms_linear]"
        :class="route.path === link.to ? 'text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'"
      >
        {{ link.label }}
      </NuxtLink>
    </div>

    <div class="flex gap-5 mb-7">
      <UIcon
        v-for="social in socials"
        :key="social"
        :name="`i-simple-icons-${social}`"
        class="size-5 text-neutral-900 cursor-pointer [transition:opacity_150ms_linear] hover:opacity-60"
      />
    </div>

    <div class="pt-6 border-t border-neutral-300 grid gap-1">
      <div class="text-[0.6875rem] text-neutral-900 font-sans">
        © 2026 SakhaGames. Все права защищены.
      </div>
      <div class="text-[0.625rem] tracking-[0.14rem] text-neutral-600 font-semibold uppercase">
        ЯКУТСК · РЕСПУБЛИКА САХА
      </div>
    </div>
  </footer>
</template>
