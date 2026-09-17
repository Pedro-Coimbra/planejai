import { useCallback, useEffect, useRef, useState } from 'react'

import { buildAIChatPrompt, buildAIPrompt } from '@/data/aiPrompt'
import type { InsightConversationMessage } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import {
  getChatAnswer,
  getInsight,
  type InsightData,
} from '@/services/aiService'

const createConversationMessage = (
  role: InsightConversationMessage['role'],
  content: string,
): InsightConversationMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
  createdAt: new Date().toISOString(),
})

export const useInsight = (id: string) => {
  const isInsightRequestPending = useRef(false)
  const isChatRequestPending = useRef(false)
  const { getFormData, updateSimulation } = useSimulationStorage()

  const [insight, setInsight] = useState<InsightData | null>(() => {
    const simulation = getFormData(id)

    if (simulation?.insight) {
      return simulation.insight
    }

    return null
  })
  const [conversation, setConversation] = useState<
    InsightConversationMessage[]
  >(() => getFormData(id)?.conversation ?? [])
  const [isLoading, setIsLoading] = useState(false)
  const [isAnswerLoading, setIsAnswerLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatError, setChatError] = useState<string | null>(null)

  // useCallback é necessário pois essa função entra no array de dependências do useEffect
  const fetchInsight = useCallback(
    async (simulationId: string) => {
      const simulation = getFormData(simulationId)

      if (!simulation) {
        setError('Simulação não encontrada.')
        return
      }

      isInsightRequestPending.current = true
      setIsLoading(true)
      setError(null)

      try {
        const prompt = buildAIPrompt(simulation)
        const data = await getInsight(prompt)
        setInsight(data)
        updateSimulation(simulationId, {
          ...simulation,
          insight: data,
        })
        return data
      } catch {
        setError('Erro ao gerar o diagnóstico. Tente novamente.')
      } finally {
        isInsightRequestPending.current = false
        setIsLoading(false)
      }
    },
    [getFormData, updateSimulation],
  )

  const askQuestion = useCallback(
    async (question: string) => {
      const trimmedQuestion = question.trim()

      if (!trimmedQuestion || isChatRequestPending.current) {
        return
      }

      const simulation = getFormData(id)

      if (!simulation) {
        setChatError('Simulação não encontrada.')
        return
      }

      const history = simulation.conversation ?? conversation
      const userMessage = createConversationMessage('user', trimmedQuestion)
      const conversationWithQuestion = [...history, userMessage]

      setConversation(conversationWithQuestion)
      updateSimulation(id, {
        ...simulation,
        conversation: conversationWithQuestion,
      })

      isChatRequestPending.current = true
      setIsAnswerLoading(true)
      setChatError(null)

      try {
        const prompt = buildAIChatPrompt({
          history,
          question: trimmedQuestion,
          simulation: {
            ...simulation,
            conversation: conversationWithQuestion,
          },
        })
        const answer = await getChatAnswer(prompt)
        const assistantMessage = createConversationMessage('assistant', answer)
        const latestSimulation = getFormData(id) ?? simulation
        const latestConversation =
          latestSimulation.conversation ?? conversationWithQuestion
        const updatedConversation = [...latestConversation, assistantMessage]

        setConversation(updatedConversation)
        updateSimulation(id, {
          ...latestSimulation,
          conversation: updatedConversation,
        })

        return assistantMessage
      } catch {
        setChatError('Não consegui gerar a resposta. Tente novamente.')
      } finally {
        isChatRequestPending.current = false
        setIsAnswerLoading(false)
      }
    },
    [conversation, getFormData, id, updateSimulation],
  )

  useEffect(() => {
    if (insight || isLoading || isInsightRequestPending.current) {
      return
    }

    fetchInsight(id).then((data) => {
      if (!data) return
      setInsight(data)
    })
  }, [id, insight, isLoading, fetchInsight])

  return {
    askQuestion,
    chatError,
    conversation,
    error,
    fetchInsight,
    insight,
    isAnswerLoading,
    isLoading,
  }
}
