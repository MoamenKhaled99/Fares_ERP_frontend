import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ className, children, ...props }) => (
  <div className={cn("rounded-lg border bg-white text-gray-950 shadow-sm", className)} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ className, children }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>
);

export const CardTitle = ({ className, children }) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}>{children}</h3>
);

export const CardContent = ({ className, children }) => (
  <div className={cn("p-6 pt-0", className)}>{children}</div>
);