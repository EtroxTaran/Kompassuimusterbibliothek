import { Skeleton } from './ui/skeleton';

export function FormLoadingSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="space-y-2">
          {/* Label */}
          <Skeleton className="h-3 w-[80px]" />
          
          {/* Input field */}
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}

      {/* Button */}
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 w-[140px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
    </div>
  );
}
