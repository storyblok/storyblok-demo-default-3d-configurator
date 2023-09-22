<script setup lang="ts">
import { Color, MeshPhysicalMaterial, Object3D } from 'three'

const props = defineProps<{
  env?: string
  availableColors?: string[]
  metalness?: number
  roughness?: number
  vehicleModel: Object
}>()

const configurator = useCarConfigurator()

const carRef = ref(null)

let model = shallowRef()
let body = ref<Object3D | null>(null)
let nodes = shallowRef([])

watchEffect(async () => {
  if (props.vehicleModel) {
    const { scene, nodes } = await useGLTF(props.vehicleModel.content?.model?.filename, { draco: true })
    model.value = scene

    configurator.value.model = scene
    configurator.value.nodes = nodes

    if (props.vehicleModel.content?.paint) {
      const customMaterial = new MeshPhysicalMaterial({
        color: new Color(0x00b3b0),
        envMap: props.env,
        metalness: 0.5,
        roughness: 0.5,
      })
      const meshes = props.vehicleModel.content?.paint.split(',')
      meshes.forEach(element => {
        body.value = nodes[element.trim()]
        body.value.material = customMaterial
      })
    }
  }
})

watchEffect(() => {
  if (configurator.value?.selectedMaterial) {
    const meshes = props.vehicleModel.content?.paint.split(',')
    meshes.forEach(element => {
      body.value = configurator.value.nodes[element.trim()]
      body.value.material.color = new Color(configurator.value?.selectedMaterial.color)
      body.value.material.metalness = configurator.value?.selectedMaterial.metalness
      body.value.material.roughness = configurator.value?.selectedMaterial.roughness
    })
  }
})
</script>

<template>
  <TresMesh ref="carRef" v-bind="model" />
</template>
