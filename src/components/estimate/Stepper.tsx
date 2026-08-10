import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export function Stepper({ currentStep, totalSteps }: StepperProps) {
  return (
    <div className="flex items-center justify-center w-full mb-8 mt-2 px-4">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isPast = step < currentStep;

        return (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300',
                isActive
                  ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-100'
                  : isPast
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-100 text-slate-400'
              )}
            >
              {isPast ? <Check className="h-4 w-4" /> : step}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  'mx-2 h-1 w-12 rounded-full transition-colors duration-300 sm:w-16',
                  isPast ? 'bg-blue-200' : 'bg-slate-100'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
