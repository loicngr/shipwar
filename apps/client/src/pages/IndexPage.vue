<template>
  <q-page class="no-padding no-margin full-width full-height">
    <div
      id="game"
      class="full-width full-height"
    />
  </q-page>
</template>

<script setup lang="ts">
import { Game } from 'common/src/class/game'
import { onMounted } from 'vue'

onMounted(() => {
  // eslint-disable-next-line no-new
  new Game('game')
})
</script>
