import { Skeleton } from './ui/skeleton';

export function CustomerListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card"
        >
          {/* Avatar */}
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />

          {/* Content */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <div className="flex gap-4">
              <Skeleton className="h-3 w-[150px]" />
              <Skeleton className="h-3 w-[120px]" />
            </div>
          </div>

          {/* Status Badge */}
          <Skeleton className="h-6 w-[80px] rounded-full flex-shrink-0" />

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
