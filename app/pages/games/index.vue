<script setup lang="ts">
import type { DygynGame, DygynGameStatus } from "~/types/dygynGames"

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

const scrollY = ref(0)

const onScroll = () => {
  scrollY.value = window.scrollY
}
onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener("scroll", onScroll))

const heroParallaxStyle = computed(() => ({
  transform: `translateY(${scrollY.value * 0.4}px) scale(${1 + scrollY.value * 0.0003})`,
}))

const gameNumber = (index: number) =>
  totalItems.value - ((currentPage.value - 1) * PER_PAGE + index)

const minYear = computed(() =>
  games.value.length ? Math.min(...games.value.map(g => g.year)) : null,
)
const maxYear = computed(() =>
  games.value.length ? Math.max(...games.value.map(g => g.year)) : null,
)

const heroMeta = computed(() => {
  if (!minYear.value || !maxYear.value) return "АРХИВ · ИГРЫ ДЫГЫНА"
  const yearsStr = minYear.value === maxYear.value
    ? String(minYear.value)
    : `${minYear.value}–${maxYear.value}`
  const n = totalItems.value
  const mod10 = n % 10
  const mod100 = n % 100
  let word = "ИГР"
  if (mod100 < 11 || mod100 > 14) {
    if (mod10 === 1) word = "ИГРА"
    else if (mod10 >= 2 && mod10 <= 4) word = "ИГРЫ"
  }
  return `АРХИВ · ${yearsStr} · ${n} ${word}`
})

const getCoverUrl = (game: DygynGame) => game.cover ?? ""

const statusLabel: Record<DygynGameStatus, string> = {
  completed: "Завершено",
  planned: "Планируется",
  cancelled: "Отменено",
  archived: "Архив",
}

const formatDateRange = (game: DygynGame) => {
  if (!game.dateStart) return null
  const start = new Date(game.dateStart)
  if (!game.dateEnd) {
    return start.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
  }
  const end = new Date(game.dateEnd)
  const startStr = start.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
  const endStr = end.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
  return `${startStr} – ${endStr}`
}

const tonalBg = (year: number) => {
  const h = year % 100
  const angle = (h * 7) % 360
  const x1 = 30 + (h % 40)
  const y1 = 20 + (h % 30)
  const x2 = 70 - (h % 30)
  const y2 = 80 - (h % 20)
  return [
    `radial-gradient(ellipse at ${x1}% ${y1}%, #2F2F2F 0%, transparent 50%)`,
    `radial-gradient(ellipse at ${x2}% ${y2}%, #0F0F0F 0%, transparent 60%)`,
    `linear-gradient(${angle}deg, #0F0F0F 0%, #1F1F1F 60%, #2F2F2F 100%)`,
  ].join(", ")
}

const loadedImages = ref(new Set<string>())
const onImageLoad = (id: string) => {
  loadedImages.value = new Set([...loadedImages.value, id])
}
</script>

