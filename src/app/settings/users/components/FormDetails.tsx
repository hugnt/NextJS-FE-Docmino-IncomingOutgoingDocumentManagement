"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { defaultUserDetail, type UserDetail } from "@/types/User"
import { FormMode, type FormSetting, formSettingDefault } from "@/types/form"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import positionRequest from "@/api/positionRequest"
import { PositionLookup } from "@/types/Position"

interface FormDetailProps {
    formSetting: FormSetting
    setFormSetting: (setting: FormSetting) => void
    data?: UserDetail
    onSubmit?: (data: UserDetail) => void
}

const roles = [
    { id: 1, name: "Quản trị viên" },
    { id: 2, name: "Chuyên viên văn thư" },
    { id: 3, name: "Người kí / duyệt" },
]

export default function FormDetails(props: FormDetailProps) {
    const {
        formSetting = formSettingDefault,
        setFormSetting = () => { },
        data,
        onSubmit = () => { },
    } = props
    const [positions, setPositions] = useState<PositionLookup[]>([])
    const form = useForm<UserDetail>({
        defaultValues: data ?? defaultUserDetail,
    })

    const watchedRoleId = form.watch("roleId")
    const showDocumentRights = watchedRoleId === 1 || watchedRoleId === 2

    useEffect(() => {
        positionRequest.lookup().then(res => {
            setPositions(res.data || [])
        })
    }, [])

    useEffect(() => {
        if (data) form.reset(data)
    }, [data])

    useEffect(() => {
        if (watchedRoleId === 1 || watchedRoleId === 2) {
            form.setValue("createIncomingDocumentRight", true)
            form.setValue("createOutgoingDocumentRight", true)
            form.setValue("createInternalDocumentRight", true)
            form.setValue("initialConfirmProcessRight", true)
            form.setValue("processManagerRight", true)
            form.setValue("storeDocumentRight", true)
            form.setValue("manageCategories", true)
        }
    }, [watchedRoleId, form])

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        form.handleSubmit((formData) => {
            // If document rights are not shown, set them all to false
            if (!showDocumentRights) {
                const updatedData = {
                    ...formData,
                    createIncomingDocumentRight: false,
                    createOutgoingDocumentRight: false,
                    createInternalDocumentRight: false,
                    initialConfirmProcessRight: false,
                    processManagerRight: false,
                    storeDocumentRight: false,
                    manageCategories: false,
                }
                onSubmit(updatedData)
            } else {
                onSubmit(formData)
            }
        })()
    }

    return (
        <Sheet
            open={formSetting.open}
            onOpenChange={(v) => {
                setFormSetting({ ...formSetting, open: v })
                form.reset()
            }}
        >
            <SheetContent onInteractOutside={(event) => event.preventDefault()} className="flex flex-col max-w-lg">
                <SheetHeader className="text-left">
                    <SheetTitle>
                        {formSetting.mode == FormMode.EDIT && "Cập nhật."}
                        {formSetting.mode == FormMode.ADD && "Thêm mới"}
                    </SheetTitle>
                    <SheetDescription>
                        {formSetting.mode == FormMode.EDIT && "Cập nhật thông tin bằng cách cung cấp các thông tin cần thiết."}
                        {formSetting.mode == FormMode.ADD && "Thêm bản ghi mới bằng cách cung cấp các thông tin cần thiết."}
                        Nhấn lưu khi bạn hoàn tất.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                    <Form {...form}>
                        <form id="tasks-form" onSubmit={handleFormSubmit} className="space-y-5 px-4">
                            <FormField
                                control={form.control}
                                name="fullname"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Họ và tên</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Nhập họ và tên" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Tên đăng nhập</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Nhập tên đăng nhập" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {formSetting.mode == FormMode.ADD && <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Mật khẩu</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Mật khẩu" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />}

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" placeholder="Nhập địa chỉ email" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="roleId"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Vai trò</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Chọn vai trò" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={role.id.toString()}>
                                                        {role.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="positionId"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Chức vụ</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Chọn chức vụ" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {positions.map((position) => (
                                                    <SelectItem key={position.id} value={position.id.toString()}>
                                                        {position.name} {" - "} {position.departmentName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {showDocumentRights && (
                                <div className="space-y-4">
                                    <div className="border-t pt-4">
                                        <h3 className="text-sm font-medium mb-3">Quyền Tài liệu</h3>
                                        <div className="space-y-3">
                                            <FormField
                                                control={form.control}
                                                name="createIncomingDocumentRight"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel className="text-sm font-normal">Quyền tạo tài liệu đến</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="createOutgoingDocumentRight"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel className="text-sm font-normal">Quyền tạo tài liệu đi</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="createInternalDocumentRight"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel className="text-sm font-normal">Quyền tạo tài liệu nội bộ</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="initialConfirmProcessRight"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel className="text-sm font-normal">Quyền trình ký văn bản</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="processManagerRight"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel className="text-sm font-normal">Quyền quản lý quy trình</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="storeDocumentRight"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel className="text-sm font-normal">Quyền lưu trữ tài liệu</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="manageCategories"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel className="text-sm font-normal">Quản lý danh mục</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </Form>
                </div>
                <SheetFooter className="gap-2">
                    <SheetClose asChild>
                        <Button variant="outline">Đóng</Button>
                    </SheetClose>
                    <Button form="tasks-form" type="submit">
                        Lưu thay đổi
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
