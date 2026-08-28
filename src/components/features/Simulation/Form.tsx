import { FormStep } from "@/components/features/Simulation/FormStep";
import { StepProgress } from "@/components/features/Simulation/Progress";
import { simulationFormSteps, type SimulationFormData } from "@/data/simulation";
import { useSimulationStorage } from "@/hooks/useSimulationStorage";
import { PiggyBank } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export function SimulationForm() {

  const { saveFormData } = useSimulationStorage()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<SimulationFormData>(
    {} as SimulationFormData
  )
  const totalSteps = simulationFormSteps.length
  const currentStep = simulationFormSteps[currentStepIndex]

  const navigate = useNavigate()

  const handleNextStep = (value: string) => {
    const updatedFormData = { ...formData, [currentStep.id]: value }
    setFormData(updatedFormData)

    if (currentStepIndex + 1 > totalSteps - 1) {
      saveFormData(updatedFormData)
      void navigate('/resultado')
      return
    }

    setCurrentStepIndex((prev) => prev + 1)
  }

  const handlePreviousStep = () => {
    if (currentStepIndex === 0) {
      return
    }
    setCurrentStepIndex((prev) => prev - 1)
  }

  return (
    <div className="mb-8 text-center">
      <StepProgress currentStep={1} totalSteps={6} />
      <FormStep
        key={currentStep.id}
        onBack={handlePreviousStep}
        onNext={handleNextStep}
        {...currentStep}
        hideBackButton={currentStepIndex === 0}
      />
    </div>
  )
}
