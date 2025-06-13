import { ColumnDef } from "@tanstack/react-table";
import { Department } from "@/types/Department";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import { COLUMN_WIDTH } from "@/constants/columnWidth";


export const ColumnsData: ColumnDef<Department>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className={COLUMN_WIDTH.name} column={column} title="Tên phòng ban" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader className={COLUMN_WIDTH.shortText} column={column} title="Mã phòng ban" />
    ),
    cell: ({ row }) => <div>{row.getValue("code")}</div>,
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
    accessorKey: "parentDepartmentName",
    header: ({ column }) => (
      <DataTableColumnHeader className={COLUMN_WIDTH.name} column={column} title="Phòng ban cha" />
    ),
    cell: ({ row }) => <div>{row.original.id != row.original.parentDepartmentId ? row.getValue("parentDepartmentName") : "Không có"}</div>,
    enableSorting: false,
    enableHiding: false,
  },
];