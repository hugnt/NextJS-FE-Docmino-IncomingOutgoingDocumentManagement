"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import DirectoryProvider, { useDirectoryContext } from "@/context/directoryContext"
import { cn } from "@/lib/utils"
import { DirectoryTreeItem, DirectoryType } from "@/types/DocumentDirectory"
import { Archive, ChevronDown, ChevronLeft, ChevronRight, Folder, FolderTree, Home, Menu, Package, Warehouse } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { PARAM, PATH } from "@/constants/paths"


function ArchiveSidebar({
  children,
}: {
  children: React.ReactNode
}) {
  const { tree, loadingTree } = useDirectoryContext();
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Get warehouses (top level items)
  const warehouses = tree.filter((item) => item.type === DirectoryType.Inventory)

  const getChildren = (parentId: string) => {
    return tree.filter((item) => item.parentDirectoryId === parentId)
  }

  // Toggle expanded state
  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  // Get icon for item type
  const getIcon = (type: DirectoryType) => {
    switch (type) {
      case DirectoryType.Inventory:
        return <Warehouse className="h-4 w-4 text-blue-600" />
      case DirectoryType.Sheft:
        return <Archive className="h-4 w-4 text-purple-600" />
      case DirectoryType.Box:
        return <Package className="h-4 w-4 text-green-600" />
      default:
        return <Folder className="h-4 w-4 text-gray-600" />
    }
  }

  // Handle item click for navigation
  const handleItemClick = (item: DirectoryTreeItem) => {
    switch (item.type) {
      case DirectoryType.Inventory:
        router.push(`${PATH.SystemCategoryStorageSheft}?${PARAM.INVENROTY_ID}=${item.id}`)
        break
      case DirectoryType.Sheft:
        router.push(`${PATH.SystemCategoryStorageBox}?${PARAM.SHEFT_ID}=${item.id}`)
        break
      case DirectoryType.Box:
        router.push(`${PATH.SystemCategoryStorageDossier}?${PARAM.BOX_ID}=${item.id}`)
        break
    }
  }

  // Auto-expand based on current path
  useEffect(() => {
    const newExpanded = new Set<string>()

    // Auto-expand relevant items based on current path
    if (
      pathname.includes(PATH.SystemCategoryStorageSheft) ||
      pathname.includes(PATH.SystemCategoryStorageBox) ||
      pathname.includes(PATH.SystemCategoryStorageDossier)
    ) {
      // Expand all warehouses to show shelves
      warehouses.forEach((warehouse) => {
        newExpanded.add(warehouse.id)
      })
    }

    if (pathname.includes(PATH.SystemCategoryStorageBox) || pathname.includes(PATH.SystemCategoryStorageDossier)) {
      // Expand all shelves to show boxes
      tree
        .filter((item) => item.type === DirectoryType.Sheft)
        .forEach((shelf) => {
          newExpanded.add(shelf.id)
        })
    }

    setExpandedItems(newExpanded)
  }, [pathname])

  // Render tree item
  const renderTreeItem = (item: DirectoryTreeItem, level = 0) => {
    const children = getChildren(item.id)
    const hasChildren = children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const paddingLeft = level * 16

    return (
      <div key={item.id} className="w-full">
        <div
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer group"
          style={{ paddingLeft: `${paddingLeft + 8}px` }}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(item.id)
              }}
            >
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          ) : (
            <div className="w-4" />
          )}

          <div className="flex items-center gap-2 flex-1 min-w-0" onClick={() => handleItemClick(item)}>
            {getIcon(item.type)}
            <span className="text-sm font-medium truncate">{item.name}</span>
            <Badge variant="secondary" className="text-xs ml-auto">
              {item.documentCount}
            </Badge>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2">{children.map((child) => renderTreeItem(child, level + 1))}</div>
        )}
      </div>
    )
  }


  return (
    <div className="flex min-h-screen">
      <div className={`${isSidebarOpen ? "w-80" : "w-0"} transition-all duration-300 bg-white relative `}>
        <Card className="p-0 gap-0  rounded-r-none rounded-l-lg  bg-white border border-r-0 shadow-sm overflow-hidden h-full ">
          <CardHeader className="p-5 gap-0  bg-white h-16 flex items-center border-b border-r">
            <CardTitle className={cn("text-lg flex items-center gap-2 transition-opacity duration-1000",
              isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none duration-0")}>
              <FolderTree className="h-5 w-5 text-teal-600" />
              Cây thư mục
            </CardTitle>
            <Button variant="outline" size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={cn("absolute z-[49]", isSidebarOpen ? "right-4" : "right-[-20px]")}>
              {!isSidebarOpen ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent className={cn("p-0",
            isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none duration-0")}>
            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="px-2 space-y-1">
                {/* Root navigation */}
                <div
                  className="mt-2 flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => router.push(PATH.SystemCategoryStorageInventory)}
                >
                  <Home className="h-4 w-4 text-teal-600" />
                  <span className="text-sm font-medium">Tất cả kho lưu trữ</span>
                </div>
                <Separator className="my-2" />
                {loadingTree ? (
                  // Loading skeleton
                  <div className="space-y-1">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-2 p-2">
                        <Skeleton className="h-6 w-6 rounded" />
                        <div className="flex items-center gap-2 flex-1">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-4 flex-1" />
                          <Skeleton className="h-4 w-8 rounded-full" />
                        </div>
                      </div>
                    ))}
                    {/* Nested skeleton items */}
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={`nested-${index}`} className="flex items-center gap-2 p-2 ml-6">
                        <div className="w-6" />
                        <div className="flex items-center gap-2 flex-1">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-4 flex-1" />
                          <Skeleton className="h-4 w-6 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  warehouses.map((warehouse) => renderTreeItem(warehouse))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="flex-1 overflow-hidden border border-l-0 rounded-r-lg">{children}</div>
    </div>
  )
}



export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <DirectoryProvider>
      <ArchiveSidebar>
        {children}
      </ArchiveSidebar>
    </DirectoryProvider>
  );
}