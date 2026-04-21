<script setup lang="ts">
import type { Athlete } from "~/types/athlete"

const props = defineProps<{ athlete: Athlete }>()

const fileUrl = usePocketBaseFile()

const photoUrl = computed(() =>
  fileUrl("athletes", props.athlete.id, props.athlete.photo),
)

const achievements = computed(() => props.athlete.achievements?.slice(0, 2) ?? [])
</script>

<template>
  <div class="bg-neutral-50 flex flex-col">
    <!-- Photo -->
    <div class="relative">
      <div class="aspect-[1] flex overflow-hidden bg-neutral-800">
        <img
          v-if="props.athlete.photo"
          :src="photoUrl"
          :alt="props.athlete.name"
          loading="lazy"
          class="w-full h-full object-cover"
        >
        <div
          v-else
          class="w-full h-full grid place-items-center text-white/50"
        >
          <UIcon
            name="i-tabler-user"
            class="size-24"
          />
        </div>
        <div class="absolute flex right-1 bottom-1">
          <span class="font-mono text-[0.65rem] tracking-[0.075rem] text-white/35 uppercase">[ портрет ]</span>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="p-5">
      <AthleteStatusBadge
        :is-active="props.athlete.isActive"
        class="mb-2.5"
      />
      <h3 class="font-serif-classic text-2xl leading-[1.05] tracking-[-0.01rem] font-bold text-neutral-900 mb-3.5 mt-0">
        {{ props.athlete.name }}
      </h3>
      <ul
        v-if="achievements.length"
        class="m-0 p-0 grid gap-1.5 list-none"
      >
        <li
          v-for="(item, i) in achievements"
          :key="i"
          class="font-sans text-[0.8125rem] text-neutral-900 leading-[1.45] flex gap-2 items-start"
        >
          <UIcon
            :name="item.icon"
            class="size-3.5 mt-[0.1rem] shrink-0"
          />
          <span>{{ item.text }}</span>
        </li>
      </ul>
    </div>

    <!-- CTA -->
    <UButton
      :to="`/athletes/${props.athlete.slug}`"
      color="neutral"
      variant="solid"
      block
      class="font-heading text-[0.6875rem] tracking-[0.18rem] uppercase"
      :ui="{ base: 'justify-between px-5 py-[1.125rem]' }"
    >
      <span>В ПРОФИЛЬ</span>
      <UIcon name="i-tabler-arrow-narrow-right" />
    </UButton>
  </div>
</template>
