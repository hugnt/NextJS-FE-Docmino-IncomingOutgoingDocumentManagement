"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthContext } from "@/context/authContext"
import { getDirectoryIcon, getParentDirectoryIcon } from "@/lib/directoryHelper"
import { formatDate } from "@/lib/utils"
import { type DocumentDirectory, getDirectoryTypeName } from "@/types/DocumentDirectory"
import { Calendar, FileText, MoreVertical, PackageSearch, Pen, Trash } from "lucide-react"

interface DirectoryFolderProps {
    data: DocumentDirectory[]
    handleDetailClick: (detail: DocumentDirectory) => void
    handleEditClick: (detail: DocumentDirectory) => void
    handleDeleteClick: (detail: DocumentDirectory) => void
    loading?: boolean
}

export default function DirectoryFolder(props: DirectoryFolderProps) {
    const { data, handleDetailClick, handleEditClick, handleDeleteClick, loading = false } = props
    const {hasStoreDocumentRight} = useAuthContext();
    // Render loading skeletons
    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-5 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full mb-3" />
                            <Skeleton className="h-4 w-full mb-1" />
                            <div className="flex justify-between">
                                <Skeleton className="h-3 w-1/3" />
                                <Skeleton className="h-3 w-1/4" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    // Render empty state
    if (!data?.length) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="flex flex-col items-center justify-center py-6">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                        <PackageSearch className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Không có thư mục nào</h3>
                </div>
            </div>
        )
    }

    // Render directory cards
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((item) => (
                <Card
                    key={item.id}
                    className="gap-0 group cursor-pointer border border-gray-200 transition-all  rounded-sm
                                duration-300 hover:shadow-lg hover:scale-102 hover:border-gray-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center space-x-2">
                            <div className="transition-transform duration-300">
                                {getDirectoryIcon(item.type)}
                            </div>
                            <Badge variant="outline" className="bg-gray-50 font-medium">
                                {getDirectoryTypeName(item.type)}
                            </Badge>
                        </div>
                        {hasStoreDocumentRight&&<DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-70 hover:opacity-100"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onSelect={() => {
                                        setTimeout(() => {
                                            handleDetailClick(item)
                                        }, 0);
                                    }}>
                                    <PackageSearch className="mr-2 h-4 w-4" />
                                    Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => {
                                    setTimeout(() => {
                                        handleEditClick(item);
                                    }, 0);
                                }}>
                                    <Pen className="mr-2 h-4 w-4" />
                                    Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={() => {
                                        setTimeout(() => {
                                            handleDeleteClick(item)
                                        }, 0);
                                    }}
                                    className="text-red-600">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Xóa
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>}
                    </CardHeader>
                    <CardContent onClick={() => handleDetailClick(item)}
                        className="h-24 flex flex-col justify-between">
                        <div className="grid grid-rows-3 mb-2">
                            <CardTitle className="text-base line-clamp-2 group-hover:text-teal-700 transition-colors truncate">
                                {item.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 truncate">{item.description}</CardDescription>
                            {item.parentDirectoryId && <div className="flex items-center gap-2">
                                {getParentDirectoryIcon(item.type)}
                                <span className="text-xs text-muted-foreground truncate">{item.parentDirectoryName}</span>
                            </div>}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-gray-100 bottom-0">
                            <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{formatDate(item.createdAt)}</span>
                            </div>
                            <div className="flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                <span>{item.documentCount ?? 0} tài liệu</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
