<script setup lang="ts">
import { Color, MeshStandardMaterial } from 'three'
import { useSeek } from '@tresjs/core'
import { useTweakPane, GLTFModel, useGLTF } from '@tresjs/cientos'

const props = defineProps<{
  env?: string
  availableColors?: string[]
  metalness?: number
  roughness?: number
  vehicleModel: Object
}>()

const { pane } = useTweakPane()

const carRef = ref(null)

let model = ''

watchEffect(async () => {
  if (props.vehicleModel) {
    const { scene } = await useGLTF(props.vehicleModel.content?.model?.filename, { draco: true })
    model = scene

    console.log('Awiwi', {
      model,
      filane: props.vehicleModel?.content?.model?.filename,
    })

    /* carRef.value.needsUpdate() */
  }
})

/* watch(
  () => carRef.value,
  value => {
    if (value.model) {
      value.model.needsUpdate()
      const car = value.model.children[0]
      let body

      car.traverse(child => {
        if (child.isMesh) {
          if (child.name === 'car_body002') {
            body = child
          }
        }
      })

      if (body) {
        body.material = new MeshStandardMaterial({
          color: new Color(0x00b3b0),
          envMap: props.env,
          metalness: 0.5,
          roughness: 0.5,
        })

        pane.addInput(body.material, 'color', {
          view: 'text',
          color: { type: 'float' },
        })
      }
    }
  },
  {
    immediate: true,
  },
) */

/* watchEffect(() => {
  if (props.availableColors) {
    pane.addInput(props, 'availableColors', {
      label: 'Color',
      options: props.availableColors,
    })
  }
}) */
</script>

<template>
  <Suspense>
    <!--  <GLTFModel ref="carRef" :path="vehicleModel.content.model.filename" draco /> -->
    <TresMesh ref="carRef" v-if="model" v-bind="model" />
    <template #fallback> Loading </template>
  </Suspense>
</template>
