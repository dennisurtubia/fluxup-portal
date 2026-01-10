import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  currentStep: number;
  steps: Array<{
    title: string;
    description?: string;
  }>;
  className?: string;
}

export function Stepper({ currentStep, steps, className }: StepperProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200',
                        isCompleted && 'bg-primary border-primary text-primary-foreground',
                        isCurrent && 'bg-primary border-primary text-primary-foreground',
                        !isCompleted &&
                          !isCurrent &&
                          'bg-background border-muted-foreground/30 text-muted-foreground',
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div
                        className={cn(
                          'text-sm font-medium transition-colors duration-200',
                          isCurrent || isCompleted ? 'text-foreground' : 'text-muted-foreground',
                        )}
                      >
                        {step.title}
                      </div>
                      {step.description && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {step.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {!isLast && (
                <div className="flex items-center px-2 pb-8">
                  <div
                    className={cn(
                      'h-0.5 w-full min-w-[40px] transition-colors duration-200',
                      isCompleted ? 'bg-primary' : 'bg-muted-foreground/30',
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
