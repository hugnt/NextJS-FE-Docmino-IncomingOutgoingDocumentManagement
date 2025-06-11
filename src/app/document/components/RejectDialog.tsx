"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, RotateCcw, XCircle } from "lucide-react"
import { useState, useEffect } from "react"
import type { ProcessDetail, RejectDocumentRequest } from "@/types/ConfirmProcess"

interface RejectDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    isVetoRight?: boolean
    processDetails?: ProcessDetail[]
    onConfirm: (rejectRequest: RejectDocumentRequest) => void
}

export default function RejectDialog({
    open,
    onOpenChange,
    isVetoRight = false,
    processDetails = [],
    onConfirm,
}: RejectDialogProps) {
    const [rejectReason, setRejectReason] = useState("")
    const [returnToStep, setReturnToStep] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            setRejectReason("")
            setReturnToStep(null)
            setIsSubmitting(false)
        }
    }, [open])

    const handleSubmit = async () => {
        if (!rejectReason.trim()) return

        setIsSubmitting(true)
        try {
            // Create the reject request object
            const rejectRequest: RejectDocumentRequest = {
                comment: rejectReason,
                rollbackStep: returnToStep || processDetails[0]?.stepNumber || 1,
            }

            await onConfirm(rejectRequest)
            onOpenChange(false)
        } catch (error) {
            console.error("Error rejecting document:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDialogClose = () => {
        if (!isSubmitting) {
            onOpenChange(false)
        }
    }

    // Find the selected process detail
    const selectedProcess = returnToStep !== null ? processDetails.find((p) => p.stepNumber === returnToStep) : null

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-red-700">
                        <AlertTriangle className="w-5 h-5" />
                        <span>Từ chối văn bản</span>
                    </DialogTitle>
                </DialogHeader>  

                <div className="space-y-4 py-4">
                    {/* Rejection Reason */}
                    <div className="space-y-2">
                        <Label htmlFor="reason" className="text-sm font-medium">
                            Lý do từ chối <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder="Nhập lý do từ chối văn bản..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="min-h-[100px] resize-none"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Return Step Selection (if user has veto rights) */}
                    {isVetoRight && processDetails.length > 0 && (
                        <div className="space-y-2">
                            <Label htmlFor="returnStep" className="text-sm font-medium flex items-center space-x-2">
                                <RotateCcw className="w-4 h-4 text-blue-600" />
                                <span>Trả về bước duyệt</span>
                            </Label>
                            <Select
                                value={returnToStep?.toString() || ""}
                                onValueChange={(value) => setReturnToStep(Number.parseInt(value))}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn bước duyệt muốn trả về" />
                                </SelectTrigger>
                                <SelectContent>
                                    {processDetails.map((process) => (
                                        <SelectItem key={process.id || process.stepNumber.toString()} value={process.stepNumber.toString()}>
                                            Bước {process.stepNumber} - {process.reviewerName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Description */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-amber-800">
                                <p className="font-medium mb-1">Lưu ý:</p>
                                <p>
                                    {isVetoRight && selectedProcess
                                        ? `Văn bản sẽ được trả về Bước ${selectedProcess.stepNumber} - ${selectedProcess.reviewerName}`
                                        : "Văn bản sẽ quy về bước trước đó"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="space-x-2">
                    <Button variant="outline" onClick={handleDialogClose} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleSubmit}
                        disabled={!rejectReason.trim() || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Xác nhận từ chối
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
