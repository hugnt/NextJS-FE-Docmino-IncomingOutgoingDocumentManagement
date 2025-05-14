"use client"

import documentCategoryRequest from "@/api/documentCategoryRequest";
import DataTable from "@/components/data-table/DataTable";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { handleSuccessApi } from "@/lib/utils";
import { defaultDocumentCategory, DocumentCategory } from "@/types/DocumentCategory";
import { DataFilter } from "@/types/filter";
import { ConfirmDialogState, confirmDialogStateDefaultInt, FormMode, FormSetting, formSettingDefault } from "@/types/form";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { ColumnsData } from "./components/ColumnsData";
import FormDetails from "./components/FormDetails";



export default function DocumentCategoryList() {
    const [data, setData] = useState<DocumentCategory[]>([]);
    const [filter, setFilter] = useState<DataFilter>({ pageNumber: 1, pageSize: 5 });
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [formSetting, setFormSetting] = useState<FormSetting>(formSettingDefault);
    const [detail, setDetail] = useState<DocumentCategory>();
    const [openDeleteDialog, setOpenDeleteDialog] = useState<ConfirmDialogState<number>>(confirmDialogStateDefaultInt);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const columns: ColumnDef<DocumentCategory>[] = [
        ...ColumnsData,
        {
            id: 'actions',
            header: ({ column }) => (
                <DataTableColumnHeader className="text-end mr-22" column={column} title='Action' />
            ),
            cell: ({ row }) => (
                <div className="flex space-x-2 justify-end">
                    <Button onClick={() => handleFormAction(FormMode.EDIT, row)} variant="outline" size="sm" className="h-8 px-2 py-0">
                        <Pencil size={14} className="mr-1" />
                        Edit
                    </Button>
                    <Button onClick={() => setOpenDeleteDialog({ open: true, id: row.original.id, name: row.original.name })} variant="outline" size="sm" className="h-8 px-2 py-0">
                        <Trash size={14} className="mr-1" />
                        Delete
                    </Button>
                </div>
            ),
        }
    ];

    useEffect(() => {
        handleGetList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter])

    // API HANDLER
    const handleGetList = () => {
        setTableLoading(true)
        documentCategoryRequest.getByFilter(filter).then(res => {
            console.log("res:", res.data)
            setData(res.data || []);
            setTotalRecords(res.totalRecords ?? 0)
        }).finally(() => setTableLoading(false));
    }

    //FORM HANDLER
    const handleFormAction = (mode: FormMode, row?: Row<DocumentCategory>) => {
        if (mode == FormMode.ADD) {
            setDetail(defaultDocumentCategory);
        }
        else if (row && mode == FormMode.EDIT) {
            const id = row.original.id;
            documentCategoryRequest.getById(id).then(res => {
                setDetail(res.data);
            });

        }
        setFormSetting({
            mode: mode,
            open: true
        })
    }

    const handleFormSubmit = (data: DocumentCategory) => {
        if (formSetting.mode == FormMode.ADD) {
            documentCategoryRequest.create(data).then(res => {
                handleSuccessApi({ title: "Insert successfully!", message: res.message })
                handleGetList();
            });
        }
        else if (formSetting.mode == FormMode.EDIT) {
            documentCategoryRequest.update(detail!.id, data).then(res => {
                handleSuccessApi({ title: "Updated successfully!", message: res.message })
                handleGetList();
            });
        }
        setFormSetting({ ...formSetting, open: false })
    }

    //DELETE HANDLER
    const handleConfirmDelete = () => {
        documentCategoryRequest.delete(openDeleteDialog.id).then(res => {
            handleSuccessApi({ title: "Deleted successfully!", message: res.message })
            handleGetList();
        });
        setOpenDeleteDialog({ ...openDeleteDialog, open: false })
    }

    return (
        <div>
            <PageHeader title="Book Category" subtitle="Here&apos;s a list of category">
                <Button onClick={() => handleFormAction(FormMode.ADD)} className='space-x-1'>
                    <span>Create</span><Plus size={18} />
                </Button>
            </PageHeader>
            <div className='space-y-4'>
                <DataTable data={data} columns={columns} loading={tableLoading} />
                <DataTablePagination
                    pageSizeList={[5, 8, 10]}
                    pageSize={filter?.pageSize}
                    pageNumber={filter?.pageNumber}
                    totalRecords={totalRecords}
                    onPageNumberChanged={(pageNumber: number) => setFilter({ ...filter, pageNumber: pageNumber })}
                    onPageSizeChanged={(pageSize: number) => setFilter({ pageNumber: 1, pageSize: pageSize })} />
            </div>
            <FormDetails
                title="Book Category"
                data={detail}
                onSubmit={handleFormSubmit}
                formSetting={formSetting}
                setFormSetting={setFormSetting} />

            <ConfirmDialog
                destructive
                open={openDeleteDialog.open}
                onOpenChange={(v) => setOpenDeleteDialog({ ...openDeleteDialog, open: v })}
                handleConfirm={handleConfirmDelete}
                className='max-w-md'
                title={`Delete this category: ${openDeleteDialog.name} ?`}
                desc={
                    <>
                        You are about to delete a category with the name{' '}
                        <strong>{openDeleteDialog.name}</strong>. <br />
                        This action cannot be undone.
                    </>
                }
                confirmText='Delete' />
        </div>

    )
}
