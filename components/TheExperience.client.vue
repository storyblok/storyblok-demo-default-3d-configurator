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

const { pane } = useTweakPane()

const carRef = ref(null)

watch(carRef, ({ model }) => {
  if (model) {
    const car = model.children[0]
    car.scale.set(0.01, 0.01, 0.01)
    console.log(car)
    car.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
      if (child.name === 'Octane_Paint_0' || child.name === 'Octane_Octane_Body_0') {
        child.material = new MeshStandardMaterial({
          color: new Color(0x000000),
          envMap: environmentTexture.value,
          metalness: 0.5,
          roughness: 0.5,
        })

        pane.addInput(child.material, 'color', {
          label: child.name.replaceAll('Octane_', '').replace('_0', ' '),
          view: 'text',
          color: { type: 'float' },
        })
      }
    })
    pane.addInput(car.rotation, 'y', {
      label: 'Rotation',
      min: -Math.PI,
      max: Math.PI,
      step: 0.01,
    })
  }
})
</script>

<template>
  <TresCanvas v-bind="gl">
    <TresPerspectiveCamera :args="[45, 1, 0.1, 1000]" :position="[5, 5, 5]" />
    <TresAmbientLight :args="['#ffffff', 0.5]" />
    <TresDirectionalLight :args="['purple', 1]" :position="[0, 1, 0]" />
    <Suspense>
      <Environment :blur="1" preset="sunset" ref="environmentTexture" />

      <template #fallback> Loading </template>
    </Suspense>
    <Suspense>
      <GLTFModel ref="carRef" path="/models/octane_-_rocket_league_car/scene.gltf" draco />

      <template #fallback> Loading </template>
    </Suspense>
    <TresGridHelper :args="[4, 4]" />
    <OrbitControls />
  </TresCanvas>
</template>
