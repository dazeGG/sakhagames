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
const fileUrl = usePocketBaseFile()

const year = computed(() => Number(route.params.year))

const { data: pageData } = await useAsyncData<DygynGamePageResponse>(
  `dygyn-game-page-${year.value}`,
  () => gamesApi.getGamePage(year.value),
)

useSeoMeta({ title: () => pageData.value?.game.title ?? "" })

const coverUrl = computed(() => {
  const game = pageData.value?.game
  if (!game?.cover) return ""
  return fileUrl("dygyn_games", game.id, game.cover)
})

const statusLabel: Record<DygynGameStatus, string> = {
  completed: "Завершено",
  planned: "Планируется",
  cancelled: "Отменено",
  archived: "Архив",
}

const statusColor: Record<DygynGameStatus, string> = {
  completed: "text-green-500",
  planned: "text-blue-500",
  cancelled: "text-red-500",
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
  dns: "text-red-600",
  dnf: "text-red-600",
  dsq: "text-red-600",
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

const topParticipants = computed(() => {
  return pageData.value?.participants
    .filter(p => p.finalRank && p.finalRank <= 3)
    .sort((a, b) => (a.finalRank ?? 99) - (b.finalRank ?? 99))
    ?? []
})

const formatPoints = (points: number | undefined) =>
  points !== undefined ? `${points}` : "—"

const getAthleteName = (result: LocalizedDygynResult) => {
  const participant = participantsById.value.get(result.participant)
  return participant?.expand?.athlete?.name ?? result.resultLabel ?? "—"
}

const getTeam = (result: LocalizedDygynResult) =>
  participantsById.value.get(result.participant)?.team
</script>

<template>
  <div class="bg-neutral-50 min-h-screen">
    <div class="px-5 pt-6 pb-5">
      <UButton
        to="/games"
        color="neutral"
        variant="ghost"
        leading-icon="i-tabler-arrow-narrow-left"
        class="font-heading text-[0.625rem] tracking-[0.18rem] uppercase -ml-2"
      >
        Все игры
      </UButton>
    </div>

    <div class="relative bg-neutral-800 aspect-[4/3] overflow-hidden">
      <img
        v-if="coverUrl"
        :src="coverUrl"
        :alt="pageData?.game.title"
        fetchpriority="high"
        class="w-full h-full object-cover"
      >
      <div
        v-else
        class="w-full h-full grid place-items-center text-white/30"
      >
        <UIcon
          name="i-tabler-trophy"
          class="size-32"
        />
      </div>
      <div class="absolute bottom-0 left-0 right-0 px-5 py-5 bg-linear-to-t from-primary-500 via-primary-500/75 to-transparent">
        <span
          v-if="pageData?.game"
          :class="['font-heading text-[0.5625rem] tracking-[0.15rem] font-semibold uppercase mb-2 block', statusColor[pageData.game.status]]"
        >
          {{ statusLabel[pageData.game.status] }}
        </span>
        <h1 class="text-4xl leading-[1.05] font-bold text-white mb-0 mt-0">
          {{ pageData?.game.title }}
        </h1>
      </div>
    </div>

    <div
      v-if="metaRows.length"
      class="bg-neutral-50"
    >
      <div
        v-for="(row, i) in metaRows"
        :key="i"
        class="px-5 py-4 flex justify-between items-baseline gap-4"
        :class="i % 2 === 0 ? 'bg-neutral-50' : 'bg-neutral-200'"
      >
        <span class="font-heading text-[0.5625rem] tracking-[0.15rem] font-semibold text-neutral-500 uppercase shrink-0">
          {{ row.label }}
        </span>
        <span class="font-sans text-[0.875rem] text-neutral-900 text-right">
          {{ row.value }}
        </span>
      </div>
    </div>

    <section
      v-if="pageData?.game.summary"
      class="bg-neutral-200 px-5 py-8"
    >
      <p class="font-heading text-[0.625rem] tracking-[0.2rem] font-semibold text-neutral-500 uppercase mb-5">
        Сводка
      </p>
      <p class="font-sans text-[0.9375rem] leading-[1.75] text-neutral-900">
        {{ pageData.game.summary }}
      </p>
    </section>

    <section
      v-if="topParticipants.length"
      class="bg-neutral-50 px-5 py-8"
    >
      <p class="font-heading text-[0.625rem] tracking-[0.2rem] font-semibold text-neutral-500 uppercase mb-6">
        Победители
      </p>
      <div class="grid gap-3">
        <div
          v-for="participant in topParticipants"
          :key="participant.id"
          :class="participant.finalRank === 1 ? 'flex items-center gap-4 bg-yellow-100 px-4 py-4' : 'flex items-center gap-4 bg-neutral-100 px-4 py-3'"
        >
          <span
            class="font-serif-classic text-3xl font-bold w-8 text-center shrink-0 leading-none"
            :class="participant.finalRank === 1 ? 'text-yellow-600' : 'text-neutral-500'"
          >
            {{ participant.finalRank }}
          </span>
          <div class="flex-1 min-w-0">
            <p class="font-serif-classic text-lg font-bold text-neutral-900 leading-tight mb-0 truncate">
              {{ participant.expand?.athlete?.name ?? "—" }}
            </p>
            <p
              v-if="participant.team"
              class="font-sans text-[0.75rem] text-neutral-600 truncate mb-0"
            >
              {{ participant.team }}
            </p>
          </div>
          <span class="font-heading text-[0.5625rem] tracking-[0.1rem] text-neutral-500 uppercase shrink-0">
            {{ formatPoints(participant.totalPoints) }} очк.
          </span>
        </div>
      </div>
    </section>

    <section class="px-5 py-8">
      <p class="font-heading text-[0.625rem] tracking-[0.2rem] font-semibold text-neutral-500 uppercase mb-6">
        Протокол результатов
      </p>
      <div
        v-if="eventsWithResults.length"
        class="grid gap-8"
      >
        <div
          v-for="{ event, results } in eventsWithResults"
          :key="event.id"
          class="bg-neutral-100"
        >
          <div class="bg-neutral-900 px-4 py-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="font-serif-classic text-lg font-bold text-white mb-0 leading-tight">
                  {{ event.expand?.discipline?.name ?? event.title ?? "Дисциплина" }}
                </p>
                <p
                  v-if="event.dateHeld"
                  class="font-sans text-[0.6875rem] text-neutral-400 mt-0.5 mb-0"
                >
                  {{ new Date(event.dateHeld).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) }}
                </p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span
                  v-if="event.status"
                  :class="['font-heading text-[0.5rem] tracking-[0.15rem] font-semibold uppercase', eventStatusColor[event.status]]"
                >
                  {{ eventStatusLabel[event.status] }}
                </span>
                <span class="font-heading text-[0.5625rem] text-neutral-500">
                  {{ results.length }} уч.
                </span>
              </div>
            </div>
          </div>

          <div
            v-if="results.length"
            class="px-4 pt-4 pb-5"
          >
            <div class="font-heading text-[0.5rem] tracking-[0.15rem] font-semibold text-neutral-500 uppercase grid grid-cols-[2.5rem_1fr_3.5rem_3.5rem] gap-3 mb-3">
              <span>М</span>
              <span>Участник</span>
              <span class="text-right">Результат</span>
              <span class="text-right">Очки</span>
            </div>
            <div class="grid gap-2">
              <div
                v-for="result in results"
                :key="result.id"
                class="grid grid-cols-[2.5rem_1fr_3.5rem_3.5rem] gap-3 items-baseline"
              >
                <span
                  class="font-serif-classic text-2xl font-bold leading-none text-right"
                  :class="result.place === 1 ? 'text-yellow-600' : result.place ? 'text-neutral-400' : 'text-neutral-300'"
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
                    class="font-sans text-[0.6875rem] text-neutral-500 truncate mb-0"
                  >
                    {{ getTeam(result) }}
                  </p>
                </div>
                <span class="font-mono text-[0.8125rem] text-neutral-600 text-right truncate">
                  {{ result.resultValue ?? "—" }}
                </span>
                <span class="font-heading text-[0.6875rem] tracking-[0.05rem] text-neutral-500 text-right">
                  {{ result.points ?? "" }}
                </span>
              </div>
            </div>
          </div>
          <div
            v-else
            class="px-4 py-8 text-center"
          >
            <p class="font-heading text-[0.5625rem] tracking-[0.15rem] text-neutral-500 uppercase">
              Результаты не опубликованы
            </p>
          </div>
        </div>
      </div>
      <p
        v-else
        class="font-heading text-[0.625rem] tracking-[0.15rem] text-neutral-500 uppercase"
      >
        События не найдены
      </p>
    </section>

    <section
      v-if="pageData?.game.historicalNote"
      class="bg-neutral-950 px-5 py-10"
    >
      <p class="font-heading text-[0.625rem] tracking-[0.2rem] font-semibold text-neutral-600 uppercase mb-5">
        Историческая справка
      </p>
      <p class="font-sans text-[0.9375rem] leading-[1.75] text-neutral-300">
        {{ pageData.game.historicalNote }}
      </p>
    </section>

    <section
      v-if="pageData?.game.sources?.length"
      class="bg-neutral-50 px-5 py-8"
    >
      <p class="font-heading text-[0.625rem] tracking-[0.2rem] font-semibold text-neutral-500 uppercase mb-5">
        Источники
      </p>
      <ul class="m-0 p-0 list-none grid gap-3">
        <li
          v-for="(source, i) in pageData.game.sources"
          :key="i"
          class="flex gap-3 items-start"
        >
          <UIcon
            name="i-tabler-link"
            class="size-4 mt-[0.15rem] shrink-0 text-neutral-500"
          />
          <div class="flex-1 min-w-0">
            <a
              v-if="source.url"
              :href="source.url"
              target="_blank"
              rel="noopener noreferrer"
              class="font-sans text-[0.875rem] text-neutral-900 underline underline-offset-2"
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
              class="font-sans text-[0.75rem] text-neutral-600 mt-1 mb-0"
            >
              {{ source.note }}
            </p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
