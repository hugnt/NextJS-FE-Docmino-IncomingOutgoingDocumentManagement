import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useDirectoryContext } from '@/context/directoryContext'
import { ContainerStatus, defaultDossier, Dossier } from '@/types/Dossier'
import { FormMode, FormSetting, formSettingDefault } from '@/types/form'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface FormDetailProps {
    formSetting: FormSetting,
    setFormSetting: (setting: FormSetting) => void,
    data?: Dossier,
    title?: string,
    onSubmit?: (data: Dossier) => void
}

export default function FormDetails(props: FormDetailProps) {
    const { formSetting = formSettingDefault, setFormSetting = () => { }, data, onSubmit = () => { } } = props;
    const { getAllInventories, getAllShelfs, getAllBoxes, storagePeriod, getBox, getShelf } = useDirectoryContext();
    const [inventoryId, setInventoryId] = React.useState<string | null>(null);
    const [shelfId, setShelfId] = React.useState<string | null>(null);

    const form = useForm<Dossier>({
        defaultValues: data ?? defaultDossier,
    })

    useEffect(() => {
        if (data) {
            const selectedShelf = getBox(data.boxId);
            if (selectedShelf) {
                const selectedSheftId = selectedShelf.parentDirectoryId ?? null;
                setShelfId(selectedSheftId);
                if (selectedSheftId) {
                    const selectedInventory = getShelf(selectedSheftId);
                    setInventoryId(selectedInventory?.parentDirectoryId ?? null);
                }

            }
            form.reset(data);
        }
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
            <DialogContent className="sm:max-w-[700px] p-4">
                <DialogHeader>
                    <DialogTitle>
                        {formSetting.mode == FormMode.EDIT && 'Cập nhật hồ sơ lưu trữ'}
                        {formSetting.mode == FormMode.ADD && 'Thêm hồ sơ lưu trữ'}
                    </DialogTitle>
                    <DialogDescription>
                        {formSetting.mode == FormMode.EDIT && 'Cập nhật thông tin hồ sơ lưu trữ bằng cách cung cấp thông tin cần thiết.'}
                        {formSetting.mode == FormMode.ADD && 'Nhập thông tin hồ sơ lưu trữ mới vào biểu mẫu dưới đây.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form id='tasks-form' onSubmit={handleFormSubmit}
                        className='flex-1 space-y-5' >
                        <div className='grid grid-cols-3 gap-2'>
                            <FormItem>
                                <FormLabel>Kho lưu trữ
                                    <span className="text-red-500">(*)</span>
                                </FormLabel>
                                <Select
                                    value={inventoryId ?? ''}
                                    onValueChange={(val) => {
                                        setInventoryId(val);
                                        form.setValue('boxId', '');
                                    }}>
                                    <FormControl className="w-full">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Kho lưu trữ" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            getAllInventories()?.map(x => {
                                                return <SelectItem key={x.id} value={x.id}>{x.name} </SelectItem>
                                            })
                                        }
                                    </SelectContent>
                                </Select>
                            </FormItem>
                            <FormItem>
                                <FormLabel>Kệ lưu trữ
                                    <span className="text-red-500">(*)</span>
                                </FormLabel>
                                <Select
                                    value={shelfId ?? ''}
                                    onValueChange={setShelfId}>
                                    <FormControl className="w-full">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Kệ lưu trữ" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            getAllShelfs()?.filter(x => x.parentDirectoryId == inventoryId)?.map(x => {
                                                return <SelectItem key={x.id} value={x.id}>{x.name} </SelectItem>
                                            })
                                        }
                                    </SelectContent>
                                </Select>
                            </FormItem>
                            <FormField
                                control={form.control}
                                name="boxId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hộp lưu trữ
                                            <span className="text-red-500">(*)</span>
                                        </FormLabel>
                                        <Select
                                            value={field.value ?? ''}
                                            onValueChange={field.onChange}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Hộp lưu trữ" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    getAllBoxes()?.filter(x => x.parentDirectoryId == shelfId).map(x => {
                                                        return <SelectItem key={x.id} value={x.id}>{x.name} </SelectItem>
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
                            <FormField
                                control={form.control}
                                name='code'
                                render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <FormLabel>Mã hồ sơ</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='HS-[định danh]' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <FormLabel>Tên hồ sơ</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Nhập tên hồ sơ' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='grid grid-cols-3 gap-2'>
                            <FormField
                                control={form.control}
                                name='year'
                                render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <FormLabel>Năm lập hồ sơ</FormLabel>
                                        <FormControl>
                                            <Input type='number' {...field} placeholder='Nhập năm hồ sơ' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="storagePeriodId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thời hạn lưu trữ </FormLabel>
                                        <Select
                                            value={field.value ? String(field.value) : undefined}
                                            onValueChange={val => field.onChange(Number(val))}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Thời hạn lưu trữ" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    storagePeriod?.map(x => {
                                                        return <SelectItem key={x.id} value={String(x.id)}>{x.name}</SelectItem>
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Trạng thái</FormLabel>
                                        <Select
                                            value={field.value !== undefined ? String(field.value) : undefined}
                                            onValueChange={val => field.onChange(Number(val) as ContainerStatus)}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Trạng thái" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={"0"}>Nháp</SelectItem>
                                                <SelectItem value={"1"}>Không hoạt động</SelectItem>
                                                <SelectItem value={"2"}>Đang hoạt động</SelectItem>
                                                <SelectItem value={"3"}>Đã hủy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
