import {
  ChartNoAxesCombined,
  ExternalLink,
  History,
  Plus,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageHero } from '@/components/shared/PageHero'
import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { formatCurrency, parseCurrency } from '@/utils/currency'
import { calcRequiredMonthlySavings } from '@/utils/simulation'

const formatSimulationDate = (createdAt?: string) => {
  if (!createdAt) {
    return 'Data não registrada'
  }

  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) {
    return 'Data não registrada'
  }

  return new Intl.DateTimeFormat('pt-BR').format(date)
}

function SummaryItem({
  className = '',
  label,
  value,
}: {
  className?: string
  label: string
  value: string
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="text-muted-foreground mb-1 text-[0.65rem] font-semibold tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-foreground truncate text-sm font-semibold">
        {value}
      </dd>
    </div>
  )
}

interface HistoryCardProps {
  simulation: SimulationRecord
  onDelete: (simulation: SimulationRecord) => void
  onViewDetails: (id: string) => void
}

function HistoryCard({
  simulation,
  onDelete,
  onViewDetails,
}: HistoryCardProps) {
  const monthlySavings = calcRequiredMonthlySavings(simulation)

  return (
    <article className="bg-card grid grid-cols-2 gap-5 rounded-2xl p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:-translate-y-0.5 sm:grid-cols-3 sm:p-6 lg:grid-cols-[minmax(13rem,1.4fr)_minmax(8rem,0.8fr)_minmax(6rem,0.65fr)_minmax(9rem,0.9fr)_auto] lg:items-center lg:gap-6">
      <div className="col-span-2 flex min-w-0 items-center gap-4 sm:col-span-3 lg:col-span-1">
        <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
          <ChartNoAxesCombined aria-hidden="true" size={20} />
        </div>
        <div className="min-w-0">
          <h2 className="text-foreground truncate text-sm font-semibold">
            {simulation.goalName}
          </h2>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {formatSimulationDate(simulation.createdAt)}
          </p>
        </div>
      </div>

      <dl className="contents">
        <SummaryItem
          label="Custo da meta"
          value={formatCurrency(parseCurrency(simulation.goalAmount))}
        />
        <SummaryItem
          label="Prazo"
          value={`${simulation.goalDeadline} ${Number(simulation.goalDeadline) === 1 ? 'mês' : 'meses'}`}
        />
        <SummaryItem
          label="Economia mensal"
          value={formatCurrency(monthlySavings)}
          className="col-span-2 sm:col-span-1"
        />
      </dl>

      <div className="border-border col-span-2 flex items-center justify-end gap-3 border-t pt-4 sm:col-span-3 lg:col-span-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
        <button
          type="button"
          aria-label={`Excluir simulação ${simulation.goalName}`}
          title="Excluir simulação"
          className="flex size-10 cursor-pointer items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-500/10 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
          onClick={() => onDelete(simulation)}
        >
          <Trash2 aria-hidden="true" size={19} />
        </button>
        <button
          type="button"
          className="border-border text-foreground hover:bg-secondary-button focus-visible:ring-primary flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none"
          onClick={() => onViewDetails(simulation.id)}
        >
          <ExternalLink aria-hidden="true" size={14} />
          Ver detalhes
        </button>
      </div>
    </article>
  )
}

export function SimulationHistoryPage() {
  const navigate = useNavigate()
  const { deleteSimulation, getSimulations } = useSimulationStorage()
  const [simulations, setSimulations] = useState<SimulationRecord[]>(() =>
    getSimulations(),
  )

  const handleDelete = (simulation: SimulationRecord) => {
    const shouldDelete = window.confirm(
      `Deseja excluir a simulação “${simulation.goalName}”?`,
    )

    if (!shouldDelete) {
      return
    }

    deleteSimulation(simulation.id)
    setSimulations((current) =>
      current.filter((item) => item.id !== simulation.id),
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Acompanhe o histórico de seus planos financeiros."
      />

      {simulations.length > 0 ? (
        <div className="flex flex-col gap-5">
          {simulations.map((simulation) => (
            <HistoryCard
              key={simulation.id}
              simulation={simulation}
              onDelete={handleDelete}
              onViewDetails={(id) => void navigate(`/resultado/${id}`)}
            />
          ))}
        </div>
      ) : (
        <section className="bg-card border-border flex flex-col items-center rounded-2xl border px-6 py-14 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.08)] sm:py-20">
          <div className="bg-primary/10 text-primary mb-5 flex size-14 items-center justify-center rounded-2xl">
            <History aria-hidden="true" size={27} />
          </div>
          <h2 className="text-foreground text-lg font-semibold">
            Nenhuma simulação por aqui
          </h2>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
            Crie uma simulação para começar a acompanhar seus planos
            financeiros.
          </p>
          <button
            type="button"
            className="bg-primary text-primary-foreground focus-visible:ring-primary mt-6 flex cursor-pointer items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            onClick={() => void navigate('/')}
          >
            <Plus aria-hidden="true" size={17} />
            Nova simulação
          </button>
        </section>
      )}
    </main>
  )
}
