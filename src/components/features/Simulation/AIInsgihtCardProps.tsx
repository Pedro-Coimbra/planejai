import 'react-loading-skeleton/dist/skeleton.css'

import {
  AlertCircle,
  LoaderCircle,
  MessageCircle,
  SendHorizontal,
  Sparkles,
} from 'lucide-react'
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import Skeleton from 'react-loading-skeleton'

import { Content } from '@/components/features/insights/Content'
import { Error } from '@/components/features/insights/Error'
import type { InsightConversationMessage } from '@/data/simulation'
import { useInsight } from '@/hooks/useInsight'

interface AIInsightCardProps {
  simulationId: string
}

const messageStyles = {
  assistant: {
    label: 'Resposta da IA',
    text: 'text-foreground',
  },
  user: {
    label: 'Você',
    text: 'text-muted-foreground',
  },
}

function ConversationEntry({
  message,
}: {
  message: InsightConversationMessage
}) {
  const styles = messageStyles[message.role]

  return (
    <article className="border-border border-t py-5">
      <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-semibold">
        <MessageCircle size={22} className="text-primary" />
        <span>{styles.label}</span>
      </div>
      <p className={`${styles.text} whitespace-pre-line text-sm leading-relaxed`}>
        {message.content}
      </p>
    </article>
  )
}

function ChatLoadingMessage() {
  return (
    <article
      className="border-border border-t py-5"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-semibold">
        <LoaderCircle size={22} className="text-primary animate-spin" />
        <span>Resposta da IA</span>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Preparando uma resposta clara para a sua pergunta...
      </p>
    </article>
  )
}

function ChatErrorMessage({ message }: { message: string }) {
  return (
    <div
      className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500"
      role="alert"
    >
      <AlertCircle size={18} />
      <span>{message}</span>
    </div>
  )
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const [question, setQuestion] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const {
    askQuestion,
    chatError,
    conversation,
    error,
    fetchInsight,
    insight,
    isAnswerLoading,
    isLoading,
  } = useInsight(simulationId)

  const canSubmit = Boolean(question.trim()) && !isAnswerLoading && !isLoading

  const scrollToConversationEnd = () => {
    const element = scrollRef.current

    if (!element) {
      return
    }

    element.scrollTo({
      behavior: 'smooth',
      top: element.scrollHeight,
    })
  }

  const submitQuestion = () => {
    const trimmedQuestion = question.trim()

    if (!trimmedQuestion || !canSubmit) {
      return
    }

    setQuestion('')
    void askQuestion(trimmedQuestion)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitQuestion()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submitQuestion()
    }
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(scrollToConversationEnd)
    return () => window.cancelAnimationFrame(frame)
  }, [chatError, conversation.length, insight, isAnswerLoading])

  return (
    <div className="bg-card order-2 flex max-h-[760px] flex-col rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="mb-4 flex shrink-0 items-center gap-1.5">
        <Sparkles size={16} className="text-primary" />
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto pr-2 [scrollbar-color:var(--border)_transparent]"
      >
        {isLoading && (
          <div className="flex">
            <Skeleton
              count={10.5}
              baseColor="var(--color-skeleton-base)"
              highlightColor="var(--color-skeleton-highlight)"
              className="mb-3 flex rounded-lg"
              containerClassName="flex-1"
              inline
            />
          </div>
        )}
        {!isLoading && error && (
          <Error
            simulationId={simulationId}
            message={error}
            onRetry={() => fetchInsight(simulationId)}
          />
        )}
        {!isLoading && insight && (
          <>
            <Content insight={insight} />

            {(conversation.length > 0 || isAnswerLoading || chatError) && (
              <div className="mt-6">
                {conversation.map((message) => (
                  <ConversationEntry key={message.id} message={message} />
                ))}
                {isAnswerLoading && <ChatLoadingMessage />}
                {chatError && <ChatErrorMessage message={chatError} />}
              </div>
            )}
          </>
        )}
      </div>

      {!isLoading && !error && insight && (
        <form
          className="border-border mt-5 flex shrink-0 items-end gap-2 border-t pt-5"
          onSubmit={handleSubmit}
        >
          <textarea
            className="bg-input text-foreground placeholder:text-muted-foreground min-h-14 flex-1 resize-none rounded-2xl border border-border px-4 py-4 text-sm leading-5 outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-70"
            value={question}
            rows={1}
            maxLength={300}
            disabled={isAnswerLoading}
            placeholder="Quais são os investimentos mais seguros que posso usar para que minha renda aumente?"
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-2xl transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={!canSubmit}
            aria-label="Enviar pergunta"
          >
            {isAnswerLoading ? (
              <LoaderCircle size={24} className="animate-spin" />
            ) : (
              <SendHorizontal size={24} />
            )}
          </button>
        </form>
      )}
    </div>
  )
}
