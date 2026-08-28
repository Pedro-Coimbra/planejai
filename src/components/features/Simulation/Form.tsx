import { FormStep } from "@/components/features/Simulation/FormStep";
import { StepProgress } from "@/components/features/Simulation/Progress";
import { simulationFormSteps } from "@/data/simulation";
import { PiggyBank } from "lucide-react";
import { useState } from "react";


export function SimulationForm() {

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const totalSteps = simulationFormSteps.length
  const currentStep = simulationFormSteps[currentStepIndex]

  const handleNextStep = () => {
    if (currentStepIndex + 1 > totalSteps - 1) {
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
