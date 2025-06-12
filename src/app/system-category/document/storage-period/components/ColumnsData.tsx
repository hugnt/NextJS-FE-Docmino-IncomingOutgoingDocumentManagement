import { ColumnDef } from "@tanstack/react-table";
import { StoragePeriod } from "@/types/StoragePeriod";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import { COLUMN_WIDTH } from "@/constants/columnWidth";

export const ColumnsData: ColumnDef<StoragePeriod>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className={COLUMN_WIDTH.name} column={column} title="Tên kỳ lưu trữ" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "yearAmount",
    header: ({ column }) => (
      <DataTableColumnHeader className={COLUMN_WIDTH.date} column={column} title="Số năm" />
    ),
    cell: ({ row }) => <div>{row.getValue("yearAmount")}</div>,
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