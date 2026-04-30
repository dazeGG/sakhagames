<script setup lang="ts">
import type { DygynGame, DygynGameStatus } from "~/types/dygynGames"

const props = defineProps<{ game: DygynGame }>()

const fileUrl = usePocketBaseFile()

const coverUrl = computed(() =>
  props.game.cover ? fileUrl("dygyn_games", props.game.id, props.game.cover) : "",
)

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

const locationDisplay = computed(() => props.game.location ?? null)
</script>

<template>
  <div class="bg-neutral-50 flex flex-col">
    <div class="relative">
      <div class="aspect-[16/9] flex overflow-hidden bg-neutral-800">
        <img
          v-if="coverUrl"
          :src="coverUrl"
          :alt="game.title"
          loading="lazy"
          class="w-full h-full object-cover"
        >
        <div
          v-else
          class="w-full h-full grid place-items-center text-white/30"
        >
          <UIcon
            name="i-tabler-trophy"
            class="size-20"
          />
        </div>
      </div>
    </div>

    <div class="p-5">
      <div class="flex items-center justify-between mb-3">
        <span
          :class="['font-heading text-[0.5625rem] tracking-[0.15rem] font-semibold uppercase', statusColor[game.status]]"
        >
          {{ statusLabel[game.status] }}
        </span>
        <span class="font-heading text-[0.5625rem] tracking-[0.12rem] font-semibold text-neutral-500 uppercase">
          {{ game.year }}
        </span>
      </div>

      <h3 class="font-serif-classic text-2xl leading-[1.05] tracking-[-0.01rem] font-bold text-neutral-900 mb-2 mt-0">
        {{ game.title }}
      </h3>

      <p
        v-if="locationDisplay"
        class="font-sans text-[0.8125rem] text-neutral-600 leading-[1.4] mb-0"
      >
        {{ locationDisplay }}
      </p>
    </div>

    <UButton
      :to="`/games/${game.year}`"
      color="neutral"
      variant="solid"
      block
      class="font-heading text-[0.6875rem] tracking-[0.18rem] uppercase"
      :ui="{ base: 'justify-between px-5 py-[1.125rem]' }"
    >
      <span>Подробнее</span>
      <UIcon name="i-tabler-arrow-narrow-right" />
    </UButton>
  </div>
</template>
