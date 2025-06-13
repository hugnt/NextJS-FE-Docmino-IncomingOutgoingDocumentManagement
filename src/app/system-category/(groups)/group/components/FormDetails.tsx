"use client"

import userRequest from "@/api/userRequest"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { defaultGroup, type Group, GroupRequest, GroupRole } from "@/types/Group"
import { UserLookup } from "@/types/User"
import { FormMode, type FormSetting, formSettingDefault } from "@/types/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Crown, Plus, Trash2, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

const groupSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Tên nhóm không được để trống"),
    members: z
        .array(
            z.object({
                userId: z.string().min(1, "Vui lòng chọn thành viên"),
                groupRole: z.nativeEnum(GroupRole),
                fullname: z.string(),
                departmentName: z.string(),
            }),
        )
        .optional(),
})

interface FormDetailProps {
    formSetting: FormSetting
    setFormSetting: (setting: FormSetting) => void
    data?: Group
    onSubmit?: (data: GroupRequest) => void
}

export default function FormDetails(props: FormDetailProps) {
    const { formSetting = formSettingDefault, setFormSetting = () => { }, data, onSubmit = () => { } } = props
    const [users, setUsers] = useState<UserLookup[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<Group>({
        resolver: zodResolver(groupSchema),
        defaultValues: data ?? defaultGroup,
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "members",
    })

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true)
            try {
                const res = await userRequest.lookupApprover()
                setUsers(
                    (res.data || []).map((u) => ({
                        id: u.id,
                        name: u.name,
                        departmentName: u.departmentName,
                    })),
                )
            } catch (error) {
                console.error("Error fetching users:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (formSetting.open) {
            fetchUsers()
        }
    }, [formSetting.open])

    useEffect(() => {
        if (data) {
            form.reset(data)
        } else {
            form.reset(defaultGroup)
        }
    }, [data, form])

    const handleFormSubmit = (formData: Group) => {
        const request: GroupRequest = {
            id: formData.id,
            name: formData.name,
            members: formData.members
        };

        onSubmit(request); 
        handleClose();
    }

    const handleClose = () => {
        setFormSetting({ ...formSetting, open: false })
        form.reset(defaultGroup)
    }

    const addMember = () => {
        append({
            userId: "",
            groupRole: GroupRole.Member,
            fullname: "",
            departmentName: "",
        })
    }

    const getSelectedUserIds = () => {
        return (
            form
                .watch("members")
                ?.map((m) => m.userId)
                .filter(Boolean) || []
        )
    }

    const getAvailableUsers = (currentUserId?: string) => {
        const selectedIds = getSelectedUserIds()
        return users.filter((user) => !selectedIds.includes(user.id) || user.id === currentUserId)
    }

    const getRoleLabel = (role: GroupRole) => {
        return role === GroupRole.Leader ? "Trưởng nhóm" : "Thành viên"
    }

    const getRoleIcon = (role: GroupRole) => {
        return role === GroupRole.Leader ? <Crown className="w-3 h-3" /> : <Users className="w-3 h-3" />
    }

    return (
        <Sheet
            open={formSetting.open}
            onOpenChange={(v) => {
                if (!v) handleClose()
            }}
        >
            <SheetContent onInteractOutside={(event) => event.preventDefault()} className="flex flex-col max-w-2xl">
                <SheetHeader className="text-left">
                    <SheetTitle>
                        {formSetting.mode === FormMode.EDIT && "Cập nhật nhóm"}
                        {formSetting.mode === FormMode.ADD && "Thêm mới nhóm"}
                    </SheetTitle>
                    <SheetDescription>
                        {formSetting.mode === FormMode.EDIT && "Cập nhật thông tin nhóm đã chọn. "}
                        {formSetting.mode === FormMode.ADD && "Thêm một nhóm mới bằng cách cung cấp thông tin cần thiết. "}
                        Nhấn lưu khi bạn hoàn tất.
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form id="group-form"
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="flex-1 space-y-5 px-4">
                        {/* Tên nhóm */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên nhóm *</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Nhập tên nhóm" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Thành viên */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel>Thành viên ({fields.length})</FormLabel>
                                <Button type="button" variant="outline" size="sm" onClick={addMember} disabled={isLoading}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm thành viên
                                </Button>
                            </div>

                            {fields.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Chưa có thành viên nào</p>
                                    <p className="text-sm">Nhấn {"Thêm thành viên"} để bắt đầu</p>
                                </div>
                            )}

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {fields.map((item, idx) => {
                                    const currentUserId = form.watch(`members.${idx}.userId`)
                                    const currentRole = form.watch(`members.${idx}.groupRole`)

                                    return (
                                        <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg bg-muted/30">
                                            <div className="flex-1 space-y-3">
                                                <FormField
                                                    control={form.control}
                                                    name={`members.${idx}.userId`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm">Chọn thành viên</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Chọn thành viên" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {getAvailableUsers(currentUserId).map((u) => (
                                                                        <SelectItem key={u.id} value={u.id}>
                                                                            {u.name}{" "}<span className="text-muted-foreground">({u.departmentName})</span>
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
                                                    name={`members.${idx}.groupRole`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm">Vai trò</FormLabel>
                                                            <Select value={field.value !== undefined ? String(field.value) : undefined}
                                                                onValueChange={val => field.onChange(Number(val) as GroupRole)}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Chọn vai trò" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value={"0"}>
                                                                        <div className="flex items-center gap-2">
                                                                            <Users className="w-4 h-4" />
                                                                            Thành viên
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value={"1"}>
                                                                        <div className="flex items-center gap-2">
                                                                            <Crown className="w-4 h-4" />
                                                                            Trưởng nhóm
                                                                        </div>
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <Badge variant={currentRole === GroupRole.Leader ? "default" : "secondary"} className="text-xs">
                                                    {getRoleIcon(currentRole)}
                                                    <span className="ml-1">{getRoleLabel(currentRole)}</span>
                                                </Badge>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => remove(idx)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </form>
                </Form>

                <SheetFooter className="gap-2 pt-4 border-t">
                    <SheetClose asChild>
                        <Button variant="outline">Đóng</Button>
                    </SheetClose>
                    <Button form="group-form" type="submit" disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
