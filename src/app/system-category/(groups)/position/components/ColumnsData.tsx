import { ColumnDef } from "@tanstack/react-table";
import { Position } from "@/types/Position";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import { COLUMN_WIDTH } from "@/constants/columnWidth";

export const ColumnsData: ColumnDef<Position>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className={COLUMN_WIDTH.name} column={column} title="Tên chức vụ" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
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
  {
    accessorKey: "departmentName",
    header: ({ column }) => (
      <DataTableColumnHeader className={COLUMN_WIDTH.name} column={column} title="Phòng ban" />
    ),
    cell: ({ row }) => <div>{row.getValue("departmentName")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
];