<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-5xl mx-auto px-4">
      <div class="mb-10">
        <h1 class="text-6xl font-bold text-highlighted">
          Атлеты
        </h1>
      </div>

      <div
        v-if="athletes.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <UCard
          v-for="athlete in athletes"
          :key="athlete.id"
          class="overflow-hidden hover:shadow-lg transition-all duration-200"
        >
          <div class="p-5 flex gap-4">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
                👤
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="font-heading text-xl font-semibold text-highlighted">
                {{ athlete.fullName_ru }}
              </h3>

              <p
                v-if="athlete.birthDate"
                class="text-gray-600 mt-1 text-sm"
              >
                {{ formatBirthDate(athlete.birthDate) }}
                <span class="text-gray-500">({{ calculateAge(athlete.birthDate) }} лет)</span>
              </p>

              <p
                v-if="athlete.bio_ru"
                class="mt-4 text-gray-700 text-sm leading-relaxed line-clamp-3"
              >
                {{ athlete.bio_ru }}
              </p>
              <p
                v-else
                class="mt-4 text-gray-400 text-sm italic"
              >
                Биография пока не заполнена
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <div
        v-else
        class="text-center py-20"
      >
        <p class="text-2xl text-gray-400">
          Пока нет добавленных атлетов
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Athlete } from "~/types/athlete"

const { getAthletes } = usePocketBase()

const { data: athletes = [] } = await useAsyncData<Athlete[]>(
  "athletes-list",
  () => getAthletes(),
  { default: () => [] },
)

// ====================== Утилиты ======================
const formatBirthDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const calculateAge = (birthDate: string): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}
</script>