<template>
  <div class="bg-neutral-50 min-h-screen">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-neutral-950 h-[33.75rem]">
      <div
        class="absolute inset-0"
        :style="heroParallaxStyle"
      >
        <div
          class="w-full h-full"
          style="background: radial-gradient(ellipse at 35% 25%, #2F2F2F 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #0F0F0F 0%, transparent 60%), linear-gradient(137deg, #0F0F0F 0%, #1F1F1F 60%, #2F2F2F 100%)"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 to-black/85" />

      <div class="absolute inset-0 flex flex-col justify-end px-6 pb-10">
        <p class="hero-meta font-heading text-[0.5rem] tracking-[0.22rem] font-semibold text-white/60 uppercase mb-4">
          {{ heroMeta }}
        </p>
        <h1 class="hero-title font-serif-classic text-[4.5rem] leading-[0.88] tracking-[-0.04em] font-bold text-white mb-0 mt-0">
          Игры<br>Дыгына
        </h1>
        <p class="hero-subtitle font-serif-classic text-[0.9375rem] italic leading-[1.55] text-white/75 mt-6 mb-0">
          Документальный архив традиционных состязаний якутского народа
        </p>
      </div>
    </section>

    <!-- Chronicle entries — re-keyed on page change to replay stagger -->
    <div
      v-if="games.length"
      :key="currentPage"
    >
      <article
        v-for="(game, i) in games"
        :key="game.id"
        class="game-article relative"
        :style="{ animationDelay: `${i * 70}ms` }"
      >
        <!-- Sticky year strip -->
        <div class="sticky top-[4rem] z-10 bg-neutral-200 px-6 py-5 flex justify-between items-baseline">
          <span class="font-serif-classic text-[3.5rem] font-bold leading-none tracking-[-0.04em] text-neutral-900">
            {{ game.year }}
          </span>
          <span
            class="font-heading text-[0.5625rem] tracking-[0.22rem] font-semibold uppercase"
            :class="game.status === 'cancelled' ? 'text-neutral-500' : 'text-neutral-700'"
          >
            {{ game.status === 'cancelled' ? 'ОТМЕНЁН' : `ИГРЫ №${gameNumber(i)}` }}
          </span>
        </div>

        <!-- Card body -->
        <div class="bg-white px-6 pb-10">
          <!-- Cover / tonal placeholder -->
          <template v-if="getCoverUrl(game)">
            <div class="aspect-[4/3] overflow-hidden bg-neutral-800">
              <img
                :src="getCoverUrl(game)"
                :alt="game.title"
                loading="lazy"
                class="w-full h-full object-cover cover-img"
                :class="loadedImages.has(game.id) ? 'cover-img--loaded' : ''"
                @load="onImageLoad(game.id)"
              >
            </div>
          </template>
          <template v-else-if="game.status !== 'cancelled'">
            <div
              class="aspect-[4/3] relative overflow-hidden"
              :style="{ background: tonalBg(game.year) }"
            >
              <div
                class="absolute inset-0 pointer-events-none"
                style="background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 0.1875rem 0.1875rem; mix-blend-mode: overlay"
              />
            </div>
          </template>

          <!-- Meta — тональные ячейки без линий -->
          <div class="grid grid-cols-2 mt-6">
            <div class="px-4 py-4 bg-neutral-100">
              <p class="font-heading text-[0.5625rem] tracking-[0.2rem] font-semibold text-neutral-500 uppercase mb-1 mt-0">
                МЕСТО
              </p>
              <p class="font-serif-classic text-[1rem] font-bold text-neutral-900 leading-[1.2] mb-0 mt-0">
                {{ game.location ?? '—' }}
              </p>
            </div>
            <div class="px-4 py-4 bg-neutral-200">
              <p class="font-heading text-[0.5625rem] tracking-[0.2rem] font-semibold text-neutral-500 uppercase mb-1 mt-0">
                СТАТУС
              </p>
              <p class="font-serif-classic text-[1rem] font-bold text-neutral-900 leading-[1.2] mb-0 mt-0">
                {{ game.status ? statusLabel[game.status] : "" }}
              </p>
            </div>
            <div
              v-if="formatDateRange(game)"
              class="px-4 py-4 col-span-2 bg-neutral-50"
            >
              <p class="font-heading text-[0.5625rem] tracking-[0.2rem] font-semibold text-neutral-500 uppercase mb-1 mt-0">
                ДАТА
              </p>
              <p class="font-serif-classic text-[1rem] font-bold text-neutral-900 leading-[1.2] mb-0 mt-0">
                {{ formatDateRange(game) }}
              </p>
            </div>
          </div>

          <!-- Quote / summary -->
          <p
            v-if="game.summary"
            class="font-serif-classic text-[1.0625rem] italic leading-[1.5] text-neutral-700 mt-6 mb-0"
          >
            «{{ game.summary }}»
          </p>

          <!-- CTA -->
          <UButton
            v-if="game.status !== 'cancelled'"
            :to="`/games/${game.year}`"
            color="neutral"
            variant="solid"
            block
            class="cta-btn font-heading text-[0.6875rem] tracking-[0.18rem] uppercase mt-7"
            :ui="{ base: 'justify-between px-5 py-[1.125rem]' }"
          >
            <span>ПОДРОБНЕЕ</span>
            <span>→</span>
          </UButton>
        </div>
      </article>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="py-20 px-6"
    >
      <p class="font-heading text-[0.6875rem] tracking-[0.2rem] font-semibold text-neutral-500 uppercase">
        Игры не найдены
      </p>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="bg-neutral-200 px-6 py-10 flex flex-col items-center gap-5 font-heading"
    >
      <div class="text-[0.5625rem] tracking-[0.2rem] font-semibold text-neutral-600 uppercase">
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

<style scoped>
/* ── Hero staged entrance ───────────────────────────────── */
.hero-meta {
  opacity: 0;
  animation: fadeUp 500ms cubic-bezier(0.23, 1, 0.32, 1) 100ms both;
}
.hero-title {
  opacity: 0;
  animation: fadeUp 600ms cubic-bezier(0.23, 1, 0.32, 1) 220ms both;
}
.hero-subtitle {
  opacity: 0;
  animation: fadeUp 500ms cubic-bezier(0.23, 1, 0.32, 1) 380ms both;
}

/* ── Article stagger ────────────────────────────────────── */
.game-article {
  opacity: 0;
  animation: articleEnter 450ms cubic-bezier(0.23, 1, 0.32, 1) both;
}

/* ── Cover image fade-in on load ────────────────────────── */
.cover-img {
  opacity: 0;
  transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
}
.cover-img--loaded {
  opacity: 1;
}

/* ── CTA button press feedback ──────────────────────────── */
/* !important необходим: Nuxt UI добавляет transition на кнопку через свои стили */
.cta-btn {
  transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1) !important;
}
.cta-btn:active {
  transform: scale(0.97);
}

/* ── Keyframes ──────────────────────────────────────────── */
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

@keyframes articleEnter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Reduced motion ─────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .hero-meta,
  .hero-title,
  .hero-subtitle,
  .game-article {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .cover-img {
    opacity: 1;
    transition: none;
  }
  .cta-btn {
    transition: none !important;
  }
}
</style>
