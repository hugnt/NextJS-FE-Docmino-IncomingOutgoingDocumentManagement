import { Skeleton } from '../ui/skeleton'

export default function DialogLoading() {
    return (
        <>
            <Skeleton className="h-7 w-3/4 mb-3" />
            <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="space-y-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="space-y-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="col-span-2 space-y-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
                <Skeleton className="h-4 w-1/4" />
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="w-5 h-5 rounded-full" />
                        ))}
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </>
    )
}
