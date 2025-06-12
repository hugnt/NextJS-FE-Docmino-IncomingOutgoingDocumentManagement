import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import { COLUMN_WIDTH } from "@/constants/columnWidth";
import { formatDate } from "@/lib/utils";
import { DocType, getDocumentUrl } from "@/types/Document";
import { InternalDocument } from "@/types/InternalDocument";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const ColumnsData: ColumnDef<InternalDocument>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.shortName}`} column={column} title='Tên văn bản' />
        ),
        cell: ({ row }) =>
            <Link type="blank" href={getDocumentUrl(DocType.InternalIncoming, row.original.id)}
                className="text-blue-600 hover:underline">
                {row.getValue('name')}
            </Link>,
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: 'arrivalNumber',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.shortText}`} column={column} title='Số đến' />
        ),
        cell: ({ row }) => <div>{row.getValue('arrivalNumber')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'codeNotation',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.number}`} column={column} title='Số ký hiệu' />
        ),
        cell: ({ row }) => <div>{row.getValue('codeNotation')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'issuedDate',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.date}`} column={column} title='Ngày văn bản' />
        ),
        cell: ({ row }) => <div>{formatDate(row.getValue('issuedDate'))}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'departmentName',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.longName}`} column={column} title='Phòng ban đến' />
        ),
        cell: ({ row }) => <div>{row.getValue('departmentName')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.description}`} column={column} title='Trích yếu nội dung' />
        ),
        cell: ({ row }) => <div>{row.getValue('description')}</div>,
        enableSorting: false,
        enableHiding: false,
    },


];