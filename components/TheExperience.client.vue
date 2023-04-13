<script setup lang="ts">
import { BasicShadowMap, sRGBEncoding, NoToneMapping, Color, MeshStandardMaterial, DefaultLoadingManager } from 'three'
import { TresCanvas, useTres } from '@tresjs/core'
import { OrbitControls, Environment, GLTFModel, useTweakPane } from '@tresjs/cientos'

const props = defineProps<{
  blok: Object
}>()

const gl = {
  antialias: true,
  alpha: true,
  shadows: true,
  clearColor: 'teal',
  powerPreference: 'high-performance',
  shadowMapType: BasicShadowMap,
  outputEncoding: sRGBEncoding,
  toneMapping: NoToneMapping,
}

const configurator = useCarConfigurator()

console.log(configurator.value)

watchEffect(() => {
  if (props.blok) {
    configurator.value.availableMaterials = props.blok.materials.availableMaterials.map((material, index) => ({
      id: index,
      ...material,
    }))
  }
})

const environmentTexture = ref(null)

const context = ref()

watchEffect(() => {
  if (context) {
    console.log('context', context)
  }
})

const hasFinishLoading = ref(false)
const progress = ref(0)

let saveLastTotalLoaded = 0

DefaultLoadingManager.onProgress = (item, loaded, total) => {
  if (loaded === total) {
    saveLastTotalLoaded = total
    hasFinishLoading.value = true
  }
  progress.value = Math.round(((loaded - saveLastTotalLoaded) / (total - saveLastTotalLoaded)) * 100 || 100, 2)
}
</script>

<template>
  <Transition
    name="fade-overlay"
    enter-active-class="opacity-1 transition-opacity duration-200"
    leave-active-class="opacity-0 transition-opacity duration-200"
  >
    <div
      v-show="!hasFinishLoading"
      class="absolute bg-white t-0 l-0 w-full h-full z-20 flex justify-center items-center text-black"
    >
      <div class="w-200px">
        <p>Loading 3D experience</p>
        <SbLoading type="bar" size="normal" :model-value="progress" show-percentage color="primary" />
      </div>
    </div>
  </Transition>
  <CarCustomizerPane v-if="blok" :blok="blok" />
  <TresCanvas v-bind="gl" ref="context">
    <TresPerspectiveCamera :args="[45, 1, 0.1, 1000]" :position="[5, 5, 5]" />
    <Suspense>
      <Environment :blur="1" preset="sunset" ref="environmentTexture" />

      <template #fallback> Loading </template>
    </Suspense>
    <Suspense>
      <TheVehicle :env="environmentTexture" :vehicle-model="blok.model" />
    </Suspense>
    <TresAmbientLight :args="['#ffffff', 0.5]" />
    <TresDirectionalLight :args="['white', 1]" :position="[0, 1, 0]" />
    <TresGridHelper :args="[20, 20]" />
    <OrbitControls />
  </TresCanvas>
</template>
