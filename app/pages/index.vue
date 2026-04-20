<template>
  <main class="bg-neutral-50 min-h-screen">
    <!-- Hero -->
    <section class="px-5 pt-12 pb-10">
      <p class="font-heading text-[0.625rem] tracking-[0.2rem] font-semibold text-neutral-600 uppercase mb-6">
        Республика Саха
      </p>
      <h1 class="text-5xl leading-[0.95] font-bold text-neutral-900 mb-6 mt-0">
        SakhaGames
      </h1>
      <p class="font-sans text-base leading-7 text-neutral-900">
        Архив спортсменов, игр и правил традиционного многоборья Якутии.
      </p>
      <div class="flex flex-wrap gap-3 mt-8">
        <UButton
          to="/athletes"
          color="neutral"
          trailing-icon="i-tabler-arrow-right"
        >
          Спортсмены
        </UButton>
        <UButton
          to="/about"
          color="neutral"
          variant="ghost"
        >
          О проекте
        </UButton>
      </div>
    </section>

    <!-- Sections -->
    <section class="bg-neutral-200 px-5 py-10 grid gap-4">
      <UPageCard
        v-for="item in sections"
        :key="item.to"
        :to="item.to"
        :icon="item.icon"
        :title="item.title"
        :description="item.description"
        variant="soft"
        :ui="{
          root: 'bg-white',
          leadingIcon: 'text-neutral-900',
          title: 'font-heading font-bold text-neutral-900',
          description: 'font-sans text-neutral-900'
        }"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
const sections = [
  {
    title: "Спортсмены",
    description: "Профили участников и ветеранов традиционного многоборья.",
    icon: "i-tabler-users",
    to: "/athletes",
  },
  {
    title: "Архив игр",
    description: "Сезоны, результаты и места проведения Игр Дыгына.",
    icon: "i-tabler-trophy",
    to: "/games",
  },
  {
    title: "Правила",
    description: "Описание дисциплин и регламентов соревнований.",
    icon: "i-tabler-book",
    to: "/rules",
  },
]
</script>
