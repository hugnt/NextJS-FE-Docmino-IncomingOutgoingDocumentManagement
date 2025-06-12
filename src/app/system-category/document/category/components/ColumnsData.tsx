import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import { COLUMN_WIDTH } from "@/constants/columnWidth";
import { DocumentCategory } from "@/types/DocumentCategory";
import { ColumnDef } from "@tanstack/react-table";

export const ColumnsData: ColumnDef<DocumentCategory>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader className={COLUMN_WIDTH.name} column={column} title='Tên danh mục' />
        ),
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => (
            <DataTableColumnHeader className={COLUMN_WIDTH.description} column={column} title='Mô tả' />
        ),
        cell: ({ row }) => <div>{row.getValue('description')}</div>,
        enableSorting: false,
        enableHiding: false,
    }
];