<script setup lang="ts">
import type { Athlete } from "~/types/athlete"

const props = defineProps<{ athlete: Athlete }>()

const config = useRuntimeConfig()

const getPhotoUrl = (athlete: Athlete): string => {
  if (!athlete.photo) return ""
  return `${config.public.pocketbaseUrl}/api/files/athletes/${athlete.id}/${athlete.photo}`
}

const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text
  return `${text.slice(0, length)}…`
}
</script>

<template>
  <div class="bg-white flex flex-col">
    <!-- Photo -->
    <div class="relative">
      <div class="aspect-[1] flex overflow-hidden bg-neutral-800">
        <img
          v-if="props.athlete.photo"
          :src="getPhotoUrl(props.athlete)"
          :alt="props.athlete.name_ru"
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
      <div class="font-heading text-[0.5625rem] tracking-[0.2rem] font-semibold text-neutral-600 uppercase mb-2.5">
        {{ props.athlete.isActive ? 'АКТИВНЫЙ' : 'ВЕТЕРАН' }}
      </div>
      <h3 class="font-serif-classic text-2xl leading-[1.05] tracking-[-0.01rem] font-bold text-neutral-900 mb-3.5 mt-0 uppercase">
        {{ props.athlete.name_ru }}
      </h3>
      <p
        v-if="props.athlete.bio_ru"
        class="font-sans text-[0.8125rem] text-neutral-900 leading-[1.45] m-0"
      >
        {{ truncate(props.athlete.bio_ru, 120) }}
      </p>
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
      <span>→</span>
    </UButton>
  </div>
</template>
