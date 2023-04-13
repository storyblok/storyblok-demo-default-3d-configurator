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

const configurator = useCarConfigurator()

const { pane } = useTweakPane()

const carRef = ref(null)

let model = shallowRef()
let body = ref(null)
watchEffect(async () => {
  if (props.vehicleModel) {
    const { scene, nodes, materials } = await useGLTF(props.vehicleModel.content?.model?.filename, { draco: true })
    model.value = scene

    configurator.value.model = scene

    if (props.vehicleModel.content?.paint) {
      const meshes = props.vehicleModel.content?.paint.split(',')
      meshes.forEach(element => {
        body.value = nodes[element.trim()]
        body.value.material = new MeshStandardMaterial({
          color: new Color(0x00b3b0),
          envMap: props.env,
          metalness: 0.5,
          roughness: 0.5,
        })
        /*         pane.addInput(body.material, 'color', {
          label: element,
          view: 'text',
          color: { type: 'float' },
        }) */
      })
    }
  }
})

watchEffect(() => {
  if (configurator.value?.selectedMaterial) {
    body.value.material.color = new Color(configurator.value?.selectedMaterial.color)
    body.value.material.metalness = configurator.value?.selectedMaterial.metalness
    body.value.material.roughness = configurator.value?.selectedMaterial.roughness
  }
})
</script>

<template>
  <TresMesh ref="carRef" v-bind="model" />
</template>
