<script setup lang="ts">
import DOMPurify from "isomorphic-dompurify"

const route = useRoute()
const { athletes: athletesApi } = useApi()
const config = useRuntimeConfig()

const { data: athlete } = await useAsyncData(
  `athlete-${route.params.slug}`,
  () => athletesApi.getBySlug(route.params.slug as string),
)

if (!athlete.value) {
  throw createError({ statusCode: 404, message: "Спортсмен не найден" })
}

useSeoMeta({ title: () => athlete.value?.name ?? "" })

const getFileUrl = (filename: string) =>
  `${config.public.pocketbaseUrl}/api/files/athletes/${athlete.value!.id}/${filename}`

const photoUrl = computed(() => athlete.value?.photo ? getFileUrl(athlete.value.photo) : "")
const photoUrls = computed(() => athlete.value?.photos?.map(getFileUrl) ?? [])

const birthYear = computed(() => {
  if (!athlete.value?.birthDate) return null
  return new Date(athlete.value.birthDate).getFullYear()
})

const metaRows = computed(() => {
  const a = athlete.value!
  return [
    { label: "Год рождения", value: birthYear.value },
    { label: "Место рождения", value: a.birthPlace },
    { label: "Регион", value: a.region },
    { label: "Клуб", value: a.club },
  ].filter(r => r.value)
})

const sanitizedBio = computed(() =>
  athlete.value?.bio ? DOMPurify.sanitize(athlete.value.bio) : "",
)
</script>

<template>
  <div class="bg-neutral-50 min-h-screen">
    <!-- Back nav -->
    <div class="px-5 pt-6 pb-5">
      <UButton
        to="/athletes"
        color="neutral"
        variant="ghost"
        leading-icon="i-tabler-arrow-narrow-left"
        class="font-heading text-[0.625rem] tracking-[0.18rem] uppercase -ml-2"
      >
        Все спортсмены
      </UButton>
    </div>

    <!-- Photo -->
    <div class="relative bg-neutral-800 aspect-square overflow-hidden">
      <img
        v-if="photoUrl"
        :src="photoUrl"
        :alt="athlete!.name"
        fetchpriority="high"
        class="w-full h-full object-cover"
      >
      <div
        v-else
        class="w-full h-full grid place-items-center text-white/30"
      >
        <UIcon
          name="i-tabler-user"
          class="size-32"
        />
      </div>
      <div class="absolute bottom-0 left-0 right-0 px-5 py-5 bg-linear-to-t from-primary-500 via-primary-500/75 to-transparent">
        <AthleteStatusBadge
          :is-active="athlete!.isActive"
          variant="dark"
          class="mb-2"
        />
        <h1 class="text-4xl leading-[1.05] font-bold text-white mb-0 mt-0">
          {{ athlete!.name }}
        </h1>
      </div>
    </div>

    <!-- Title / rank -->
    <div
      v-if="athlete!.title"
      class="bg-primary-500 px-5 py-4"
    >
      <p class="font-heading text-[0.6875rem] tracking-[0.12rem] font-semibold text-white uppercase">
        {{ athlete!.title }}
      </p>
    </div>

    <!-- Meta rows -->
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

    <!-- Bio -->
    <section
      v-if="athlete!.bio"
      class="bg-neutral-200 px-5 py-8"
    >
      <p class="font-heading text-[0.625rem] tracking-[0.2rem] font-semibold text-neutral-500 uppercase mb-5">
        Биография
      </p>
      <div
        class="font-sans text-[0.9375rem] leading-[1.75] text-neutral-900 [&>p]:mb-4 [&>p:last-child]:mb-0"
        v-html="sanitizedBio"
      />
    </section>

    <!-- Achievements -->
    <section
      v-if="athlete!.achievements?.length"
      class="bg-neutral-50 px-5 py-8"
    >
      <p class="font-heading text-[0.625rem] tracking-[0.2rem] font-semibold text-neutral-500 uppercase mb-6">
        Достижения
      </p>
      <ul class="m-0 p-0 list-none grid gap-4">
        <li
          v-for="(item, i) in athlete!.achievements"
          :key="i"
          class="flex gap-2 items-start"
        >
          <UIcon
            :name="item.icon"
            class="size-4 mt-[0.15rem] shrink-0 text-neutral-900"
          />
          <span class="font-sans text-[0.9375rem] leading-normal text-neutral-900">
            {{ item.text }}
          </span>
        </li>
      </ul>
    </section>

    <!-- Photos gallery -->
    <section
      v-if="photoUrls.length"
      class="bg-neutral-200 py-8"
    >
      <p class="font-heading text-[0.625rem] tracking-[0.2rem] font-semibold text-neutral-500 uppercase mb-5 px-5">
        Фотографии
      </p>
      <UCarousel
        :items="photoUrls"
        :ui="{ item: 'basis-auto ps-0 w-auto', container: 'px-5 gap-3' }"
      >
        <template #default="{ item, index }">
          <img
            :src="item"
            :alt="`${athlete!.name} — фото ${index + 1}`"
            loading="lazy"
            class="h-72 w-auto block"
          >
        </template>
      </UCarousel>
    </section>
  </div>
</template>
