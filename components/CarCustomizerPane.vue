<script setup lang="ts">
defineProps<{
  blok: Object
}>()

const configurator = useCarConfigurator()

function selectMaterial(material) {
  configurator.value.selectedMaterial = material
}
</script>
<template>
  <div class="fixed top-28 right-2 bg-white rounded-lg p-4 z-10 w-96 shadow-xl">
    <h2 class="text-primary text-4xl mb-4">Customize</h2>
    <ul class="grid grid-cols-6 mb-4 list-none ml-0 pl-0">
      <li
        class="relative w-9 h-9 rounded flex cursor-pointer border-solid border-2 border-transparent hover:border-red"
        :style="{ backgroundColor: material.color }"
        v-for="material in configurator.availableMaterials"
        @click="selectMaterial(material)"
      >
        <i class="i-ion-sparkles-sharp absolute top-0 right-0 text-yellow" v-show="material.metalness > 0.5"></i>
        <span
          class="absolute top-0 left-0 bg-black bg-opacity-50 w-full flex h-full items-center justify-center"
          v-if="configurator?.selectedMaterial?.id === material.id"
        >
          <i class="i-ion-checkmark text-white"></i>
        </span>
      </li>
    </ul>
  </div>
</template>
