<script setup lang="ts">
import { BasicShadowMap, sRGBEncoding, NoToneMapping, Color, MeshStandardMaterial } from 'three'
import { TresCanvas, useTres } from '@tresjs/core'
import { OrbitControls, Environment, GLTFModel, useTweakPane } from '@tresjs/cientos'

const gl = {
  antialias: true,
  alpha: true,
  shadows: true,
  clearColor: 'teal',
  powerPreference: 'high-performance',
  windowSize: true,
  shadowMapType: BasicShadowMap,
  outputEncoding: sRGBEncoding,
  toneMapping: NoToneMapping,
}

const environmentTexture = ref(null)

const { state } = useTres()

watchEffect(() => {
  if (state) {
    console.log('state', state)
  }
})
</script>

<template>
  <TresCanvas v-bind="gl">
    <TresPerspectiveCamera :args="[45, 1, 0.1, 1000]" :position="[5, 5, 5]" />
    <TresAmbientLight :args="['#ffffff', 0.5]" />
    <TresDirectionalLight :args="['white', 1]" :position="[0, 1, 0]" />
    <Suspense>
      <Environment :blur="1" preset="sunset" ref="environmentTexture" />

      <template #fallback> Loading </template>
    </Suspense>
    <TheVehicle :env="environmentTexture" />
    <TresGridHelper :args="[4, 4]" />
    <OrbitControls />
  </TresCanvas>
</template>
