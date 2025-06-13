import type { ColumnDef } from "@tanstack/react-table"
import type { StoragePeriod } from "@/types/StoragePeriod"
import { COLUMN_WIDTH } from "@/constants/columnWidth"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader"

export const ColumnsData: ColumnDef<StoragePeriod>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className={COLUMN_WIDTH.name} column={column} title="Tên thời hạn lưu trữ" />
    ),
    cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "yearAmount",
    header: ({ column }) => <DataTableColumnHeader className={COLUMN_WIDTH.date} column={column} title="Số năm" />,
    cell: ({ row }) => {
      const years = row.getValue("yearAmount") as number

      return (
        <Badge variant="outline" className="px-3 py-1 bg-primary/10 text-primary font-medium">
          {years} {years === 1 ? "năm" : "năm"}
        </Badge>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader className={COLUMN_WIDTH.description} column={column} title="Mô tả" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string

      // If description is too long, truncate it and show tooltip
      return description && description.length > 100 ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-md text-sm text-muted-foreground line-clamp-2">{description}</div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="text-sm text-muted-foreground">{description || "—"}</div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]
