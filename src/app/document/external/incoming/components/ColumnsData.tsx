import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import { COLUMN_WIDTH } from "@/constants/columnWidth";
import { formatDate } from "@/lib/utils";
import { DocType, getDocumentUrl } from "@/types/Document";
import { ExternalDocument } from "@/types/ExternalDocument";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const ColumnsData: ColumnDef<ExternalDocument>[] = [
    {
        id: "index",
        header: "No.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.shortName}`} column={column} title='Tên văn bản' />
        ),
        cell: ({ row }) =>
            <Link type="blank" href={getDocumentUrl(DocType.Incoming, row.original.id)}
                className="text-blue-600 hover:underline">
                {row.getValue('name')}
            </Link>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'arrivalDate',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.date}`} column={column} title='Ngày đến' />
        ),
        cell: ({ row }) => <div>{formatDate(row.getValue('arrivalDate'))}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'arrivalNumber',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.number}`} column={column} title='Số đến' />
        ),
        cell: ({ row }) => <div>{row.getValue('arrivalNumber')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'organizationName',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.shortText}`} column={column} title='Nơi gửi (tác giả)' />
        ),
        cell: ({ row }) => <div>{row.getValue('organizationName')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'categoryName',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.shortText}`} column={column} title='Loại văn bản' />
        ),
        cell: ({ row }) => <div>{row.getValue('categoryName')}</div>,
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
        accessorKey: 'description',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.description}`} column={column} title='Trích yếu nội dung' />
        ),
        cell: ({ row }) => <div>{row.getValue('description')}</div>,
        enableSorting: false,
        enableHiding: false,
    },


];