"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { defaultOrganization, Organization } from "@/types/Organization";
import { FormMode, FormSetting, formSettingDefault } from "@/types/form";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormDetailProps {
    formSetting: FormSetting,
    setFormSetting: (setting: FormSetting) => void,
    data?: Organization,
    onSubmit?: (data: Organization) => void
}

export default function FormDetails(props: FormDetailProps) {
    const { formSetting = formSettingDefault, setFormSetting = () => { }, data, onSubmit = () => { } } = props;
    const form = useForm<Organization>({
        defaultValues: data ?? defaultOrganization,
    })

    useEffect(() => {
        if (data) form.reset(data);
    }, [data])

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
    }

    return (
        <Sheet
            open={formSetting.open}
            onOpenChange={(v) => {
                setFormSetting({ ...formSetting, open: v })
                form.reset()
            }}>
            <SheetContent
                onInteractOutside={event => event.preventDefault()}
                className='flex flex-col'>
                <SheetHeader className='text-left'>
                    <SheetTitle>
                        {formSetting.mode == FormMode.EDIT && 'Cập nhật thông tin'}
                        {formSetting.mode == FormMode.ADD && 'Thêm mới tổ chức'}
                    </SheetTitle>
                    <SheetDescription>
                        {formSetting.mode == FormMode.EDIT && 'Cập nhật thông tin của tổ chức đã chọn.'}
                        {formSetting.mode == FormMode.ADD && 'Thêm một tổ chức mới bằng cách cung cấp thông tin cần thiết.'}
                        Nhấn lưu khi bạn hoàn tất.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form
                        id='organization-form'
                        onSubmit={handleFormSubmit}
                        className='flex-1 space-y-5 px-4'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Tên tổ chức</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Nhập tên tổ chức' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='phoneNumber'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Số điện thoại</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Nhập số điện thoại' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Nhập email' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='contactPersonName'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Người liên hệ</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Nhập tên người liên hệ' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder='Nhập mô tả' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <SheetFooter className='gap-2'>
                    <SheetClose asChild>
                        <Button variant='outline'>Đóng</Button>
                    </SheetClose>
                    <Button form='organization-form' type='submit'>
                        Lưu thay đổi
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}