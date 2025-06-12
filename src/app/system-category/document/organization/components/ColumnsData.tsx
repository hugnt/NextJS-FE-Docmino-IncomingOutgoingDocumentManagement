import { ColumnDef } from "@tanstack/react-table";
import { Organization } from "@/types/Organization";
import { COLUMN_WIDTH } from "@/constants/columnWidth";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";

export const ColumnsData: ColumnDef<Organization>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className={COLUMN_WIDTH.name} column={column} title="Tên tổ chức" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader className={COLUMN_WIDTH.shortText} column={column} title="Số điện thoại" />
    ),
    cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader className={COLUMN_WIDTH.shortText} column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "contactPersonName",
    header: ({ column }) => (
      <DataTableColumnHeader className={COLUMN_WIDTH.shortName} column={column} title="Người liên hệ" />
    ),
    cell: ({ row }) => <div>{row.getValue("contactPersonName")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
];