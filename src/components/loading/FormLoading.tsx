import { Skeleton } from "@/components/ui/skeleton";

export default function FormLoading() {
    return (
        <div className="flex flex-col gap-6 p-4">
            <Skeleton className="h-6 w-2/3" /> {/* Title */}
            <Skeleton className="h-4 w-1/2" /> {/* Description */}

            <div className="space-y-4">
                <Skeleton className="h-10 w-full" /> {/* Input title */}
                <Skeleton className="h-10 w-full" /> {/* Select category */}
                <Skeleton className="h-10 w-full" /> {/* Input author */}
                <Skeleton className="h-10 w-full" /> {/* Input quantity */}
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <Skeleton className="h-10 w-24" /> {/* Close button */}
                <Skeleton className="h-10 w-32" /> {/* Save button */}
            </div>
        </div>
    );
}
