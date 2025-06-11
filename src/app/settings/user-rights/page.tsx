"use client"

import PageHeader from "@/components/page/PageHeader"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { handleSuccessApi } from "@/lib/utils"
import type { UserDetail, UserRight } from "@/types/User"
import {
    Edit,
    Save,
    X,
    FileText,
    FileInput,
    FileOutput,
    Building,
    CheckCircle2,
    Archive,
    Users,
    Shield,
    Activity,
    ChartBarStacked,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import userRequest from "@/api/userRequest"


// Rights configuration with professional colors
const rightsConfig = [
    {
        key: "createIncomingDocumentRight" as keyof UserRight,
        label: "Tài liệu đến",
        icon: FileInput,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
    },
    {
        key: "createOutgoingDocumentRight" as keyof UserRight,
        label: "Tài liệu đi",
        icon: FileOutput,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
    },
    {
        key: "createInternalDocumentRight" as keyof UserRight,
        label: "Tài liệu nội bộ",
        icon: Building,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
    },
    {
        key: "initialConfirmProcessRight" as keyof UserRight,
        label: "Trình ký văn bản",
        icon: CheckCircle2,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
    },
    {
        key: "processManagerRight" as keyof UserRight,
        label: "Quản lý quy trình",
        icon: Shield,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
    },
    {
        key: "manageCategories" as keyof UserRight,
        label: "Quản lý các danh mục",
        icon: ChartBarStacked,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
    },
    {
        key: "storeDocumentRight" as keyof UserRight,
        label: "Lưu trữ tài liệu",
        icon: Archive,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
    },
]

export default function DocumentSpecialistRightsPage() {
    const [data, setData] = useState<UserDetail[]>([])
    const [editingData, setEditingData] = useState<UserDetail[]>([])
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [updating, setUpdating] = useState(false)

    // Filter only document specialists (roleId = 2)
    const documentSpecialists = data.filter((user) => user.roleId === 2 && !user.isDeleted)

    useEffect(() => {
        handleGetList()
    }, [])

    const handleGetList = useCallback(() => {
        setLoading(true)
        userRequest
            .getByFilter({ pageNumber: 1, pageSize: 100 })
            .then((res) => {
                const users = res.data || []
                setData(users)
                setEditingData(users)
            })
            .catch((error) => {
                console.error("Error fetching users:", error)
                setData([])
                setEditingData([])
            })
            .finally(() => setLoading(false))
    }, [])

    const handleEdit = useCallback(() => {
        setIsEditing(true)
        setEditingData([...data])
    }, [data])

    const handleCancel = useCallback(() => {
        setIsEditing(false)
        setEditingData([...data])
    }, [data])

    const handleRightChange = useCallback((userId: string, rightKey: keyof UserRight, value: boolean) => {
        setEditingData((prev) =>
            prev.map((user) =>
                user.id === userId
                    ? {
                        ...user,
                        [rightKey]: value,
                    }
                    : user,
            ),
        )
    }, [])

    const handleUpdate = useCallback(() => {
        const documentSpecialistsEditing = editingData.filter((user) => user.roleId === 2 && !user.isDeleted)

        const userRights: UserRight[] = documentSpecialistsEditing.map((user) => ({
            id: user.id,
            createIncomingDocumentRight: user.createIncomingDocumentRight,
            createOutgoingDocumentRight: user.createOutgoingDocumentRight,
            createInternalDocumentRight: user.createInternalDocumentRight,
            initialConfirmProcessRight: user.initialConfirmProcessRight,
            processManagerRight: user.processManagerRight,
            storeDocumentRight: user.storeDocumentRight,
            manageCategories: user.manageCategories,
        }))

        setUpdating(true)
        userRequest
            .updateRights({ userRights })
            .then((res) => {
                handleSuccessApi({
                    title: "Cập nhật quyền thành công!",
                    message: res.message || "Đã cập nhật quyền cho chuyên viên văn thư",
                })
                setData([...editingData])
                setIsEditing(false)
            })
            .catch((error) => {
                console.error("Error updating user rights:", error)
            })
            .finally(() => setUpdating(false))
    }, [editingData])

    const getInitials = (fullname: string) => {
        return fullname
            .split(" ")
            .map((name) => name.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const RightCheckbox = ({
        userId,
        rightKey,
        checked,
        disabled,
        config,
    }: {
        userId: string
        rightKey: keyof UserRight
        checked: boolean
        disabled: boolean
        config: (typeof rightsConfig)[0]
    }) => (
        <div className="flex justify-center px-2 py-1">
            <div
                className={`p-3 rounded-lg border transition-all duration-200 ${config.bgColor} ${config.borderColor} ${isEditing ? "hover:shadow-sm" : ""
                    }`}
            >
                <Checkbox
                    checked={checked}
                    onCheckedChange={(value) => handleRightChange(userId, rightKey, !!value)}
                    disabled={disabled}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 h-5 w-5"
                />
            </div>
        </div>
    )

    const TableSkeleton = () => (
        <Card className="border border-gray-200">
            <CardContent className="p-8">
                <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex space-x-6 items-center">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-3 w-[150px]" />
                            </div>
                            {Array.from({ length: 6 }).map((_, j) => (
                                <Skeleton key={j} className="h-10 w-10 rounded-lg" />
                            ))}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="space-y-8 p-8 max-w-7xl mx-auto">
                    <PageHeader title="Quản lý quyền Chuyên viên văn thư" subtitle="Cấp quyền tài liệu cho chuyên viên văn thư" />
                    <TableSkeleton />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="space-y-4 p-4 max-w-7xl mx-auto">
                <PageHeader title="Quản lý quyền Chuyên viên văn thư" subtitle="Cấp quyền tài liệu cho chuyên viên văn thư">
                    <div className="flex space-x-3">
                        {!isEditing ? (
                            <Button onClick={handleEdit} className="space-x-2 bg-blue-600 hover:bg-blue-700">
                                <Edit size={18} />
                                <span>Chỉnh sửa</span>
                            </Button>
                        ) : (
                            <>
                                <Button onClick={handleCancel} variant="outline" className="space-x-2 border-gray-300">
                                    <X size={18} />
                                    <span>Hủy</span>
                                </Button>
                                <Button
                                    onClick={handleUpdate}
                                    disabled={updating}
                                    className="space-x-2 bg-green-600 hover:bg-green-700"
                                >
                                    <Save size={18} />
                                    <span>{updating ? "Đang cập nhật..." : "Cập nhật"}</span>
                                </Button>
                            </>
                        )}
                    </div>

                </PageHeader>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border border-gray-200 bg-white">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Tổng chuyên viên</p>
                                    <p className="text-2xl font-bold text-gray-900">{documentSpecialists.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 bg-white">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <Activity className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Đang hoạt động</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {documentSpecialists.filter((u) => !u.isDeleted).length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 bg-white">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <Shield className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Loại quyền</p>
                                    <p className="text-2xl font-bold text-gray-900">6</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border border-gray-200 bg-gray-50 gap-0">
                    <CardHeader className="bg-gray-50 border-b border-gray-200 ">
                        <CardTitle className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Shield className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex items-center ">
                                <span className="text-gray-900 ">
                                    Bảng phân quyền
                                    {isEditing && (
                                        <Badge variant="secondary" className="ms-2 text-xs bg-amber-100 text-amber-800 border-amber-200">
                                            <Edit size={12} className="mr-1" />
                                            Đang chỉnh sửa
                                        </Badge>
                                    )}
                                </span>
                            </div>
                        </CardTitle>
                        <CardDescription className="text-gray-600 mt-2">
                            Quản lý quyền truy cập tài liệu cho từng chuyên viên văn thư
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 border-b border-gray-200">
                                        <TableHead className="w-[280px] font-semibold text-gray-900 px-8 py-4">
                                            Thông tin người dùng
                                        </TableHead>
                                        {rightsConfig.map((config) => (
                                            <TableHead key={config.key} className="text-center font-semibold min-w-[140px] px-4 py-4">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <div className="p-2 bg-gray-100 rounded-lg">
                                                        <config.icon className={`h-4 w-4 ${config.color}`} />
                                                    </div>
                                                    <span className="text-xs leading-tight text-gray-700">{config.label}</span>
                                                </div>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documentSpecialists.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-16">
                                                <div className="flex flex-col items-center space-y-4 text-gray-500">
                                                    <div className="p-4 bg-gray-100 rounded-full">
                                                        <Users className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                    <p className="text-lg font-medium">Không có chuyên viên văn thư nào trong hệ thống</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        documentSpecialists.map((user, index) => {
                                            const editingUser = editingData.find((u) => u.id === user.id) || user
                                            return (
                                                <TableRow
                                                    key={user.id}
                                                    className={`hover:bg-gray-50 transition-colors border-b border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                                        }`}
                                                >
                                                    <TableCell className="px-8 py-6">
                                                        <div className="flex items-center space-x-4">
                                                            <Avatar className="h-12 w-12 border-2 border-gray-200">
                                                                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                                                                    {getInitials(user.fullname)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="space-y-1">
                                                                <div className="font-semibold text-gray-900">{user.fullname}</div>
                                                                <div className="text-sm text-gray-600">@{user.username}</div>
                                                                <div className="text-xs text-gray-500">{user.email}</div>
                                                                <Badge variant="outline" className="text-xs mt-2 border-gray-300 text-gray-600">
                                                                    {user.departmentName}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    {rightsConfig.map((config) => (
                                                        <TableCell key={config.key} className="px-4 py-6">
                                                            <RightCheckbox
                                                                userId={user.id}
                                                                rightKey={config.key}
                                                                checked={!!editingUser[config.key]}
                                                                disabled={!isEditing}
                                                                config={config}
                                                            />
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            )
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {documentSpecialists.length > 0 && (
                    <Card className="bg-blue-50 border border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-start space-x-3 text-sm text-blue-800">
                                <div className="p-1 bg-blue-100 rounded">
                                    <FileText className="h-4 w-4 flex-shrink-0" />
                                </div>
                                <div>
                                    <p className="font-semibold">Lưu ý quan trọng:</p>
                                    <ul className="mt-2 space-y-1 text-xs text-blue-700">
                                        <li>• Chỉ hiển thị người dùng có vai trò {"Chuyên viên văn thư"} và đang hoạt động</li>
                                        <li>• Thay đổi quyền sẽ có hiệu lực ngay sau khi cập nhật</li>
                                        <li>• Vui lòng kiểm tra kỹ trước khi lưu thay đổi</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
