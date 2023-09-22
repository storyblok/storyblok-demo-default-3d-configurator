<script setup lang="ts">
import { BasicShadowMap, NoToneMapping, DefaultLoadingManager } from 'three'
import { gsap } from 'gsap'

const props = defineProps<{
  blok: Object
}>()

const gl = {
  antialias: true,
  alpha: true,
  shadows: true,
  clearColor: 'aliceblue',
  powerPreference: 'high-performance',
  shadowMapType: BasicShadowMap,
  toneMapping: NoToneMapping,
}

const cameraRef = ref(null)
const firstTime = ref(true)

function animateCameraIn() {
  if (!firstTime.value) return
  gsap.to(cameraRef?.value?.position, {
    duration: 3,
    delay: 0.5,
    x: 5.04,
    y: 2.84,
    z: 6.46,
    ease: 'power4.out',
    onUpdate: () => {
      cameraRef?.value?.lookAt(0, 0, 0)
    },
    onComplete: () => {
      firstTime.value = false
    },
  })
}

const configurator = useCarConfigurator()

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

const hasFinishLoading = ref(false)
const progress = ref(0)

let saveLastTotalLoaded = 0

DefaultLoadingManager.onProgress = (item, loaded, total) => {
  if (loaded === total) {
    saveLastTotalLoaded = total
    hasFinishLoading.value = true
    animateCameraIn()
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
        <SbLoading
          type="bar"
          size="normal"
          :model-value="progress"
          show-percentage
          color="primary"
        />
      </div>
    </div>
  </Transition>
  <CarCustomizerPane
    v-if="blok"
    :blok="blok"
  />
  <TresCanvas
    v-bind="gl"
  >
    <TresPerspectiveCamera
      ref="cameraRef"
      :args="[45, 1, 0.1, 1000]"
      :position="firstTime ? [21, 9, 16.5] : [5.04, 2.84, 6.46]"
    />
    <Suspense>
      <Environment
        ref="environmentTexture"
        :blur="1"
        preset="sunset"
      />

      <template #fallback>
        Loading
      </template>
    </Suspense>
    <Suspense>
      <TheVehicle
        :env="environmentTexture"
        :vehicle-model="blok.model"
      />
    </Suspense>
    <TresAmbientLight :args="['#ffffff', 2]" />
    <TresDirectionalLight
      :args="['white', 1]"
      :position="[0, 1, 0]"
    />
    <TresGridHelper :args="[20, 20]" />
    <OrbitControls />
  </TresCanvas>
</template>
