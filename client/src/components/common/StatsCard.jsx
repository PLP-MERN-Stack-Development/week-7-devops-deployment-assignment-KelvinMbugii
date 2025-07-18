import React from 'react';
import { Card, CardContent } from '../ui/card';

const StatsCard = ({ title, value, icon, trend, className }) => {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1">{trend}</p>
            )}
          </div>
          {icon && (
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <div className="text-primary">{icon}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;