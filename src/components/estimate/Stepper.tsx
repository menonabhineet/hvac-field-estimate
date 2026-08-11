import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export function Stepper({ currentStep, totalSteps }: StepperProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-sm mx-auto px-4 sm:px-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isPast = step < currentStep;

        return (
          <React.Fragment key={step}>
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300',
                isActive
                  ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-100 dark:ring-blue-900'
                  : isPast
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
              )}
            >
              {isPast ? <Check className="h-4 w-4" /> : step}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  'mx-2 h-1 flex-1 rounded-full transition-colors duration-300',
                  isPast ? 'bg-blue-200 dark:bg-blue-800' : 'bg-slate-100 dark:bg-slate-800'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
