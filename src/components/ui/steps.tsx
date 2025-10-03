import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

const stepsVariants = cva('flex items-center', {
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

const stepVariants = cva(
  'flex items-center justify-center rounded-full border-2 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-background border-border text-muted-foreground',
        active: 'bg-primary border-primary text-primary-foreground',
        completed: 'bg-primary border-primary text-primary-foreground',
        error: 'bg-destructive border-destructive text-destructive-foreground',
      },
      size: {
        sm: 'h-6 w-6 text-xs',
        default: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const stepContentVariants = cva('transition-colors duration-200', {
  variants: {
    variant: {
      default: 'text-muted-foreground',
      active: 'text-foreground font-medium',
      completed: 'text-foreground',
      error: 'text-destructive',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface StepsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepsVariants> {
  current?: number;
  children?: React.ReactNode;
}

export interface StepProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepVariants> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  index?: number;
  isLast?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  ({ className, orientation = 'horizontal', current = 0, children, ...props }, ref) => {
    const steps = React.Children.toArray(children);

    return (
      <div ref={ref} className={cn(stepsVariants({ orientation }), className)} {...props}>
        {steps.map((step, index) => {
          if (React.isValidElement(step)) {
            return React.cloneElement(step as React.ReactElement<StepProps>, {
              key: index,
              index,
              isLast: index === steps.length - 1,
              orientation: orientation || 'horizontal',
              variant: index < current ? 'completed' : index === current ? 'active' : 'default',
            });
          }
          return step;
        })}
      </div>
    );
  },
);
Steps.displayName = 'Steps';

const Step = React.forwardRef<HTMLDivElement, StepProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      title,
      description,
      icon,
      index = 0,
      isLast = false,
      orientation = 'horizontal',
      ...props
    },
    ref,
  ) => {
    const stepNumber = index + 1;
    const showConnector = !isLast;

    const renderStepIcon = () => {
      if (variant === 'completed') {
        return <Check className="h-4 w-4" />;
      }
      if (icon) {
        return icon;
      }
      return stepNumber;
    };

    const renderConnector = () => {
      if (!showConnector) return null;

      if (orientation === 'vertical') {
        return <div className="ml-4 flex h-6 w-px bg-border" />;
      }

      return (
        <div className="flex items-center">
          <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
        </div>
      );
    };

    if (orientation === 'vertical') {
      return (
        <div ref={ref} className={cn('flex flex-col', className)} {...props}>
          <div className="flex items-start">
            <div className={cn(stepVariants({ variant, size }))}>{renderStepIcon()}</div>
            <div className="ml-3 flex-1">
              {title && (
                <div className={cn(stepContentVariants({ variant }), 'text-sm font-medium')}>
                  {title}
                </div>
              )}
              {description && (
                <div className={cn(stepContentVariants({ variant: 'default' }), 'text-xs mt-1')}>
                  {description}
                </div>
              )}
            </div>
          </div>
          {renderConnector()}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex items-center', className)} {...props}>
        <div className="flex flex-col items-center">
          <div className={cn(stepVariants({ variant, size }))}>{renderStepIcon()}</div>
          <div className="mt-2 text-center">
            {title && (
              <div className={cn(stepContentVariants({ variant }), 'text-sm font-medium')}>
                {title}
              </div>
            )}
            {description && (
              <div className={cn(stepContentVariants({ variant: 'default' }), 'text-xs mt-1')}>
                {description}
              </div>
            )}
          </div>
        </div>
        {renderConnector()}
      </div>
    );
  },
);
Step.displayName = 'Step';

export { Steps, Step, stepsVariants, stepVariants };
