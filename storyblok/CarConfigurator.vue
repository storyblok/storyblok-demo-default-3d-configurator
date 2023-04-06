<script setup lang="ts">
defineProps({ blok: Object })
</script>

<template>
  <div v-editable="blok" class="w-full aspect-video">
    <TheExperience :blok="blok" />
  </div>
</template>
