"use client"

import DataTable from "@/components/data-table/DataTable";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { cn, dateToString, toastClientSuccess } from "@/lib/utils";
import { ConfirmDialogState, confirmDialogStateDefault } from "@/types/form";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, FileSpreadsheet, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { ColumnsData } from "./components/ColumnsData";
import { ExternalDocument, ExternalDocumentFilter } from "@/types/ExternalDocument";
import externalDocumentRequest from "@/api/externalDocumentRequest";
import SearchInput from "@/components/input/SearchInput";
import FilterMenu from "./components/FilterMenu";
import { DocType } from "@/types/Document";
import { DateRangePicker } from "@/components/input/DateRangePicker";
import { BUTTON_NAME } from "@/constants/buttons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { PATH } from "@/constants/paths";
import { useAuthContext } from "@/context/authContext";



export default function DocumentExternalOutgoingPage() {
    const { hasOutgoingDocumentRight } = useAuthContext();
    const [data, setData] = useState<ExternalDocument[]>([]);
    const [filter, setFilter] = useState<ExternalDocumentFilter>({ documentType: DocType.Outgoing, pageNumber: 1, pageSize: 10 });
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<ConfirmDialogState<string>>(confirmDialogStateDefault);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [filterMenuOpen, setFilterMenuOpen] = useState(true)
    const [isExportCsv, setIsExportCsv] = useState<boolean>(false);

    const columns: ColumnDef<ExternalDocument>[] = [
        ...ColumnsData,
        {
            id: 'actions',
            header: ({ column }) => (
                <DataTableColumnHeader className="text-center" column={column} title='Action' />
            ),
            cell: ({ row }) => (
                <div className="flex space-x-2 justify-center">
                    <Link href={`${PATH.DocumentExternalOutgoing}/${row.original.id}`} target="_blank">
                        <Button variant="outline" size="sm" className="h-8 px-2 py-0">
                            <Eye size={14} />
                        </Button>
                    </Link>
                    {hasOutgoingDocumentRight&&<Button onClick={() => setOpenDeleteDialog({ open: true, id: row.original.id, name: row.original.name })} variant="outline" size="sm" className="h-8 px-2 py-0">
                        <Trash size={14} />
                    </Button>}
                </div>
            ),
        }
    ];

    useEffect(() => {
        console.log("filter: ", filter)
        handleGetList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter])

    // API HANDLER
    const handleGetList = () => {
        setTableLoading(true)
        externalDocumentRequest.getAll(filter).then(res => {
            console.log("res:", res.data)
            setData(res.data || []);
            setTotalRecords(res.totalRecords ?? 0)
        }).finally(() => setTableLoading(false));
    }

    //DELETE HANDLER
    const handleConfirmDelete = () => {
        externalDocumentRequest.delete(openDeleteDialog.id).then(res => {
            toastClientSuccess("Xóa văn bản successfully!", res.message)
            handleGetList();
        });
        setOpenDeleteDialog({ ...openDeleteDialog, open: false })
    }

    //SEARCH & FILTER
    const handleSearch = (query: string) => {
        setFilter({ ...filter, pageNumber: 1, searchValue: query })
    };

    const handleExport = () => {
        setIsExportCsv(true);
        // setIsExportCsv(false);
    };

    return (
        <div>
            <PageHeader title="Danh sách văn bản đi" subtitle="Danh sách văn bản ra ngoài tổ chức">
                {hasOutgoingDocumentRight&&<Link href={`${PATH.DocumentExternalOutgoing}/create`} target="_blank">
                    <Button className='space-x-1'>
                        <span>{BUTTON_NAME.Add}</span><Plus size={18} />
                    </Button>
                </Link>}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size="icon" className="bg-white shadow">
                            <MoreHorizontal className="text-black h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-50 shadow rounded mt-2">
                        <DropdownMenuItem
                            onClick={handleExport}
                            className="px-3 py-2 flex items-center cursor-pointer hover:bg-muted" >
                            <FileSpreadsheet size={18} className="mr-2" />
                            <span>{BUTTON_NAME.ExportCsv}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </PageHeader>

            <div className={cn("grid grid-flow-row grid-cols-5 gap-x-2 gap-y-0")}>
                <FilterMenu setFilter={setFilter} filter={filter}
                    className="row-span-3" onOpenChange={setFilterMenuOpen} />
                <SearchInput className="col-span-2 h-fit" onSearch={handleSearch} />
                <DateRangePicker onApply={(range) => setFilter({ ...filter, startDate: dateToString(range?.from), endDate: dateToString(range?.to) })}
                    placeholder="Chọn ngày phát hành văn bản" />
                <div className="h-fit"></div>
                <div className={cn('space-y-2', filterMenuOpen ? 'col-span-4' : ' col-span-5')}>
                    <DataTable data={data}
                        columns={columns}
                        isExportCsv={isExportCsv}
                        setIsExportCsv={setIsExportCsv}
                        loading={tableLoading} />
                    <DataTablePagination
                        pageSizeList={[5, 8, 10]}
                        pageSize={filter?.pageSize}
                        pageNumber={filter?.pageNumber}
                        totalRecords={totalRecords}
                        onPageNumberChanged={(pageNumber: number) => setFilter({ ...filter, pageNumber: pageNumber })}
                        onPageSizeChanged={(pageSize: number) => setFilter({ ...filter, pageNumber: 1, pageSize: pageSize })} />
                </div>
            </div>



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
