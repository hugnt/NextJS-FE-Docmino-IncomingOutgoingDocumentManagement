"use client"

import confirmProcessRequest from "@/api/confirmProcessRequest";
import DataTable from "@/components/data-table/DataTable";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import { DateRangePicker } from "@/components/input/DateRangePicker";
import SearchInput from "@/components/input/SearchInput";
import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { BUTTON_NAME } from "@/constants/buttons";
import { cn, dateToString } from "@/lib/utils";
import { DocType, ProcessingDocumentFilter, SignedDocument } from "@/types/Document";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { FileSpreadsheet, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { ColumnsData } from "./components/ColumnsData";



export default function DocumentHistoryPage() {
    const [data, setData] = useState<SignedDocument[]>([]);
    const [filter, setFilter] = useState<ProcessingDocumentFilter>({ documentType: DocType.Incoming, pageNumber: 1, pageSize: 10 });
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [isExportCsv, setIsExportCsv] = useState<boolean>(false);

    const columns: ColumnDef<SignedDocument>[] = [
        {
            id: "index",
            header: "No.",
            cell: ({ row }) =>  <div>{((filter.pageNumber ?? 1) - 1) * (filter.pageSize ?? 10) + row.index + 1}</div>,
            enableSorting: false,
            enableHiding: false,
        },
        ...ColumnsData,
    ];

    useEffect(() => {
        console.log("filter: ", filter)
        handleGetList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter])

    // API HANDLER
    const handleGetList = () => {
        setTableLoading(true)
        confirmProcessRequest.getConfirmHistory(filter).then(res => {
            console.log("res:", res.data)
            setData(res.data || []);
            setTotalRecords(res.totalRecords ?? 0)
        }).finally(() => setTableLoading(false));
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
            <PageHeader title="Danh sách văn bản đã duyệt" subtitle="Lịch sử các văn bản đã duyệt">
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
            <div className="flex space-x-3">
                <SearchInput className="w-[500px]" onSearch={handleSearch} />
                <DateRangePicker 
                    onApply={(range) => setFilter({ ...filter, startDate: dateToString(range?.from), endDate: dateToString(range?.to) })}
                    placeholder="Chọn ngày duyệt" />
            </div>
            <div className={cn('space-y-2')}>
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

    )
}
