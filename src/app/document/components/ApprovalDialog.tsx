"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toastClientError } from "@/lib/utils"
import { type ApproveDocumentRequest, type ProcessDetail, SignType } from "@/types/ConfirmProcess"
import { AlertCircle, ArrowRight, CheckCircle, Eye, EyeOff, Flag, Info, Key, Shield } from "lucide-react"
import { useEffect, useState } from "react"

interface ApprovalDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentStep: number
    processDetails?: ProcessDetail[]
    signerProcess?: ProcessDetail
    onConfirm: (approvalRequest: ApproveDocumentRequest) => void
}

export default function ApprovalDialog({
    open,
    onOpenChange,
    currentStep,
    processDetails = [],
    signerProcess,
    onConfirm,
}: ApprovalDialogProps) {
    const [comment, setComment] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            setComment("")
            setPassword("")
            setShowPassword(false)
            setIsSubmitting(false)
        }
    }, [open])

    const handleSubmit = async () => {
        if(signerProcess&&(signerProcess.signType === SignType.DigitalSignature && !password.trim())) {
            toastClientError("Xác nhận thất bại","Vui lòng nhập mã PIN chứng thư số để phê duyệt.")
            return
        }
        setIsSubmitting(true)
        try {
            const approvalRequest: ApproveDocumentRequest = {
                comment: comment.trim() || undefined,
                digitalSignaturePassword: password.trim() || undefined,
            }
            await onConfirm(approvalRequest)
            onOpenChange(false)
        } catch (error) {
            console.error("Error approving document:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDialogClose = () => {
        if (!isSubmitting) {
            onOpenChange(false)
        }
    }

    // Determine if this is the final step
    const maxStep = Math.max(...processDetails.map((p) => p.stepNumber))
    const isFinalStep = currentStep >= maxStep
    // Find next step info
    const nextStep = processDetails.find((p) => p.stepNumber === currentStep + 1)

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span>Phê duyệt văn bản</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Status Message */}
                    <div
                        className={`border rounded-lg p-4 ${isFinalStep ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}
                    >
                        <div className="flex items-start space-x-3">
                            {isFinalStep ? (
                                <Flag className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            ) : (
                                <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            )}
                            <div className={`text-sm ${isFinalStep ? "text-green-800" : "text-blue-800"}`}>
                                <p className="font-medium mb-2">
                                    {isFinalStep ? "Hoàn thành quy trình duyệt" : "Chuyển đến cấp duyệt kế tiếp"}
                                </p>
                                <p>
                                    {isFinalStep
                                        ? "Sau khi phê duyệt, văn bản sẽ hoàn thành toàn bộ quy trình duyệt và có hiệu lực."
                                        : `Văn bản sẽ được chuyển đến ${nextStep?.reviewerName || "cấp duyệt kế tiếp"} để tiếp tục quy trình phê duyệt.`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Current Step Info */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-700">
                            <AlertCircle className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">Bước hiện tại:</span>
                            <span>Bước {currentStep}</span>
                            {isFinalStep && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                    Bước cuối
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Digital Signature PIN Input */}
                    {signerProcess?.signType == SignType.DigitalSignature && (
                        <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-0">
                            <CardContent className="p-4 space-y-4">
                                {/* Header with icon */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                                        <Shield className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-sm">Xác thực chứng thư số</h3>
                                        <p className="text-xs text-gray-600">Bảo mật cao với chữ ký điện tử</p>
                                    </div>
                                </div>

                                {/* Info section */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-xs text-blue-800">
                                            <p className="font-medium mb-1">Mã PIN chứng thư số</p>
                                            <p>
                                                Mã PIN là khóa bí mật dùng để xác thực và bảo vệ chứng thư số của bạn. Vui lòng nhập chính xác.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Input field */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="digital-password"
                                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                                    >
                                        <Key className="w-4 h-4 text-gray-500" />
                                        Nhập mã PIN chứng thư
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="digital-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isSubmitting}
                                            className="pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            disabled={isSubmitting}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Optional Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="comment" className="text-sm font-medium">
                            Ghi chú (tùy chọn)
                        </Label>
                        <Textarea
                            id="comment"
                            placeholder="Nhập ghi chú cho việc phê duyệt..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[80px] resize-none"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <DialogFooter className="space-x-2">
                    <Button variant="outline" onClick={handleDialogClose} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {isFinalStep ? "Hoàn thành duyệt" : "Xác nhận phê duyệt"}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
