<script setup lang="ts">
import type { Athlete } from "~/types/athlete"

const { getAthletes } = usePocketBase()

const PER_PAGE = 5
const currentPage = ref(1)
const search = ref("")
const debouncedSearch = ref("")

let debounceTimer: ReturnType<typeof setTimeout>
watch(search, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedSearch.value = val
    currentPage.value = 1
  }, 300)
})

const { data, refresh } = await useAsyncData(
  "athletes-list",
  () => getAthletes(currentPage.value, PER_PAGE, debouncedSearch.value),
  { default: () => ({ items: [] as Athlete[], totalItems: 0, totalPages: 1 }) },
)

watch([currentPage, debouncedSearch], () => refresh())

const athletes = computed(() => data.value?.items ?? [])
const totalItems = computed(() => data.value?.totalItems ?? 0)
const totalPages = computed(() => data.value?.totalPages ?? 1)
</script>

<template>
  <div class="bg-neutral-50 min-h-screen">
    <!-- Hero -->
    <section class="px-5 pt-10 pb-8">
      <p class="font-heading text-[0.5625rem] tracking-[0.2rem] font-semibold text-neutral-600 uppercase mb-6">
        Национальное достояние
      </p>
      <h1 class="text-6xl leading-[0.9] font-bold text-neutral-900 mb-7 mt-0">
        Герои<br>игр<br>Дыгына
      </h1>
      <p class="font-sans text-sm leading-relaxed text-neutral-900">
        Кураторский список спортсменов, проявивших невероятную силу духа и
        мастерства в традиционном многоборье Якутии.
      </p>
    </section>

    <!-- Filter Bar -->
    <div class="bg-neutral-200 p-5 grid gap-3.5">
      <UInput
        v-model="search"
        placeholder="Поиск по имени..."
        leading-icon="i-tabler-search"
        color="neutral"
        variant="none"
        size="md"
        fixed
        class="w-full bg-white"
        :ui="{
          leadingIcon: 'text-neutral-600',
          base: 'font-sans text-neutral-900 placeholder:text-neutral-500'
        }"
      />
      <!-- TODO: раскомментировать когда на бэке будет готова фильтрация по isActive -->
      <!--
      <div class="flex gap-1 overflow-x-auto">
        <UButton
          v-for="pill in pills"
          :key="pill.value"
          color="neutral"
          :variant="activeFilter === pill.value ? 'solid' : 'ghost'"
          class="font-heading text-[0.625rem] tracking-[0.14rem] font-semibold whitespace-nowrap"
          @click="activeFilter = pill.value"
        >
          {{ pill.label }}
          <span class="text-[0.5625rem] opacity-50 font-mono font-normal ml-1.5">{{ pill.count }}</span>
        </UButton>
      </div>
      -->
    </div>

    <!-- Athletes list -->
    <section class="px-5 py-7 grid gap-6">
      <AthleteCard
        v-for="athlete in athletes"
        :key="athlete.id"
        :athlete="athlete"
      />

      <!-- Empty state -->
      <div
        v-if="athletes.length === 0"
        class="py-20 text-center"
      >
        <p class="font-heading text-[0.6875rem] tracking-[0.2rem] font-semibold text-neutral-500 uppercase">
          Спортсмены не найдены
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
          item: 'font-mono text-[0.8125rem] min-w-9'
        }"
      />
      <div class="text-[0.6875rem] text-neutral-600 tracking-[0.02rem] font-sans">
        {{ athletes.length }} из {{ totalItems }} спортсменов
      </div>
    </div>
  </div>
</template>
