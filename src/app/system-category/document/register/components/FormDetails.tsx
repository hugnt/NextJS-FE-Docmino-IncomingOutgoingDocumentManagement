"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { DocType } from "@/types/Document";
import { defaultDocumentRegister, DocumentRegister } from "@/types/DocumentRegister";
import { FormMode, FormSetting, formSettingDefault } from "@/types/form";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormDetailProps {
    formSetting: FormSetting,
    setFormSetting: (setting: FormSetting) => void,
    data?: DocumentRegister,
    onSubmit?: (data: DocumentRegister) => void
}

export default function FormDetails(props: FormDetailProps) {
    const { formSetting = formSettingDefault, setFormSetting = () => { }, data, onSubmit = () => { } } = props;
    const form = useForm<DocumentRegister>({
        defaultValues: data ?? defaultDocumentRegister,
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
                        {formSetting.mode == FormMode.ADD && 'Thêm mới sổ đăng ký'}
                    </SheetTitle>
                    <SheetDescription>
                        {formSetting.mode == FormMode.EDIT && 'Cập nhật thông tin của sổ đăng ký đã chọn.'}
                        {formSetting.mode == FormMode.ADD && 'Thêm một sổ đăng ký mới bằng cách cung cấp thông tin cần thiết.'}
                        Nhấn lưu khi bạn hoàn tất.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form
                        id='document-register-form'
                        onSubmit={handleFormSubmit}
                        className='flex-1 space-y-5 px-4'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Tên sổ đăng ký</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Nhập tên sổ đăng ký' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='year'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Năm</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} placeholder='Nhập năm' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="registerType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loại sổ</FormLabel>
                                    <Select
                                        value={field.value !== undefined ? String(field.value) : undefined}
                                        onValueChange={val => field.onChange(Number(val) as DocType)}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Loại sổ" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={"0"}>Nháp</SelectItem>
                                            <SelectItem value={"1"}>Văn bản đến</SelectItem>
                                            <SelectItem value={"2"}>Văn bản đi</SelectItem>
                                            <SelectItem value={"3"}>Văn bản nội bộ đến</SelectItem>
                                            <SelectItem value={"4"}>Văn bản nội bộ đi</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                        <FormField
                            control={form.control}
                            name='isActive'
                            render={({ field }) => (
                                <FormItem className='space-y-1 flex items-center'>
                                    <FormControl>
                                        <Input type="checkbox"
                                            className='h-4 w-4'
                                            checked={field.value}
                                            onChange={e => field.onChange(e.target.checked)} />
                                    </FormControl>
                                    <FormMessage />
                                    <FormLabel>Đang sử dụng</FormLabel>

                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <SheetFooter className='gap-2'>
                    <SheetClose asChild>
                        <Button variant='outline'>Đóng</Button>
                    </SheetClose>
                    <Button form='document-register-form' type='submit'>
                        Lưu thay đổi
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}