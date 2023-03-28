<script setup lang="ts">
import { Color, MeshStandardMaterial } from 'three'
import { useSeek } from '@tresjs/core'
import { useTweakPane, GLTFModel } from '@tresjs/cientos'

const props = defineProps<{
  env?: string
}>()

const { pane } = useTweakPane()

const carRef = ref(null)

const { seek } = useSeek()

watch(carRef, ({ model }) => {
  if (model) {
    const car = model.children[0]
    car.scale.set(0.01, 0.01, 0.01)
    console.log(car)
    const body = seek(car, 'name', 'Octane_Octane_Body_0')

    if (body) {
      body.material = new MeshStandardMaterial({
        color: new Color(0x000000),
        envMap: props.env,
        metalness: 0.5,
        roughness: 0.5,
      })

      pane.addInput(body.material, 'color', {
        label: body.name.replaceAll('Octane_', '').replace('_0', ' '),
        view: 'text',
        color: { type: 'float' },
      })
    }
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
  <Suspense>
    <GLTFModel ref="carRef" path="/models/octane_-_rocket_league_car/scene.gltf" draco />

    <template #fallback> Loading </template>
  </Suspense>
</template>
