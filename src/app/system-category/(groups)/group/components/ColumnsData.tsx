/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table"
import { type Group, getLeaders, getRegularMembers } from "@/types/Group"
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader"
import { COLUMN_WIDTH } from "@/constants/columnWidth"
import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"

const MemberDisplay = ({
    members,
    showIcon = false,
    variant = "secondary",
}: {
    members: any[]
    showIcon?: boolean
    variant?: "default" | "secondary" | "destructive" | "outline"
}) => {
    if (members.length === 0) {
        return <span className="text-muted-foreground text-sm">Chưa có</span>
    }

    return (
        <div className="flex flex-wrap gap-1">
            {members.map((member) => (
                <Badge key={member.userId} variant={variant} className="text-xs">
                    {showIcon && <Crown className="w-3 h-3 mr-1" />}
                    {member.fullname}
                    <span className="ml-1 text-muted-foreground">({member.departmentName})</span>
                </Badge>
            ))}
        </div>
    )
}

export const ColumnsData: ColumnDef<Group>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader className={COLUMN_WIDTH.name} column={column} title="Tên nhóm" />,
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "leaders",
        header: ({ column }) => (
            <DataTableColumnHeader className={COLUMN_WIDTH.description} column={column} title="Trưởng nhóm" />
        ),
        cell: ({ row }) => {
            const leaders = getLeaders(row.original.members)
            return <MemberDisplay members={leaders} showIcon variant="default" />
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "members",
        header: ({ column }) => (
            <DataTableColumnHeader className={COLUMN_WIDTH.description} column={column} title="Thành viên" />
        ),
        cell: ({ row }) => {
            const regularMembers = getRegularMembers(row.original.members)
            return <MemberDisplay members={regularMembers} variant="secondary" />
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "memberCount",
        header: ({ column }) => <DataTableColumnHeader className="text-center" column={column} title="Số lượng" />,
        cell: ({ row }) => {
            const totalMembers = row.original.members?.length || 0
            const leaders = getLeaders(row.original.members).length
            const members = getRegularMembers(row.original.members).length

            return (
                <div className="text-center">
                    <div className="font-medium">{totalMembers}</div>
                    <div className="text-xs text-muted-foreground">
                        {leaders}L + {members}M
                    </div>
                </div>
            )
        },
        enableSorting: false,
        enableHiding: false,
    },
]
