<script setup lang="ts">
import { BasicShadowMap, sRGBEncoding, NoToneMapping, Color, MeshStandardMaterial } from 'three'
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

const environmentTexture = ref(null)

const context = ref()
watchEffect(() => {
  if (context) {
    console.log('context', context)
  }
})
</script>

<template>
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
