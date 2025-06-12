"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { defaultStoragePeriod, StoragePeriod } from "@/types/StoragePeriod";
import { FormMode, FormSetting, formSettingDefault } from "@/types/form";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormDetailProps {
    formSetting: FormSetting,
    setFormSetting: (setting: FormSetting) => void,
    data?: StoragePeriod,
    onSubmit?: (data: StoragePeriod) => void
}

export default function FormDetails(props: FormDetailProps) {
    const { formSetting = formSettingDefault, setFormSetting = () => { }, data, onSubmit = () => { } } = props;
    const form = useForm<StoragePeriod>({
        defaultValues: data ?? defaultStoragePeriod,
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
                        {formSetting.mode == FormMode.ADD && 'Thêm mới kỳ lưu trữ'}
                    </SheetTitle>
                    <SheetDescription>
                        {formSetting.mode == FormMode.EDIT && 'Cập nhật thông tin của kỳ lưu trữ đã chọn.'}
                        {formSetting.mode == FormMode.ADD && 'Thêm một kỳ lưu trữ mới bằng cách cung cấp thông tin cần thiết.'}
                        Nhấn lưu khi bạn hoàn tất.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form
                        id='storage-period-form'
                        onSubmit={handleFormSubmit}
                        className='flex-1 space-y-5 px-4'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Tên kỳ lưu trữ</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Nhập tên kỳ lưu trữ' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='yearAmount'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Số năm</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} placeholder='Nhập số năm' />
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
                    <Button form='storage-period-form' type='submit'>
                        Lưu thay đổi
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}