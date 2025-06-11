import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { defaultDocumentDirectory, DocumentDirectory } from '@/types/DocumentDirectory'
import { FormMode, FormSetting, formSettingDefault } from '@/types/form'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface FormDetailProps {
    formSetting: FormSetting,
    setFormSetting: (setting: FormSetting) => void,
    data?: DocumentDirectory,
    title?: string,
    onSubmit?: (data: DocumentDirectory) => void
}

export default function FormDetails(props: FormDetailProps) {
    const { formSetting = formSettingDefault, setFormSetting = () => { }, data, onSubmit = () => { } } = props;
    const form = useForm<DocumentDirectory>({
        defaultValues: data ?? defaultDocumentDirectory,
    })

    useEffect(() => {
        if (data) form.reset(data);
    }, [data])

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
    }

    
    return (
        <Dialog open={formSetting.open}
            onOpenChange={(v) => {
                setFormSetting({ ...formSetting, open: v })
                form.reset()
            }}>
            <DialogContent className="sm:max-w-[425px] p-4">
                <DialogHeader>
                    <DialogTitle>
                        {formSetting.mode == FormMode.EDIT && 'Cập nhật kho lưu trữ'}
                        {formSetting.mode == FormMode.ADD && 'Thêm kho lưu trữ'}
                    </DialogTitle>
                    <DialogDescription>
                        {formSetting.mode == FormMode.EDIT && 'Cập nhật thông tin kho lưu trữ bằng cách cung cấp thông tin cần thiết.'}
                        {formSetting.mode == FormMode.ADD && 'Nhập thông tin kho lưu trữ mới vào biểu mẫu dưới đây.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form id='tasks-form' onSubmit={handleFormSubmit}
                        className='flex-1 space-y-5' >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Tên kho</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Nhập tên thư mục' />
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
                                    <FormLabel>Ghi chú</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder='Nhập tên thư mục' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={() => setFormSetting({ ...formSetting, open: false })}>
                            Đóng
                        </Button>
                    </DialogClose>
                    <Button form='tasks-form' type="submit" >
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
