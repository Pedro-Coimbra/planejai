import {
  type SimulationFormData,
  type SimulationRecord,
} from '@/data/simulation'

const LOCAL_STORAGE_KEY = 'simulation-data'

const readSimulations = (): SimulationRecord[] => {
  const storage = localStorage.getItem(LOCAL_STORAGE_KEY)

  if (!storage) {
    return []
  }

  try {
    const parsedData: unknown = JSON.parse(storage)
    return Array.isArray(parsedData) ? (parsedData as SimulationRecord[]) : []
  } catch {
    return []
  }
}

const writeSimulations = (simulations: SimulationRecord[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(simulations))
}

export const useSimulationStorage = () => {
  const saveFormData = (formData: SimulationFormData) => {
    const id = crypto.randomUUID()
    const record: SimulationRecord = {
      ...formData,
      id,
      createdAt: new Date().toISOString(),
    }

    writeSimulations([...readSimulations(), record])

    return id
  }

  const getFormData = (id: string): SimulationRecord | null => {
    return readSimulations().find((record) => record.id === id) ?? null
  }

  const getSimulations = (): SimulationRecord[] => {
    return readSimulations().reverse()
  }

  const updateSimulation = (id: string, data: SimulationRecord) => {
    const updated = readSimulations().map((record) =>
      record.id === id ? { ...data } : record,
    )

    writeSimulations(updated)
  }

  const deleteSimulation = (id: string) => {
    writeSimulations(
      readSimulations().filter((simulation) => simulation.id !== id),
    )
  }

  return {
    deleteSimulation,
    getFormData,
    getSimulations,
    saveFormData,
    updateSimulation,
  }
}
