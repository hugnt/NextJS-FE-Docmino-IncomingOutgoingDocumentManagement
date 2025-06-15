import documentRequest from '@/api/documentRequest'
import DataTable from '@/components/data-table/DataTable'
import DataTableColumnHeader from '@/components/data-table/DataTableColumnHeader'
import DataTablePagination from '@/components/data-table/DataTablePagination'
import SearchInput from '@/components/input/SearchInput'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { COLUMN_WIDTH } from '@/constants/columnWidth'
import { cn, formatDate } from '@/lib/utils'
import { getDocTypeName, PublishDocumentFilter } from '@/types/Document'
import { PublishDocument } from '@/types/Dossier'
import { ColumnDef } from '@tanstack/react-table'
import { BookmarkPlus } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DocumentLookupProps {
    open: boolean;
    storageId?: string | null;
    onOpenChange: (open: boolean) => void;
    existedDocuments: PublishDocument[];
    onDocumentsSelected?: (documents: PublishDocument[]) => void;
}

export default function DocumentLookup(props: DocumentLookupProps) {
    const { open, onOpenChange, onDocumentsSelected, existedDocuments, storageId = null } = props;
    const [data, setData] = useState<PublishDocument[]>([]);
    const [filter, setFilter] = useState<PublishDocumentFilter>({ pageNumber: 1, pageSize: 10, storageId });
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [selectedDocuments, setSelectedDocuments] = useState<PublishDocument[]>([]);
    const [tableLoading, setTableLoading] = useState<boolean>(false);

    const columns: ColumnDef<PublishDocument>[] = [
        {
            id: 'select',
            header: () => {
                return <BookmarkPlus size={18} />
            },
            cell: ({ row }) => {
                return <Checkbox
                    checked={selectedDocuments.some(x => x.id === row.original.id)}
                    onCheckedChange={(value) => handleSelectDocument(row.original, value === true)}
                    aria-label='Select row'
                    className='translate-y-[2px]'
                />
            },
            enableSorting: false,
            enableHiding: true,
        },
        {
            id: "index",
            header: "No.",
            cell: ({ row }) => <div>{((filter.pageNumber ?? 1) - 1) * (filter.pageSize ?? 10) + row.index + 1}</div>,
            enableSorting: false,
            enableHiding: false,
        },
        ...ColumnsData
    ];

    useEffect(() => {
        setFilter(prev => ({ ...prev, storageId }));
    }, [storageId])

    useEffect(() => {
        setSelectedDocuments(existedDocuments);
    }, [existedDocuments])

    useEffect(() => {
        handleGetListDocuments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const handleGetListDocuments = () => {
        setTableLoading(true);
        documentRequest.getPublishDocuments(filter).then(res => {
            setData(res.data || []);
            setTotalRecords(res.totalRecords ?? 0);
           
        }).finally(() => setTableLoading(false));
    }

    const handleSelectDocument = (document: PublishDocument, isAdd: boolean) => {
        if (isAdd) {
            setSelectedDocuments([...selectedDocuments, document])
        }
        else {
            setSelectedDocuments(selectedDocuments.filter(x => x.id !== document.id))
        }
    }
    const handleSearch = (query: string) => {
        setFilter({ ...filter, pageNumber: 1, searchValue: query })
    };
    const handleDocumentTypeChange = (value: string) => {
        const docType = value === "all" ? null : Number(value);
        setFilter({ ...filter, documentType: docType })
    };
    const handleSave = () => {
        if (onDocumentsSelected) {
            onDocumentsSelected(selectedDocuments);
        }
        onOpenChange(false);
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn("sm:max-w-[1000px] max-w-[1000px]! w-[1000px] p-4 gap-0")}>
                <DialogHeader>
                    <DialogTitle>
                        Điều chỉnh văn bản trong hồ sơ
                    </DialogTitle>
                    <DialogDescription>
                        Thêm hoặc loại bỏ văn bản khỏi hồ sơ hiện tại. Bạn có thể tìm kiếm văn bản theo tên, số ký hiệu hoặc loại văn bản.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex space-x-3 mt-3">
                    <SearchInput onSearch={handleSearch} className='w-1/2' />
                    <Select defaultValue={"all"}
                        onValueChange={handleDocumentTypeChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select request status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Tính chất văn bản</SelectLabel>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="1">Văn bản đến</SelectItem>
                                <SelectItem value="2">Văn bản đi</SelectItem>
                                <SelectItem value="3">Văn bản nội bộ đến</SelectItem>
                                <SelectItem value="4">Văn bản nội bộ đi</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='space-y-4'>
                    <DataTable data={data} columns={columns} loading={tableLoading} />
                    <DataTablePagination
                        selectedRows={selectedDocuments.length}
                        isDisplaySelectedRows={true}
                        pageSizeList={[8, 10, 20]}
                        pageSize={filter?.pageSize}
                        pageNumber={filter?.pageNumber}
                        totalRecords={totalRecords}
                        onPageNumberChanged={(pageNumber: number) => setFilter({ ...filter, pageNumber: pageNumber })}
                        onPageSizeChanged={(pageSize: number) => setFilter({ ...filter, pageNumber: 1, pageSize: pageSize })} />
                </div>
                <DialogFooter className=' bg-white border-t  mt-2 pt-2 flex justify-end space-x-2'>
                    <DialogClose asChild>
                        <Button variant="outline">
                            Đóng
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSave}>
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}


const ColumnsData: ColumnDef<PublishDocument>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader 
                    className={`${COLUMN_WIDTH.shortName}`} 
                    column={column} title="Tên văn bản" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center space-x-2 max-w-[250px] truncate">
                <span className="font-medium text-gray-900 truncate">{row.getValue("name")}</span>
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "codeNotation",
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.number}`} column={column} title="Số ký hiệu" />
        ),
        cell: ({ row }) => (
            <div className="font-mono text-sm bg-gray-50 px-2 py-1 rounded border text-gray-700">
                {row.getValue("codeNotation")}
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "documentType",
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.status}`} column={column} title="Loại văn bản" />
        ),
        cell: ({ row }) => (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {getDocTypeName(row.getValue("documentType"))}
            </Badge>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "documentRegisterName",
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.shortText}`} column={column} title="Danh mục" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center">
                <span className="text-gray-700">{row.getValue("documentRegisterName")}</span>
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "publishDate",
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.date}`} column={column} title="Ngày ban hành" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-sm">{formatDate(row.getValue("publishDate"))}</span>
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    }
]