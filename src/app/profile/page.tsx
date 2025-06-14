"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    AlertTriangle,
    Briefcase,
    Building,
    CheckCircle,
    FileDigit,
    FileText,
    Key,
    Lock,
    Mail,
    PenTool,
    Shield,
    Trash,
    Upload,
    User,
    UserCheck,
    Users,
    XCircle,
} from "lucide-react"
import Image from "next/image"
import { useAuthContext } from "@/context/authContext"
import userRequest from "@/api/userRequest"
import { toastClientSuccess } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
    const { user, setUser } = useAuthContext();
    const [activeTab, setActiveTab] = useState("personal")
    const [isLoading, setIsLoading] = useState(false)

    const [newSignature, setNewSignature] = useState<File | null>(null)
    const [pfxFile, setPfxFile] = useState<File | null>(null)
    const [previewSignature, setPreviewSignature] = useState<string | null>(null)
    const [email, setEmail] = useState(user?.email || "")

    // Password state
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordError, setPasswordError] = useState("");


    const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setNewSignature(file)

            // Preview signature
            const reader = new FileReader()
            reader.onload = (event) => {
                if (event.target?.result) {
                    setPreviewSignature(event.target.result as string)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handlePfxUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setPfxFile(file)
        }
    }

    const handleSaveSignature = async () => {
        if (!newSignature) return
        const formData = new FormData()
        formData.append("file", newSignature)
        setIsLoading(true)
        await userRequest.updateImageSignature(formData).then((res) => {
            setUser({
                ...user!,
                imageSignature: res.data,
            })
            setPreviewSignature(null)
            toastClientSuccess("Cập nhật chữ ký thành công", "Chữ ký đã được cập nhật thành công và sẵn sàng sử dụng.")
        }).finally(() => {
            setIsLoading(false)
        })

    }

    const handleSavePfx = async () => {
        if (!pfxFile) return
        const formData = new FormData()
        formData.append("file", pfxFile)

        setIsLoading(true)
        await userRequest.updateDigitalCertificate(formData).then((res) => {
            setUser({
                ...user!,
                digitalCertificate: res.data,
            })
            setPfxFile(null)
            toastClientSuccess("Cập nhật chứng thư số thành công", "Chứng thư số đã được cập nhật thành công và sẵn sàng sử dụng.")
        }).finally(() => setIsLoading(false))
    }

    const handleChangePassword = async () => {
        setIsLoading(true)
        await userRequest.updatePassword({ oldPassword: currentPassword, newPassword: newPassword }).then(() => {
            toastClientSuccess("Đổi mật khẩu thành công", "Mật khẩu của bạn đã được cập nhật thành công.")
        }).finally(() => setIsLoading(false))
    }

    const handleDeleteImageSignature = async () => {
        setIsLoading(true)
        await userRequest.updateImageSignature(new FormData()).then((res) => {
            setUser({
                ...user!,
                imageSignature: res.data,
            })
            setPreviewSignature(null)
            toastClientSuccess("Xóa chữ ký thành công", "Chữ ký đã được xóa thành công và sẵn sàng sử dụng.")
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const handleDeleteDigitalCertificate = async () => {
        setIsLoading(true)
        await userRequest.updateDigitalCertificate(new FormData()).then(() => {
            setUser({
                ...user!,
                digitalCertificate: undefined,
            })
            toastClientSuccess("Xóa chứng thư số thành công", "Chứng thư số đã được xóa thành công và sẵn sàng sử dụng.")
        }).finally(() => setIsLoading(false))
    }
    const handleUpdateEmail = async () => {
        setIsLoading(true)
        await userRequest.updateEmail(email).then(() => {
            setUser({
                ...user!,
                email: email,
            })
            toastClientSuccess("Email đã được cập nhật", "Email của bạn đã được cập nhật thành công.")
        }).finally(() => setIsLoading(false))
    }

    if (!user) {
        return (
            <div className="container mx-auto py-6 px-4 md:px-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                        <p>Đang tải thông tin...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/4">
                    <Card>
                        <CardContent>
                            <div className="flex flex-col items-center">
                                <h2 className="text-xl font-bold">{user.fullname}</h2>
                                <p className="text-muted-foreground">{user.positionName}</p>
                                <p className="text-sm text-muted-foreground">{user.departmentName}</p>

                                <Separator className="my-4" />

                                <div className="w-full space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{user.roleName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{user.departmentName}</span>
                                    </div>
                                    {user.groups && user.groups.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Nhóm ({user.groups.length})</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1 ml-6">
                                                {user.groups.map((group) => (
                                                    <Badge
                                                        key={group}
                                                        variant="outline"
                                                        className="text-xs px-2 py-1 bg-blue-100 text-blue-800 border-blue-200"
                                                    >
                                                        {group}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Separator className="my-4" />

                                <div className="w-full space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Chữ ký hình ảnh</span>
                                        {user.imageSignature ? (
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                Có
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full flex items-center gap-1">
                                                <XCircle className="h-3 w-3" />
                                                Chưa có
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Chứng thư số</span>
                                        {user.digitalCertificate ? (
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                Đang hoạt động
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center gap-1">
                                                <XCircle className="h-3 w-3" />
                                                Chưa hoạt động
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:w-3/4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="personal">
                                <User className="mr-2 h-4 w-4" />
                                Thông tin cá nhân
                            </TabsTrigger>
                            <TabsTrigger value="signature">
                                <PenTool className="mr-2 h-4 w-4" />
                                Thiết lập chữ ký
                            </TabsTrigger>
                            <TabsTrigger value="account">
                                <Lock className="mr-2 h-4 w-4" />
                                Tài khoản & Mật khẩu
                            </TabsTrigger>
                        </TabsList>

                        {/* Tab Thông tin cá nhân */}
                        <TabsContent value="personal">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin cá nhân</CardTitle>
                                    <CardDescription>Thông tin cá nhân của bạn trong hệ thống.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullname">Họ và tên</Label>
                                            <div className="relative">
                                                <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input id="fullname" value={user.fullname} className="pl-8" disabled />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input id="email" value={user.email} className="pl-8" disabled />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="position">Chức vụ</Label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input id="position" value={user.positionName ?? ""} className="pl-8" disabled />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Phòng ban</Label>
                                            <div className="relative">
                                                <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input id="department" value={user.departmentName ?? ""} className="pl-8" disabled />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-medium text-blue-800 mb-1">Thông tin chỉ đọc</h4>
                                            <p className="text-sm text-blue-700">
                                                Thông tin cá nhân được quản lý bởi phòng Nhân sự. Vui lòng liên hệ phòng Nhân sự để thay đổi
                                                thông tin này.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <p className="text-sm text-muted-foreground">
                                        Để thay đổi thông tin cá nhân, vui lòng liên hệ phòng Nhân sự qua email: hr@company.com
                                    </p>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Tab Thiết lập chữ ký */}
                        <TabsContent value="signature">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thiết lập chữ ký</CardTitle>
                                    <CardDescription>Quản lý chữ ký và chứng thư số của bạn để ký văn bản điện tử.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Chữ ký hình ảnh</h3>
                                        <div className="border rounded-md p-4">
                                            {user.imageSignature ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-gray-50 border rounded-md p-4 mb-4 w-full flex justify-center">
                                                        <Image
                                                            src={user.imageSignature || "/placeholder.svg"}
                                                            alt="Chữ ký hiện tại"
                                                            width={400}
                                                            height={200}
                                                            className="max-h-[150px] object-contain"
                                                            priority
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="destructive" size="sm">
                                                                    <Trash className="mr-2 h-4 w-4" />
                                                                    Xóa chữ ký
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Xác nhận xóa chữ ký</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Bạn có chắc chắn muốn xóa chữ ký này? Hành động này không thể hoàn tác.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={handleDeleteImageSignature}>
                                                                        Xác nhận xóa
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center p-6 text-center">
                                                    <PenTool className="h-12 w-12 text-muted-foreground mb-4" />
                                                    <p className="mb-2">Bạn chưa có chữ ký</p>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        Tải lên hình ảnh chữ ký để sử dụng trong các văn bản điện tử
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="new-signature">Tải lên chữ ký mới</Label>
                                            <Input id="new-signature" type="file" accept="image/*" onChange={handleSignatureUpload} />
                                            <p className="text-xs text-muted-foreground">
                                                Định dạng JPG, PNG hoặc GIF. Nên sử dụng hình ảnh chữ ký trên nền trắng.
                                            </p>
                                        </div>

                                        {previewSignature && (
                                            <div className="border rounded-md p-4">
                                                <h4 className="text-sm font-medium mb-2">Xem trước chữ ký mới</h4>
                                                <div className="bg-gray-50 border rounded-md p-4 mb-4 w-full flex justify-center">
                                                    <Image
                                                        src={previewSignature || "/placeholder.svg"}
                                                        alt="Xem trước chữ ký"
                                                        width={400}
                                                        height={200}
                                                        className="max-h-[150px] object-contain"
                                                        priority
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" onClick={() => setPreviewSignature(null)}>
                                                        Hủy
                                                    </Button>
                                                    <Button onClick={handleSaveSignature} disabled={isLoading}>
                                                        {isLoading ? "Đang lưu..." : "Lưu chữ ký mới"}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Chứng thư số</h3>
                                        <div className="border rounded-md p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-blue-100 p-3 rounded-full">
                                                    <FileDigit className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium mb-1">Tải lên file chứng thư số (.pfx)</h4>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        Tải lên file PFX chứa chứng thư số của bạn để ký văn bản điện tử theo quy định.
                                                    </p>

                                                    {user.digitalCertificate ? (
                                                        <div className="flex items-center justify-between gap-2 mb-4 p-2 bg-green-50 border border-green-200 rounded-md">
                                                            <div className="flex items-center gap-2">
                                                                <Shield className="h-4 w-4 text-green-600" />
                                                                <div className="text-sm">
                                                                    <span className="font-medium">Đã cài đặt chứng thư số</span>
                                                                </div>
                                                            </div>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                                                    >
                                                                        <Trash className="mr-2 h-4 w-4" />
                                                                        Xóa
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Xác nhận xóa chứng thư số</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Bạn có chắc chắn muốn xóa chứng thư số này? Sau khi xóa, bạn sẽ không thể ký văn
                                                                            bản điện tử cho đến khi tải lên chứng thư số mới.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={handleDeleteDigitalCertificate}>
                                                                            Xác nhận xóa
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
                                                            <AlertTriangle className="h-4 w-4 text-red-600" />
                                                            <div className="text-sm">
                                                                <span className="font-medium">Chứng thư số chưa hoạt động</span>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Vui lòng tải lên file chứng thư số để ký văn bản điện tử
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="space-y-2">
                                                        <Input id="pfx-file" type="file" accept=".pfx" onChange={handlePfxUpload} />
                                                        <p className="text-xs text-muted-foreground">
                                                            Chỉ chấp nhận file .pfx. Đảm bảo bạn nhớ mật khẩu của file chứng thư số.
                                                        </p>
                                                    </div>

                                                    {pfxFile && (
                                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="h-4 w-4 text-blue-600" />
                                                                <div>
                                                                    <p className="text-sm font-medium">{pfxFile.name}</p>
                                                                    <p className="text-xs text-muted-foreground">{(pfxFile.size / 1024).toFixed(2)} KB</p>
                                                                </div>
                                                            </div>
                                                            <Button size="sm" onClick={handleSavePfx} disabled={isLoading}>
                                                                <Upload className="mr-2 h-4 w-4" />
                                                                {isLoading ? "Đang tải..." : "Tải lên"}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
                                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-medium text-amber-800 mb-1">Lưu ý quan trọng</h4>
                                                <p className="text-sm text-amber-700">
                                                    Chứng thư số là tài sản cá nhân quan trọng. Không chia sẻ file PFX hoặc mật khẩu với người
                                                    khác. Hệ thống sẽ lưu trữ chứng thư số của bạn một cách an toàn và mã hóa.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab Tài khoản & Mật khẩu */}
                        <TabsContent value="account">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tài khoản & Mật khẩu</CardTitle>
                                    <CardDescription>Quản lý thông tin đăng nhập và bảo mật tài khoản của bạn.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Thông tin tài khoản</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="username">Tên đăng nhập</Label>
                                                <div className="relative">
                                                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input id="username" value={user.username} className="pl-8" disabled />
                                                </div>
                                                <p className="text-xs text-muted-foreground">Tên đăng nhập không thể thay đổi</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email-account">Email</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="email-account"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="pl-8"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button onClick={handleUpdateEmail} disabled={isLoading || email === user.email}>
                                                {isLoading ? "Đang cập nhật..." : "Cập nhật email"}
                                            </Button>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Đổi mật khẩu</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="current-password"
                                                        type="password"
                                                        className="pl-8"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-password">Mật khẩu mới</Label>
                                                <div className="relative">
                                                    <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="new-password"
                                                        type="password"
                                                        className="pl-8"
                                                        value={newPassword}
                                                        onChange={(e) => {
                                                            setNewPassword(e.target.value)
                                                            if (confirmPassword && e.target.value !== confirmPassword) {
                                                                setPasswordError("Mật khẩu mới và xác nhận mật khẩu không khớp")
                                                            } else {
                                                                setPasswordError("")
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                                                <div className="relative">
                                                    <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="confirm-password"
                                                        type="password"
                                                        className="pl-8"
                                                        value={confirmPassword}
                                                        onChange={(e) => {
                                                            setConfirmPassword(e.target.value)
                                                            if (newPassword && e.target.value !== newPassword) {
                                                                setPasswordError("Mật khẩu mới và xác nhận mật khẩu không khớp")
                                                            } else {
                                                                setPasswordError("")
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {passwordError && (
                                                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
                                                    {passwordError}
                                                </div>
                                            )}
                                            <Button onClick={handleChangePassword} disabled={isLoading || !!passwordError}>
                                                {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
