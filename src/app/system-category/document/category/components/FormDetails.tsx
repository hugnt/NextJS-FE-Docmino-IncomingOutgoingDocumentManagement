"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { defaultDocumentCategory, DocumentCategory } from "@/types/DocumentCategory";
import { FormMode, FormSetting, formSettingDefault } from "@/types/form";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormDetailProps {
    formSetting: FormSetting,
    setFormSetting: (setting: FormSetting) => void,
    data?: DocumentCategory,
    title?: string,
    onSubmit?: (data: DocumentCategory) => void
}

export default function FormDetails(props: FormDetailProps) {
    const { formSetting = formSettingDefault, setFormSetting = () => { }, data, onSubmit = () => { }, title = "Details" } = props;
    const form = useForm<DocumentCategory>({
        defaultValues: data ?? defaultDocumentCategory,
    })

    useEffect(() => {
        if (data) form.reset(data);
    }, [data])

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("OKOK")
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
                    <SheetTitle>{formSetting.mode} {title}</SheetTitle>
                    <SheetDescription>
                        {formSetting.mode == FormMode.EDIT && 'Update details by providing necessary info.'}
                        {formSetting.mode == FormMode.ADD && 'Add a new record by providing necessary info.'}
                        Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form
                        id='tasks-form'
                        onSubmit={handleFormSubmit}
                        className='flex-1 space-y-5 px-4'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Enter a name' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <SheetFooter className='gap-2'>
                    <SheetClose asChild>
                        <Button variant='outline'>Close</Button>
                    </SheetClose>
                    <Button form='tasks-form' type='submit'>
                        Save changes
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
