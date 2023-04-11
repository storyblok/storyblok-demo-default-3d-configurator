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

let model = shallowRef()

watchEffect(async () => {
  if (props.vehicleModel) {
    const { scene, nodes, materials } = await useGLTF(props.vehicleModel.content?.model?.filename, { draco: true })
    model.value = scene

    if (props.vehicleModel.content?.paint) {
      const meshes = props.vehicleModel.content?.paint.split(',')
      meshes.forEach(element => {
        const body = nodes[element.trim()]
        body.material = new MeshStandardMaterial({
          color: new Color(0x00b3b0),
          envMap: props.env,
          metalness: 0.5,
          roughness: 0.5,
        })
        pane.addInput(body.material, 'color', {
          label: element,
          view: 'text',
          color: { type: 'float' },
        })
      })
    }
  }
})
</script>

<template>
  <TresMesh ref="carRef" v-bind="model" />
</template>
