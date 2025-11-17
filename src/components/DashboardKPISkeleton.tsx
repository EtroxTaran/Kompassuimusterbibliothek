import { Skeleton } from './ui/skeleton';
import { Card, CardContent } from './ui/card';

export function DashboardKPISkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Icon */}
              <Skeleton className="h-12 w-12 rounded-lg" />

              {/* Label */}
              <Skeleton className="h-3 w-[120px]" />

              {/* Value */}
              <Skeleton className="h-8 w-[100px]" />

              {/* Trend */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-3 w-[60px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
