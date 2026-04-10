<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppHeader'
})
</script>

<template>
  <UHeader toggle-side="left">
    <template #title>
      SakhaGames
    </template>
  </UHeader>
</template>
