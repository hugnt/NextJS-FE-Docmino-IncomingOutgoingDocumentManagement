import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProcessHistory } from '@/types/ConfirmProcess'
import { format } from 'date-fns'
import { History } from 'lucide-react'


interface ConfirmProcessTrackingProps {
    processHistories?: ProcessHistory[] | null;
}
export default function ConfirmProcessTracking(props: ConfirmProcessTrackingProps) {
    const { processHistories } = props;
    return (
        <div> <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <History size={18} />
                    <span>Lịch sử văn bản</span>
                </h3>
                <p className="text-muted-foreground">Xem lịch sử thay đổi và xử lý của văn bản</p>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Bước duyệt</TableHead>
                        <TableHead>Người được phân công</TableHead>
                        <TableHead>Người thực hiện</TableHead>
                        <TableHead>Hành động</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Ghi chú</TableHead>
                        <TableHead>Chuyển đến bước duyệt</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {processHistories&&processHistories.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.currentStepNumber}</TableCell>
                            <TableCell>{item.reviewerName}</TableCell>
                            <TableCell>{item.userReviewerName}</TableCell>
                            <TableCell>{item.actionName}</TableCell>
                            <TableCell>{format(item.createdAt, "dd/MM/yyyy HH:mm")}</TableCell>
                            <TableCell>{item.comment}</TableCell>
                            <TableCell>{item.nextStepNumber}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {!processHistories || processHistories.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <History className="mx-auto h-12 w-12 mb-2 opacity-50" />
                    <p>Chưa có lịch sử cho văn bản này</p>
                </div>
            )}
        </div></div>
    )
}
