<script setup lang="ts">
import type { DygynGame } from "~/types/dygynGames"

const { dygynGames: gamesApi } = useApi()

const PER_PAGE = 6
const currentPage = ref(1)

const { data, refresh } = await useAsyncData(
  "dygyn-games-list",
  () => gamesApi.getList(currentPage.value, PER_PAGE),
  { default: () => ({ items: [] as DygynGame[], totalItems: 0, totalPages: 1 }) },
)

watch(currentPage, () => refresh())

const games = computed(() => data.value?.items ?? [])
const totalItems = computed(() => data.value?.totalItems ?? 0)
const totalPages = computed(() => data.value?.totalPages ?? 1)
</script>

<template>
  <div class="bg-neutral-50 min-h-screen">
    <!-- Hero -->
    <section class="px-5 pt-10 pb-8">
      <p class="font-heading text-[0.5625rem] tracking-[0.2rem] font-semibold text-neutral-600 uppercase mb-6">
        Исторический архив
      </p>
      <h1 class="text-6xl leading-[0.9] font-bold text-neutral-900 mb-7 mt-0">
        Игры<br>Дыгына
      </h1>
      <p class="font-sans text-sm leading-relaxed text-neutral-900">
        Документальный архив традиционных состязаний якутского народа.
        Сезоны, результаты, места проведения и связанные материалы.
      </p>
    </section>

    <!-- Games list -->
    <section class="px-5 py-7 grid grid-cols-2 gap-4">
      <GameCard
        v-for="game in games"
        :key="game.id"
        :game="game"
      />

      <!-- Empty state -->
      <div
        v-if="games.length === 0"
        class="col-span-2 py-20 text-center"
      >
        <p class="font-heading text-[0.6875rem] tracking-[0.2rem] font-semibold text-neutral-500 uppercase">
          Игры не найдены
        </p>
      </div>
    </section>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="px-6 py-8 flex flex-col items-center gap-5 font-heading"
    >
      <div class="text-[0.625rem] tracking-[0.2rem] font-semibold text-neutral-600 uppercase">
        СТРАНИЦА {{ currentPage }} ИЗ {{ totalPages }}
      </div>
      <UPagination
        v-model:page="currentPage"
        :total="totalItems"
        :items-per-page="PER_PAGE"
        color="neutral"
        variant="ghost"
        active-color="neutral"
        active-variant="solid"
        :show-edges="false"
        size="sm"
        :ui="{
          item: 'font-heading text-[0.8125rem] min-w-9'
        }"
      />
      <div class="text-[0.6875rem] text-neutral-600 tracking-[0.02rem] font-sans">
        {{ games.length }} из {{ totalItems }} игр
      </div>
    </div>
  </div>
</template>
