import { Card, CardContent } from "@/components/ui/card"

export default function DocumentFormSkeleton() {
  return (
    <div>
      <div className="flex-1 space-y-5">
        {/* PageHeader Skeleton */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              {/* Title skeleton */}
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
              {/* Subtitle skeleton */}
              <div className="h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
            </div>
            {/* Button skeleton */}
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Card Skeleton */}
        <Card className="py-3">
          <CardContent className="pt-0 px-3">
            {/* Tabs Skeleton */}
            <div className="space-y-4">
              {/* TabsList Skeleton */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                <div className="h-9 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-9 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-9 w-28 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* TabsContent Skeleton */}
              <div className="space-y-6 pt-4">
                {/* Form Fields Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Field 1 */}
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  {/* Field 2 */}
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  {/* Field 3 */}
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  {/* Field 4 */}
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Large text area field */}
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-24 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* File attachment section */}
                <div className="space-y-4">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="h-12 w-12 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Additional form rows */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
