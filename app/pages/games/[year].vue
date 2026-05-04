<script setup lang="ts">
import type {
  DygynGameStatus,
  DygynEventStatus,
  DygynResultStatus,
  DygynGamePageResponse,
  LocalizedDygynResult,
  LocalizedDygynParticipant,
} from "~/types/dygynGames"

const route = useRoute()
const { dygynGames: gamesApi } = useApi()

const year = computed(() => Number(route.params.year))

const { data: pageData } = await useAsyncData<DygynGamePageResponse>(
  () => `dygyn-game-page-${route.params.year}`,
  () => gamesApi.getGamePage(year.value),
)

useSeoMeta({ title: () => pageData.value?.game.title ?? "" })

const coverUrl = computed(() => pageData.value?.game?.cover ?? "")

const coverLoaded = ref(false)
const onCoverLoad = () => {
  coverLoaded.value = true
}

const coverPlaceholderBg = computed(() => {
  const y = year.value % 100
  const angle = (y * 7) % 360
  const x1 = 30 + (y % 40)
  const y1 = 20 + (y % 30)
  const x2 = 70 - (y % 30)
  const y2 = 80 - (y % 20)
  return [
    `radial-gradient(ellipse at ${x1}% ${y1}%, #2F2F2F 0%, transparent 50%)`,
    `radial-gradient(ellipse at ${x2}% ${y2}%, #0F0F0F 0%, transparent 60%)`,
    `linear-gradient(${angle}deg, #0F0F0F 0%, #1F1F1F 60%, #2F2F2F 100%)`,
  ].join(", ")
})

const statusLabel: Record<DygynGameStatus, string> = {
  completed: "Завершено",
  planned: "Планируется",
  cancelled: "Отменено",
  archived: "Архив",
}

const statusColor: Record<DygynGameStatus, string> = {
  completed: "text-green-400",
  planned: "text-blue-400",
  cancelled: "text-red-400",
  archived: "text-neutral-500",
}

const eventStatusLabel: Record<DygynEventStatus, string> = {
  completed: "Завершено",
  planned: "Планируется",
  cancelled: "Отменено",
  demo: "Демо",
}

const eventStatusColor: Record<DygynEventStatus, string> = {
  completed: "text-green-400",
  planned: "text-blue-400",
  cancelled: "text-red-400",
  demo: "text-yellow-400",
}

const resultStatusColor: Record<DygynResultStatus, string> = {
  finished: "text-neutral-900",
  dns: "text-red-500",
  dnf: "text-red-500",
  dsq: "text-red-500",
}

const dateDisplay = computed(() => {
  const game = pageData.value?.game
  if (!game?.dateStart) return null
  if (!game.dateEnd) return `${year.value}`
  const end = new Date(game.dateEnd)
  const endYear = end.getFullYear()
  return endYear !== year.value ? `${year.value}–${endYear}` : `${year.value}`
})

const metaRows = computed(() => {
  const game = pageData.value?.game
  if (!game) return []
  return [
    { label: "Год", value: dateDisplay.value },
    { label: "Место", value: game.location },
    { label: "Арена", value: game.venue },
  ].filter(r => r.value)
})

const participantsById = computed(() => {
  const map = new Map<string, LocalizedDygynParticipant>()
  for (const p of pageData.value?.participants ?? []) {
    map.set(p.id, p)
  }
  return map
})

const eventsWithResults = computed(() => {
  const byEvent = new Map<string, LocalizedDygynResult[]>()
  for (const r of pageData.value?.results ?? []) {
    const arr = byEvent.get(r.event) ?? []
    arr.push(r)
    byEvent.set(r.event, arr)
  }
  return pageData.value?.events.map(event => ({
    event,
    results: byEvent.get(event.id) ?? [],
  })) ?? []
})

const allParticipantsSorted = computed(() =>
  [...(pageData.value?.participants ?? [])]
    .filter(p => p.finalRank)
    .sort((a, b) => (a.finalRank ?? 99) - (b.finalRank ?? 99)),
)

const activeEventId = ref("")

watchEffect(() => {
  const first = eventsWithResults.value[0]
  if (first && !activeEventId.value) {
    activeEventId.value = first.event.id
  }
})

