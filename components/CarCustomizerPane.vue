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
    <p class="p-4 bg-gray-100 text-gray-500">
      <strong class="mr-4">Model</strong>{{ blok.model.name }}
    </p>
    <h3 class="text-primary text-2xl mb-4">
      Color
    </h3>
    <ul class="grid grid-cols-6 mb-4 list-none ml-0 pl-0">
      <li
        v-for="material in configurator.availableMaterials"
        :key="material.id"
        class="relative
        w-9
        h-9
        rounded
        flex
        cursor-pointer
        border-solid
        border-2
        border-transparent
        hover:border-red
        mb-4"
        :style="{ backgroundColor: material.color }"
        @click="selectMaterial(material)"
      >
        <i
          v-show="material.metalness > 0.5"
          class="i-ion-sparkles-sharp absolute top-0 right-0 text-yellow"
        />
        <span
          v-if="configurator?.selectedMaterial?.id === material.id"
          class="absolute top-0 left-0 bg-black bg-opacity-50 w-full flex h-full items-center justify-center"
        >
          <i class="i-ion-checkmark text-white" />
        </span>
      </li>
    </ul>
  </div>
</template>
