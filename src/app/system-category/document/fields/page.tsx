"use client"

import documentFieldRequest from "@/api/documentFieldRequest";
import DataTable from "@/components/data-table/DataTable";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { handleSuccessApi } from "@/lib/utils";
import { defaultDocumentField, DocumentField } from "@/types/DocumentField";
import { DataFilter } from "@/types/filter";
import { ConfirmDialogState, confirmDialogStateDefaultInt, FormMode, FormSetting, formSettingDefault } from "@/types/form";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { ColumnsData } from "./components/ColumnsData";
import { COLUMN_WIDTH } from "@/constants/columnWidth";
import FormDetails from "./components/FormDetails";
import SearchInput from "@/components/input/SearchInput";

export default function DocumentFieldList() {
    const [data, setData] = useState<DocumentField[]>([]);
    const [filter, setFilter] = useState<DataFilter>({ pageNumber: 1, pageSize: 10 });
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [formSetting, setFormSetting] = useState<FormSetting>(formSettingDefault);
    const [detail, setDetail] = useState<DocumentField>();
    const [openDeleteDialog, setOpenDeleteDialog] = useState<ConfirmDialogState<number>>(confirmDialogStateDefaultInt);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const columns: ColumnDef<DocumentField>[] = [
        {
            id: "index",
            header: ({ column }) => (
                <DataTableColumnHeader className={`${COLUMN_WIDTH.index}`} column={column} title='Stt' />
            ),
            cell: ({ row }) => (
                <div>
                    {((filter.pageNumber ?? 1) - 1) * (filter.pageSize ?? 10) + row.index + 1}
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        ...ColumnsData,
        {
            id: 'actions',
            header: ({ column }) => (
                <DataTableColumnHeader className="text-center" column={column} title='Hành động' />
            ),
            cell: ({ row }) => (
                <div className="flex space-x-2 justify-center">
                    <Button onClick={() => handleFormAction(FormMode.EDIT, row)} variant="outline" size="sm" className="h-8 px-2 py-0">
                        <Pencil size={14} />
                    </Button>
                    <Button onClick={() => setOpenDeleteDialog({ open: true, id: row.original.id, name: row.original.name })} variant="outline" size="sm" className="h-8 px-2 py-0">
                        <Trash size={14} />
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
        documentFieldRequest.getByFilter(filter).then(res => {
            setData(res.data || []);
            setTotalRecords(res.totalRecords ?? 0)
        }).finally(() => setTableLoading(false));
    }

    //FORM HANDLER
    const handleFormAction = (mode: FormMode, row?: Row<DocumentField>) => {
        if (mode == FormMode.ADD) {
            setDetail(defaultDocumentField);
        }
        else if (row && mode == FormMode.EDIT) {
            const id = row.original.id;
            documentFieldRequest.getById(id).then(res => {
                setDetail(res.data);
            });

        }
        setFormSetting({
            mode: mode,
            open: true
        })
    }

    const handleFormSubmit = (data: DocumentField) => {
        if (formSetting.mode == FormMode.ADD) {
            documentFieldRequest.create(data).then(res => {
                handleSuccessApi({ title: "Thêm mới thành công!", message: res.message })
                handleGetList();
            });
        }
        else if (formSetting.mode == FormMode.EDIT) {
            documentFieldRequest.update(detail!.id, data).then(res => {
                handleSuccessApi({ title: "Cập nhật thành công!", message: res.message })
                handleGetList();
            });
        }
        setFormSetting({ ...formSetting, open: false })
    }

    //DELETE HANDLER
    const handleConfirmDelete = () => {
        documentFieldRequest.delete(openDeleteDialog.id).then(res => {
            handleSuccessApi({ title: "Xóa thành công!", message: res.message })
            handleGetList();
        });
        setOpenDeleteDialog({ ...openDeleteDialog, open: false })
    }

    //SEARCH & FILTER
    const handleSearch = (query: string) => {
        setFilter({ ...filter, pageNumber: 1, searchValue: query })
    };

    return (
        <div>
            <PageHeader title="Danh mục lĩnh vực" subtitle="Quản lý danh mục lĩnh vực">
                <Button onClick={() => handleFormAction(FormMode.ADD)} className='space-x-1'>
                    <span>Thêm mới</span><Plus size={18} />
                </Button>
            </PageHeader>
            <div>
                <SearchInput className="w-[300px]" onSearch={handleSearch} />
            </div>
            <div className='space-y-4'>
                <DataTable data={data} columns={columns} loading={tableLoading} />
                <DataTablePagination
                    pageSizeList={[10, 15, 20]}
                    pageSize={filter?.pageSize}
                    pageNumber={filter?.pageNumber}
                    totalRecords={totalRecords}
                    onPageNumberChanged={(pageNumber: number) => setFilter({ ...filter, pageNumber: pageNumber })}
                    onPageSizeChanged={(pageSize: number) => setFilter({ pageNumber: 1, pageSize: pageSize })} />
            </div>
            <FormDetails
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
                title={`Delete this field: ${openDeleteDialog.name} ?`}
                desc={
                    <>
                        Bạn sắp xóa lĩnh vực với tên{' '}
                        <strong>{openDeleteDialog.name}</strong>. <br />
                        Hành động này không thể hoàn tác.
                    </>
                }
                confirmText='Xóa' />
        </div>

    )
}