const activeEventData = computed(() =>
  eventsWithResults.value.find(ewr => ewr.event.id === activeEventId.value),
)

const getAthleteName = (result: LocalizedDygynResult) => {
  const participant = participantsById.value.get(result.participant)
  return participant?.expand?.athlete?.name ?? result.resultLabel ?? "—"
}

const getTeam = (result: LocalizedDygynResult) =>
  participantsById.value.get(result.participant)?.team
</script>

<template>
  <div class="bg-neutral-50 min-h-screen">
    <!-- Back navigation -->
    <div class="px-5 pt-6 pb-5 page-enter">
      <UButton
        to="/games"
        color="neutral"
        variant="ghost"
        leading-icon="i-tabler-arrow-narrow-left"
        class="back-btn font-heading text-[0.625rem] tracking-[0.18rem] uppercase -ml-2"
      >
        Все игры
      </UButton>
    </div>

    <!-- Hero cover -->
    <div
      class="relative aspect-[4/3] overflow-hidden hero-cover"
      :style="!coverUrl ? { background: coverPlaceholderBg } : {}"
    >
      <div
        v-if="!coverUrl"
        class="absolute inset-0 pointer-events-none"
        style="background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 0.1875rem 0.1875rem; mix-blend-mode: overlay"
      />
      <img
        v-if="coverUrl"
        :src="coverUrl"
        :alt="pageData?.game.title"
        fetchpriority="high"
        class="cover-img w-full h-full object-cover"
        :class="coverLoaded ? 'cover-img--loaded' : ''"
        @load="onCoverLoad"
      >
      <!-- Overlay with title -->
      <div class="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-16 bg-linear-to-t from-primary-500 via-primary-500/80 to-transparent">
        <span
          v-if="pageData?.game"
          :class="['font-heading text-[0.5rem] tracking-[0.18rem] font-semibold uppercase mb-3 block', statusColor[pageData.game.status]]"
        >
          {{ statusLabel[pageData.game.status] }}
        </span>
        <h1 class="page-title font-serif-classic text-[2.75rem] leading-[1.0] tracking-[-0.02em] font-bold text-white mb-0 mt-0">
          {{ pageData?.game.title }}
        </h1>
      </div>
    </div>

    <!-- Meta rows -->
    <div
      v-if="metaRows.length"
      class="meta-section"
    >
      <div
        v-for="(row, i) in metaRows"
        :key="i"
        class="px-5 py-4 flex justify-between items-baseline gap-4"
        :class="i % 2 === 0 ? 'bg-neutral-50' : 'bg-neutral-200'"
      >
        <span class="font-heading text-[0.5rem] tracking-[0.18rem] font-semibold text-neutral-500 uppercase shrink-0">
          {{ row.label }}
        </span>
        <span class="font-serif-classic text-[0.9375rem] font-bold text-neutral-900 text-right">
          {{ row.value }}
        </span>
      </div>
    </div>

    <!-- Summary -->
    <section
      v-if="pageData?.game.summary"
      class="bg-neutral-200 px-5 py-8 summary-section"
    >
      <p class="font-heading text-[0.5rem] tracking-[0.22rem] font-semibold text-neutral-500 uppercase mb-5">
        Сводка
      </p>
      <p class="font-sans text-[0.9375rem] leading-[1.8] text-neutral-900">
        {{ pageData.game.summary }}
      </p>
    </section>

    <!-- Standings -->
    <section
      v-if="allParticipantsSorted.length"
      class="py-8 standings-section"
    >
      <p class="font-heading text-[0.5rem] tracking-[0.22rem] font-semibold text-neutral-500 uppercase px-5 mb-0 pb-5">
        Итоговая таблица
      </p>
      <div>
        <div
          v-for="(participant, i) in allParticipantsSorted"
          :key="participant.id"
          class="flex items-center gap-4 px-5 py-3"
          :class="i % 2 === 0 ? 'bg-neutral-50' : 'bg-neutral-100'"
        >
          <div class="w-10 shrink-0 flex flex-col items-center gap-0.5">
            <span
              class="font-serif-classic font-bold leading-none text-center"
              :class="
                participant.finalRank === 1 ? 'text-yellow-500 text-[2.25rem]'
                : participant.finalRank !== null && participant.finalRank <= 3 ? 'text-neutral-700 text-[1.875rem]'
                  : 'text-neutral-400 text-[1.5rem]'
              "
            >
              {{ participant.finalRank }}
            </span>
            <span
              v-if="participant.totalPoints"
              class="font-heading text-[0.4375rem] tracking-[0.04rem] text-neutral-400 whitespace-nowrap leading-none"
            >
              {{ participant.totalPoints }} оч.
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-serif-classic text-[1rem] font-bold text-neutral-900 truncate mb-0 leading-snug">
              {{ participant.expand?.athlete?.name ?? "—" }}
            </p>
            <p
              v-if="participant.team"
              class="font-heading text-[0.5rem] tracking-[0.1rem] text-neutral-500 uppercase truncate mb-0 mt-0.5"
            >
              {{ participant.team }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Disciplines -->
    <section
      v-if="eventsWithResults.length"
      class="bg-neutral-100 pb-8 disciplines-section"
    >
      <p class="font-heading text-[0.5rem] tracking-[0.22rem] font-semibold text-neutral-500 uppercase px-5 pt-8 pb-6 mb-0">
        По дисциплинам
      </p>

      <!-- Tab strip -->
      <div class="discipline-tabs flex overflow-x-auto bg-neutral-900 snap-x">
        <button
          v-for="ewr in eventsWithResults"
          :key="ewr.event.id"
          type="button"
          class="tab-btn shrink-0 px-5 py-3.5 font-heading text-[0.5rem] tracking-[0.2rem] font-semibold uppercase whitespace-nowrap snap-start"
          :class="activeEventId === ewr.event.id ? 'text-white bg-neutral-700' : 'text-neutral-500'"
          @click="activeEventId = ewr.event.id"
        >
          {{ ewr.event.expand?.discipline?.name ?? ewr.event.title ?? "Событие" }}
        </button>
      </div>

      <template v-if="activeEventData">
        <!-- Event meta strip -->
        <div
          v-if="activeEventData.event.dateHeld || activeEventData.event.status"
          class="px-5 pt-5 pb-0 flex items-center justify-between gap-3"
        >
          <p
            v-if="activeEventData.event.dateHeld"
            class="font-heading text-[0.5rem] tracking-[0.14rem] text-neutral-500 uppercase mb-0"
          >
            {{ new Date(activeEventData.event.dateHeld).toLocaleDateString("ru-RU", { day: "numeric", month: "long" }) }}
          </p>
          <span
            v-if="activeEventData.event.status"
            :class="['font-heading text-[0.5rem] tracking-[0.14rem] font-semibold uppercase', eventStatusColor[activeEventData.event.status]]"
          >
            {{ eventStatusLabel[activeEventData.event.status] }}
          </span>
        </div>

        <!-- Results table -->
        <div
          v-if="activeEventData.results.length"
          class="px-5 pt-4 pb-6"
        >
          <div class="font-heading text-[0.4375rem] tracking-[0.14rem] font-semibold text-neutral-400 uppercase grid grid-cols-[2.75rem_1fr_3.5rem_2.5rem] gap-2 mb-3 pb-2 border-b border-neutral-200">
            <span class="text-right">М</span>
            <span>Участник</span>
            <span class="text-right">Результат</span>
            <span class="text-right">Оч.</span>
          </div>
          <div class="grid gap-3">
            <div
              v-for="result in activeEventData.results"
              :key="result.id"
              class="grid grid-cols-[2.75rem_1fr_3.5rem_2.5rem] gap-2 items-start"
            >
              <span
                class="font-serif-classic font-bold leading-none text-right pt-0.5"
                :class="result.place === 1 ? 'text-yellow-500 text-[1.5rem]' : result.place ? 'text-neutral-400 text-[1.25rem]' : 'text-neutral-300 text-[1.25rem]'"
              >
                {{ result.place ?? "—" }}
              </span>
              <div class="min-w-0">
                <p
                  class="font-sans text-[0.875rem] truncate mb-0 leading-tight"
                  :class="resultStatusColor[result.status ?? 'finished']"
                >
                  {{ getAthleteName(result) }}
                </p>
                <p
                  v-if="getTeam(result)"
                  class="font-sans text-[0.6875rem] text-neutral-500 truncate mb-0 mt-0.5"
                >
                  {{ getTeam(result) }}
                </p>
              </div>
              <span class="font-mono text-[0.75rem] text-neutral-600 text-right truncate pt-0.5">
                {{ result.resultValue ?? "—" }}
              </span>
              <span class="font-heading text-[0.625rem] tracking-[0.05rem] text-neutral-500 text-right pt-0.5">
                {{ result.points ?? "" }}
              </span>
            </div>
          </div>
        </div>
        <div
          v-else
          class="px-5 py-10 text-center"
        >
          <p class="font-heading text-[0.5rem] tracking-[0.18rem] text-neutral-500 uppercase">
            Результаты не опубликованы
          </p>
        </div>
      </template>
    </section>

    <!-- Historical note -->
    <section
      v-if="pageData?.game.historicalNote"
      class="bg-neutral-950 px-5 py-12 historical-section"
    >
      <p class="font-heading text-[0.5rem] tracking-[0.22rem] font-semibold text-neutral-600 uppercase mb-6">
        Историческая справка
      </p>
      <p class="font-sans text-[0.9375rem] leading-[1.8] text-neutral-300">
        {{ pageData.game.historicalNote }}
      </p>
    </section>

    <!-- Sources -->
    <section
      v-if="pageData?.game.sources?.length"
      class="bg-neutral-50 px-5 py-8 sources-section"
    >
      <p class="font-heading text-[0.5rem] tracking-[0.22rem] font-semibold text-neutral-500 uppercase mb-6">
        Источники
      </p>
      <ul class="m-0 p-0 list-none grid gap-4">
        <li
          v-for="(source, i) in pageData.game.sources"
          :key="i"
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
    </section>
  </div>
</template>

<style scoped>
/* ── Page entrance ─────────────────────────────────────── */
.page-enter {
  opacity: 0;
  animation: fadeUp 300ms cubic-bezier(0.23, 1, 0.32, 1) 50ms both;
}
.hero-cover {
  opacity: 0;
  animation: fadeIn 350ms cubic-bezier(0.23, 1, 0.32, 1) 80ms both;
}
.page-title {
  opacity: 0;
  animation: fadeUp 350ms cubic-bezier(0.23, 1, 0.32, 1) 200ms both;
}
.meta-section {
  opacity: 0;
  animation: fadeUp 300ms cubic-bezier(0.23, 1, 0.32, 1) 250ms both;
}
.summary-section {
  opacity: 0;
  animation: fadeUp 300ms cubic-bezier(0.23, 1, 0.32, 1) 290ms both;
}
.standings-section {
  opacity: 0;
  animation: fadeUp 300ms cubic-bezier(0.23, 1, 0.32, 1) 330ms both;
}
.disciplines-section {
  opacity: 0;
  animation: fadeUp 300ms cubic-bezier(0.23, 1, 0.32, 1) 360ms both;
}
.historical-section {
  opacity: 0;
  animation: fadeUp 300ms cubic-bezier(0.23, 1, 0.32, 1) 390ms both;
}
.sources-section {
  opacity: 0;
  animation: fadeUp 300ms cubic-bezier(0.23, 1, 0.32, 1) 410ms both;
}

/* ── Cover fade-in on load ────────────────────────────── */
.cover-img {
  opacity: 0;
  transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
}
.cover-img--loaded {
  opacity: 1;
}

/* ── Tab press feedback ───────────────────────────────── */
.tab-btn {
  transition: background-color 150ms ease, color 150ms ease;
}
.tab-btn:active {
  transform: scale(0.97);
  opacity: 0.75;
}

/* ── Back button press ────────────────────────────────── */
.back-btn:active {
  transform: scale(0.97);
  opacity: 0.6;
}

/* ── Discipline tabs scrollbar hide ──────────────────── */
.discipline-tabs {
  scrollbar-width: none;
}
.discipline-tabs::-webkit-scrollbar {
  display: none;
}

/* ── Keyframes ────────────────────────────────────────── */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ── Reduced motion ───────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .page-enter,
  .hero-cover,
  .page-title,
  .meta-section,
  .summary-section,
  .standings-section,
  .disciplines-section,
  .historical-section,
  .sources-section {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .cover-img {
    opacity: 1;
    transition: none;
  }
}
</style>
