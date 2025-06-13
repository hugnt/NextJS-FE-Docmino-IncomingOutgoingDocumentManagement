"use client";

import departmentRequest from "@/api/departmentRequest";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { defaultPosition, Position } from "@/types/Position";
import { FormMode, FormSetting, formSettingDefault } from "@/types/form";
import { Lookup } from "@/types/lookup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormDetailProps {
    formSetting: FormSetting,
    setFormSetting: (setting: FormSetting) => void,
    data?: Position,
    onSubmit?: (data: Position) => void
}

export default function FormDetails(props: FormDetailProps) {
    const { formSetting = formSettingDefault, setFormSetting = () => { }, data, onSubmit = () => { } } = props;
    const [departments, setDepartments] = useState<Lookup<number>[]>([]);
    const form = useForm<Position>({
        defaultValues: data ?? defaultPosition,
    });

    useEffect(() => {
        departmentRequest.lookup().then(res => {
            setDepartments(res.data || []);
        });
    }, []);

    useEffect(() => {
        if (data) form.reset(data);
    }, [data]);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
    };

    return (
        <Sheet
            open={formSetting.open}
            onOpenChange={(v) => {
                setFormSetting({ ...formSetting, open: v });
                form.reset();
            }}>
            <SheetContent
                onInteractOutside={event => event.preventDefault()}
                className='flex flex-col'>
                <SheetHeader className='text-left'>
                    <SheetTitle>
                        {formSetting.mode == FormMode.EDIT && 'Cập nhật chức vụ'}
                        {formSetting.mode == FormMode.ADD && 'Thêm mới chức vụ'}
                    </SheetTitle>
                    <SheetDescription>
                        {formSetting.mode == FormMode.EDIT && 'Cập nhật thông tin chức vụ đã chọn.'}
                        {formSetting.mode == FormMode.ADD && 'Thêm một chức vụ mới bằng cách cung cấp thông tin cần thiết.'}
                        Nhấn lưu khi bạn hoàn tất.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form
                        id='position-form'
                        onSubmit={handleFormSubmit}
                        className='flex-1 space-y-5 px-4'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Tên chức vụ</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Nhập tên chức vụ' />
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
                        <FormField
                            control={form.control}
                            name="departmentId"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>Phòng ban</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                        value={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn phòng ban" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {departments.map((department) => (
                                                <SelectItem key={department.id} value={department.id.toString()}>
                                                    {department.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                    <Button form='position-form' type='submit'>
                        Lưu thay đổi
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}