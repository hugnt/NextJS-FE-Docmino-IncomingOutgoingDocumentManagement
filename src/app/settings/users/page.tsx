"use client"

import userRequest from "@/api/userRequest";
import DataTable from "@/components/data-table/DataTable";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import SearchInput from "@/components/input/SearchInput";
import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { handleSuccessApi } from "@/lib/utils";
import { DataFilter } from "@/types/filter";
import { ConfirmDialogState, confirmDialogStateDefault, FormMode, FormSetting, formSettingDefault } from "@/types/form";
import { defaultUserDetail, UserDetail } from "@/types/User";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Lock, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ColumnsData } from "./components/ColumnsData";
import FormDetails from "./components/FormDetails";



export default function UserListPage() {
    const [data, setData] = useState<UserDetail[]>([]);
    const [filter, setFilter] = useState<DataFilter>({ pageNumber: 1, pageSize: 5 });
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [formSetting, setFormSetting] = useState<FormSetting>(formSettingDefault);
    const [detail, setDetail] = useState<UserDetail>();
    const [openDeleteDialog, setOpenDeleteDialog] = useState<ConfirmDialogState>(confirmDialogStateDefault);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const columns: ColumnDef<UserDetail>[] = [
        ...ColumnsData,
        {
            id: 'actions',
            header: ({ column }) => (
                <DataTableColumnHeader className="text-center" column={column} title='Hành động' />
            ),
            cell: ({ row }) => (
                <div className="flex space-x-2 justify-center">
                    <Button onClick={() => handleFormAction(FormMode.EDIT, row)} variant="outline" size="sm" className="h-8 px-2 py-0">
                        <Edit size={14} />
                    </Button>
                    <Button onClick={() => setOpenDeleteDialog({ open: true, id: row.original.id, name: row.original.fullname })}
                        variant="destructive" size="sm" className="text-white h-8 px-2 py-0">
                        <Lock size={14} />
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
        userRequest.getByFilter(filter).then(res => {
            console.log("res:", res.data)
            setData(res.data || []);
            setTotalRecords(res.totalRecords ?? 0)
        }).finally(() => setTableLoading(false));
    }

    //FORM HANDLER
    const handleFormAction = (mode: FormMode, row?: Row<UserDetail>) => {
        if (mode == FormMode.ADD) {
            setDetail(defaultUserDetail);
        }
        else if (row && mode == FormMode.EDIT) {
            setDetail(row.original);
        }
        setFormSetting({
            mode: mode,
            open: true
        })
    }

    const handleFormSubmit = (data: UserDetail) => {
        if (formSetting.mode == FormMode.ADD) {
            userRequest.create(data).then(res => {
                handleSuccessApi({ title: "Thêm tài khoản thành công!", message: res.message })
                handleGetList();
                setFormSetting({ ...formSetting, open: false })
            });
        }
        else if (formSetting.mode == FormMode.EDIT) {
            userRequest.update(detail!.id, data).then(res => {
                handleSuccessApi({ title: "Cập nhật tài khoản!", message: res.message })
                handleGetList();
                setFormSetting({ ...formSetting, open: false })
            });
        }

    }


    //DELETE HANDLER
    const handleConfirmDelete = () => {
        userRequest.delete(openDeleteDialog.id).then(res => {
            handleSuccessApi({ title: "Deleted successfully!", message: res.message })
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
            <PageHeader title="Danh sách người dùng" subtitle="Tài khoản người dùng trong hệ thống">
                <Button onClick={() => handleFormAction(FormMode.ADD)} className='space-x-1'>
                    <span>Thêm người dùng</span><Plus size={18} />
                </Button>
            </PageHeader>
            <div>
                <SearchInput className="w-[300px]" onSearch={handleSearch} />
            </div>
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
                title={`Vô hiệu hóa người dùng: ${openDeleteDialog.name} ?`}
                desc={
                    <>
                        Bạn sắp vô hiệu hóa người dùng có tên{' '}
                        <strong>{openDeleteDialog.name}</strong>. <br />
                        Hành động này không thể hoàn tác.
                    </>
                }
                confirmText='Vô hiệu hóa' />
        </div>

    )
}
