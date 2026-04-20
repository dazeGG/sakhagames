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
    <section class="bg-neutral-200">
      <NuxtLink
        v-for="(item, i) in sections"
        :key="item.to"
        :to="item.to"
        class="flex items-center justify-between gap-4 px-5 py-7"
        :class="i % 2 !== 0 ? 'bg-neutral-100' : ''"
      >
        <div>
          <h3 class="font-heading font-bold text-[1rem] tracking-[0.01rem] text-neutral-900 mb-1.5 mt-0">
            {{ item.title }}
          </h3>
          <p class="font-sans text-[0.8125rem] leading-[1.6] text-neutral-600 m-0">
            {{ item.description }}
          </p>
        </div>
        <UIcon
          name="i-tabler-arrow-narrow-right"
          class="size-4 text-neutral-400 shrink-0"
        />
      </NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
const sections = [
  {
    title: "Спортсмены",
    description: "Профили участников и ветеранов традиционного многоборья.",
    to: "/athletes",
  },
  {
    title: "Архив игр",
    description: "Сезоны, результаты и места проведения Игр Дыгына.",
    to: "/games",
  },
  {
    title: "Правила",
    description: "Описание дисциплин и регламентов соревнований.",
    to: "/rules",
  },
]
</script>
