import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { COLUMN_WIDTH } from "@/constants/columnWidth"
import { formatDate } from "@/lib/utils"
import { getDocTypeName, getDocumentUrl, type SignedDocument } from "@/types/Document"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowRight, Calendar, Eye } from "lucide-react"
import Link from "next/link"

export const ColumnsData: ColumnDef<SignedDocument>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className={`${COLUMN_WIDTH.shortName}`} column={column} title="Tên văn bản" />
    ),
    cell: ({ row }) => (
      <Link href={getDocumentUrl(row.original.documentType, row.original.id)}
        className="text-blue-600 hover:underline">
        {row.getValue("name")}
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "codeNotation",
    header: ({ column }) => (
      <DataTableColumnHeader className={`${COLUMN_WIDTH.number}`} column={column} title="Số ký hiệu" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm bg-gray-50 px-2 py-1 rounded border text-gray-700">
        {row.getValue("codeNotation")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "actionName",
    header: ({ column }) => (
      <DataTableColumnHeader className={`${COLUMN_WIDTH.status}`} column={column} title="Hành động" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
        {row.getValue("actionName")}
      </Badge>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "isApproved",
    header: ({ column }) => (
      <DataTableColumnHeader className={`${COLUMN_WIDTH.status}`} column={column} title="Quyết định" />
    ),
    cell: ({ row }) => {
      const isApproved = row.getValue("isApproved")
      return (
        <Badge
          variant={!isApproved ? "destructive" : "default"}
          className={
            !isApproved
              ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-50"
              : "bg-green-50 text-green-700 border-green-200 hover:bg-green-50"
          }
        >
          {!isApproved ? "Từ chối" : "Đã phê duyệt"}
        </Badge>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "documentType",
    header: ({ column }) => (
      <DataTableColumnHeader className={`${COLUMN_WIDTH.status}`} column={column} title="Loại văn bản" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
        {getDocTypeName(row.getValue("documentType"))}
      </Badge>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "currentStepNumber",
    header: ({ column }) => (
      <DataTableColumnHeader className={`${COLUMN_WIDTH.number}`} column={column} title="Cấp duyệt" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center space-x-1">
        <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-50 to-indigo-50 px-2 py-1 rounded-md border border-blue-200">
          <span className="font-semibold text-blue-700">{row.getValue("currentStepNumber")}</span>
          <ArrowRight className="h-3 w-3 text-blue-500" />
          <span className="font-semibold text-indigo-700">{row.original.nextStepNumber}</span>
        </div>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "approvedAt",
    header: ({ column }) => (
      <DataTableColumnHeader className={`${COLUMN_WIDTH.date}`} column={column} title="Ngày duyệt" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center space-x-2 text-gray-600">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-sm">{formatDate(row.getValue("approvedAt"))}</span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    header: ({ column }) => <DataTableColumnHeader className="text-center" column={column} title="Thao tác" />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Link href={getDocumentUrl(row.original.documentType, row.original.id)}>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 py-0 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors duration-200 group"
          >
            <Eye className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="ml-1 text-xs">Xem</span>
          </Button>
        </Link>
      </div>
    ),
  },
]
