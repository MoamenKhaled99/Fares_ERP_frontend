import React from 'react';
import { cn } from '../../lib/utils';

const Badge = ({ variant = "default", children, className }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
    outline: "text-gray-950 border border-gray-200"
  };
  return (
    <div className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", 
      variants[variant], 
      className
    )}>
      {children}
    </div>
  );
};

export default Badge;