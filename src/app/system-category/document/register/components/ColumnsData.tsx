import { ColumnDef } from "@tanstack/react-table";
import { DocumentRegister } from "@/types/DocumentRegister";
import { COLUMN_WIDTH } from "@/constants/columnWidth";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { getDocTypeName } from "@/types/Document";

export const ColumnsData: ColumnDef<DocumentRegister>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader className={COLUMN_WIDTH.name} column={column} title="Tên sổ đăng ký" />
        ),
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "year",
        header: ({ column }) => (
            <DataTableColumnHeader className={COLUMN_WIDTH.date} column={column} title="Năm" />
        ),
        cell: ({ row }) => <div>{row.getValue("year")}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => (
            <DataTableColumnHeader className={COLUMN_WIDTH.status} column={column} title="Tình trạng" />
        ),
        cell: ({ row }) => <Badge
            className={
                row.getValue("isActive")
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
            }
        >
            {row.getValue("isActive") ? "Đang hoạt động" : "Không hoạt động"}
        </Badge>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "registerType",
        header: ({ column }) => (
            <DataTableColumnHeader className={COLUMN_WIDTH.shortText} column={column} title="Loại sổ" />
        ),
        cell: ({ row }) =>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {getDocTypeName(row.getValue("registerType"))}
            </Badge>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader className={COLUMN_WIDTH.description} column={column} title="Mô tả" />
        ),
        cell: ({ row }) => <div>{row.getValue("description")}</div>,
        enableSorting: false,
        enableHiding: false,
    },
];