import { ColumnDef } from "@tanstack/react-table";
import { DocumentField } from "@/types/DocumentField";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import { COLUMN_WIDTH } from "@/constants/columnWidth";

export const ColumnsData: ColumnDef<DocumentField>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className={COLUMN_WIDTH.name} column={column} title="Tên lĩnh vực" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader className={COLUMN_WIDTH.shortText} column={column} title="Mã lĩnh vực" />
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
];