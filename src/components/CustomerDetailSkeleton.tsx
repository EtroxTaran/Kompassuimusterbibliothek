import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

export function CustomerDetailSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Skeleton className="h-20 w-20 rounded-full flex-shrink-0" />

          {/* Header info */}
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-[250px]" />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-5 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-[100px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex gap-3">
        <Skeleton className="h-10 w-[120px]" />
        <Skeleton className="h-10 w-[120px]" />
        <Skeleton className="h-10 w-[120px]" />
      </CardFooter>
    </Card>
  );
}
