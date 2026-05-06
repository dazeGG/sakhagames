<script setup lang="ts">
import type { Discipline, SourceItem } from "~/types/dygynGames"

const { disciplines: disciplinesApi } = useApi()

const { data } = await useAsyncData(
  "disciplines-list",
  () => disciplinesApi.getList(),
  { default: () => ({ items: [] as Discipline[], totalItems: 0 }) },
)

useSeoMeta({ title: "Правила и дисциплины" })

const disciplines = computed(() =>
  (data.value?.items ?? []).filter(d => d.is_active !== false),
)

const totalItems = computed(() => disciplines.value.length)

const sectionBg = (i: number) =>
  i % 3 === 0 ? "bg-neutral-50" : i % 3 === 1 ? "bg-neutral-100" : "bg-neutral-200"

const sourcesBg = (i: number) =>
  i % 3 === 0 ? "bg-neutral-100" : i % 3 === 1 ? "bg-neutral-200" : "bg-neutral-50"

const heroMeta = computed(() => {
  const n = totalItems.value
  if (!n) return "Регламенты"
  const mod10 = n % 10
  const mod100 = n % 100
  let word = "дисциплин"
  if (mod100 < 11 || mod100 > 14) {
    if (mod10 === 1) word = "дисциплина"
    else if (mod10 >= 2 && mod10 <= 4) word = "дисциплины"
  }
  return `Регламенты · ${n} ${word}`
})

const hasSources = (d: Discipline): d is Discipline & { sources: SourceItem[] } =>
  Array.isArray(d.sources) && d.sources.length > 0
</script>

<template>
  <div class="bg-neutral-50 min-h-screen">
    <!-- Hero -->
    <section class="px-5 pt-10 pb-10 bg-neutral-50">
      <p class="font-heading text-[0.5625rem] tracking-[0.2rem] font-semibold text-neutral-500 uppercase mb-6">
        {{ heroMeta }}
      </p>
      <h1 class="font-serif-classic text-[4rem] leading-[0.9] tracking-[-0.03em] font-bold text-neutral-900 mb-6 mt-0">
        Правила
      </h1>
      <p class="font-sans text-[0.9375rem] leading-[1.75] text-neutral-700">
        Описание дисциплин, правил выполнения упражнений и систем оценивания
        традиционного якутского многоборья Игр Дыгына.
      </p>
    </section>

    <!-- Disciplines -->
    <template v-if="disciplines.length">
      <section
        v-for="(discipline, i) in disciplines"
        :key="discipline.id"
        :class="sectionBg(i)"
      >
        <!-- Discipline header -->
        <div class="px-5 pt-10 pb-6">
          <p class="font-heading text-[0.5rem] tracking-[0.22rem] font-semibold text-neutral-400 uppercase mb-4">
            {{ String(i + 1).padStart(2, "0") }}
          </p>
          <h2 class="font-serif-classic text-[2.5rem] leading-[0.92] tracking-[-0.025em] font-bold text-neutral-900 mb-0 mt-0 uppercase">
            {{ discipline.name }}
          </h2>
          <p
            v-if="discipline.unit"
            class="font-heading text-[0.5rem] tracking-[0.2rem] font-semibold text-neutral-400 uppercase mt-3 mb-0"
          >
            Единица · {{ discipline.unit }}
          </p>
        </div>

        <!-- Description -->
        <div
          v-if="discipline.description"
          class="px-5 pb-8"
        >
          <p class="font-serif-classic text-[1.0625rem] italic leading-[1.6] text-neutral-700 mt-0 mb-0">
            {{ discipline.description }}
          </p>
        </div>

        <!-- Rules -->
        <div
          v-if="discipline.rules"
          class="px-5 pb-8"
        >
          <p class="font-heading text-[0.5rem] tracking-[0.22rem] font-semibold text-neutral-500 uppercase mb-4">
            Правила
          </p>
          <p class="font-sans text-[0.9375rem] leading-[1.8] text-neutral-900 mb-0">
            {{ discipline.rules }}
          </p>
        </div>

        <!-- Scoring -->
        <div
          v-if="discipline.scoring"
          class="px-5 pb-8"
        >
          <p class="font-heading text-[0.5rem] tracking-[0.22rem] font-semibold text-neutral-500 uppercase mb-4">
            Оценка
          </p>
          <p class="font-sans text-[0.9375rem] leading-[1.8] text-neutral-900 mb-0">
            {{ discipline.scoring }}
          </p>
        </div>

        <!-- Change note -->
        <div
          v-if="discipline.changeNote"
          class="px-5 pb-8"
        >
          <p class="font-heading text-[0.5rem] tracking-[0.22rem] font-semibold text-neutral-400 uppercase mb-4">
            Примечание
          </p>
          <p class="font-sans text-[0.875rem] leading-[1.7] text-neutral-600 mb-0">
            {{ discipline.changeNote }}
          </p>
        </div>

        <!-- Sources -->
        <div
          v-if="hasSources(discipline)"
          :class="['px-5 pt-6 pb-8', sourcesBg(i)]"
        >
          <p class="font-heading text-[0.5rem] tracking-[0.22rem] font-semibold text-neutral-500 uppercase mb-5">
            Источники
          </p>
          <ul class="m-0 p-0 list-none grid gap-4">
            <li
              v-for="(source, si) in discipline.sources"
              :key="si"
              class="flex gap-3 items-start"
            >
              <UIcon
                name="i-tabler-link"
                class="size-[0.875rem] mt-[0.2rem] shrink-0 text-neutral-400"
              />
              <div class="flex-1 min-w-0">
                <a
                  v-if="source.url"
                  :href="source.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-sans text-[0.875rem] text-neutral-900 underline underline-offset-[3px] decoration-neutral-300"
                >
                  {{ source.title }}
                </a>
                <span
                  v-else
                  class="font-sans text-[0.875rem] text-neutral-900"
                >
                  {{ source.title }}
                </span>
                <p
                  v-if="source.note"
                  class="font-sans text-[0.75rem] text-neutral-500 mt-1 mb-0"
                >
                  {{ source.note }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </template>

    <!-- Empty state -->
    <div
      v-else
      class="px-5 py-20"
    >
      <p class="font-heading text-[0.6875rem] tracking-[0.2rem] font-semibold text-neutral-400 uppercase">
        Дисциплины не найдены
      </p>
    </div>
  </div>
</template>
