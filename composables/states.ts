export interface Model {
  name: string
}

export const useCarConfigurator = () =>
  useState<{
    model: Model | null
    selectedMaterial: Object | null
    availableMaterials: Array<any>
  } | null>('configurator', () => ({
    model: null,
    selectedMaterial: null,
    availableMaterials: [],
  }))
