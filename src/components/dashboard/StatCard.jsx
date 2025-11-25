// src/components/dashboard/StatCard.jsx
import React from 'react';
import { Card, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUpIcon } from 'lucide-react';
import { formatNumber } from '@/lib/number.utils';

export const StatCard = ({ title, value, icon: Icon, trend, trendValue, footer, color = "blue", loading = false }) => {
    // Helper to format if value is a raw number, otherwise assume it's already formatted (like currency)
    const displayValue = typeof value === 'number' ? formatNumber(value) : value;

    return (
      <Card className="relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1 h-full bg-${color}-500`}></div>
        <CardHeader className="relative pb-2">
          <CardDescription className="text-sm font-medium pr-16">{title}</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums pr-16">
            {loading ? <Skeleton className="h-9 w-32" /> : displayValue}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          {trend && trendValue && (
            <div className="absolute right-4 top-20">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                <TrendingUpIcon className="size-3" />
                {trendValue}
              </Badge>
            </div>
          )}
        </CardHeader>
        {footer && (
          <CardFooter className="flex-col items-start gap-1 text-sm pt-0">
            <div className="text-muted-foreground">{footer}</div>
          </CardFooter>
        )}
      </Card>
    );
};