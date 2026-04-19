<script setup lang="ts">
const navItems = [
  [
    { label: "Спортсмены", to: "/athletes", icon: "i-tabler-users" },
    { label: "Архив игр", to: "/games", icon: "i-tabler-trophy" },
    { label: "Правила", to: "/rules", icon: "i-tabler-book" },
    { label: "О проекте", to: "/about", icon: "i-tabler-info-circle" },
  ],
]
</script>

<template>
  <UHeader>
    <template #title>
      <span class="font-heading">SakhaGames</span>
    </template>

    <template #body>
      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
        class="w-full"
        :ui="{
          link: 'text-lg p-3 w-full font-heading',
          linkLeadingIcon: 'size-5'
        }"
      />
    </template>
  </UHeader>
</template>
