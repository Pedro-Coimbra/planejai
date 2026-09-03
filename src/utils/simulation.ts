import type { SimulationFormData } from '../data/simulation'
import { parseCurrency } from './currency'

export function calcMonthlySavings(data: SimulationFormData) {
  return (
    parseCurrency(data.income) -
    parseCurrency(data.expenses) -
    parseCurrency(data.debts)
  )
}

export function calcRequiredMonthlySavings(data: SimulationFormData) {
  const deadline = Number(data.goalDeadline)

  if (!Number.isFinite(deadline) || deadline <= 0) {
    return 0
  }

  return parseCurrency(data.goalAmount) / deadline
}
