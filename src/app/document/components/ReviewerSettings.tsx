"use client"

import documentRequest from "@/api/documentRequest"
import { DateRangePicker } from "@/components/input/DateRangePicker"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useDocumentContext } from "@/context/documentContext"
import { dateToString, toastClientError } from "@/lib/utils"
import { defaultProcessDetails, type ProcessDetail, ReviewerType, SignType } from "@/types/ConfirmProcess"
import type { ReviewerOptions } from "@/types/Document"
import { CircleHelp } from "lucide-react"
import { useEffect, useState } from "react"

interface ReviewerSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  processDetail?: ProcessDetail,
  onSave?: (data: ProcessDetail) => void,
  blockchainEnabled: boolean
}

export default function ReviewerSettings({ open, onOpenChange, processDetail, onSave = () => { }, blockchainEnabled = false }: ReviewerSettingsProps) {
  const { reviewerTypes, signTypes } = useDocumentContext()
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<ReviewerOptions>()

  // Form state
  const [formState, setFormState] = useState<ProcessDetail>(defaultProcessDetails)

  // Load reviewer options on component mount
  useEffect(() => {
    setLoading(true)
    documentRequest.getReviewerOptions().then((res) => {
      setData(res.data)
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const updatedValue = processDetail ?? defaultProcessDetails
    if (processDetail) {
      updatedValue.reviewerId =
        processDetail.reviewerUserId ??
        processDetail.reviewerGroupId ??
        (processDetail.reviewerPositionId != null
          ? String(processDetail.reviewerPositionId)
          : processDetail.reviewerDepartmentId != null
            ? String(processDetail.reviewerDepartmentId)
            : "");
    }
    setFormState(updatedValue)
  }, [processDetail])


  const handleReviewerTypeChange = (value: string) => {
    const selectedType = Number(value) as ReviewerType
    setFormState({ ...formState, reviewerType: selectedType, reviewerId: "" })
  }

  const handleSignTypeChange = (value: string) => {
    const selectedType = blockchainEnabled ? SignType.Blockchain : Number(value) as SignType
    const selectedOption = signTypes?.find((x) => x.key === selectedType)
    const actionName = selectedOption?.value || ""
    setFormState({ ...formState, signType: selectedType, actionName })
  }

  const handleReviewerChange = (value: string) => {
    const selectedOption = getReviewerOptions().find((x) => x.key === value)
    setFormState({ ...formState, reviewerId: value, reviewerName: selectedOption?.value || "" })
  }

  const handleSaveChanges = () => {
    const updatedProcessDetail: ProcessDetail = {
      id: processDetail?.id,
      stepNumber: processDetail?.stepNumber ?? 1,
      signType: formState.signType,
      reviewerType: formState.reviewerType,
      reviewerUserId: formState.reviewerType === ReviewerType.User ? formState.reviewerId : null,
      reviewerGroupId: formState.reviewerType === ReviewerType.Group ? formState.reviewerId : null,
      reviewerPositionId: formState.reviewerType === ReviewerType.Position ? Number(formState.reviewerId) : null,
      reviewerDepartmentId: formState.reviewerType === ReviewerType.Deparment ? Number(formState.reviewerId) : null,
      dateStart: formState.dateStart,
      dateEnd: formState.dateEnd == "" ? null : formState.dateEnd,
      resignDateEnd: formState.resignDateEnd == "" ? null : formState.resignDateEnd,
      vetoRight: formState.vetoRight,

      reviewerId: formState.reviewerId,
      reviewerName: formState.reviewerName,
      actionName: formState.actionName,
    }

    if (updatedProcessDetail.reviewerUserId == null
      && updatedProcessDetail.reviewerGroupId == null
      && updatedProcessDetail.reviewerPositionId == null
      && updatedProcessDetail.reviewerDepartmentId == null) {
      toastClientError("Thiết lập duyệt thất bại!", "Bạn cần chọn người duyệt cho bước này")
      return;
    }
    else if (updatedProcessDetail.dateStart == "") {
      toastClientError("Thiết lập duyệt thất bại!", "Ngày bắt đầu không được để trống");
      return;
    }
    console.log(`process-detail-step-${updatedProcessDetail.stepNumber}`, updatedProcessDetail)
    onSave(updatedProcessDetail)
  }

  // Get the appropriate options list based on reviewer type
  const getReviewerOptions = () => {
    switch (formState.reviewerType) {
      case ReviewerType.User:
        return data?.users || []
      case ReviewerType.Group:
        return data?.groups || []
      case ReviewerType.Position:
        return data?.positions || []
      case ReviewerType.Deparment:
        return data?.departments || []
      default:
        return []
    }
  }

  const getPlaceholderText = () => {
    switch (formState.reviewerType) {
      case ReviewerType.User:
        return "Chọn người duyệt"
      case ReviewerType.Group:
        return "Chọn nhóm duyệt"
      case ReviewerType.Position:
        return "Chọn chức vụ duyệt"
      case ReviewerType.Deparment:
        return "Chọn phòng ban duyệt"
      default:
        return "Chọn"
    }
  }

  // Get the label text based on reviewer type
  const getLabelText = () => {
    switch (formState.reviewerType) {
      case ReviewerType.User:
        return "Người duyệt"
      case ReviewerType.Group:
        return "Nhóm duyệt"
      case ReviewerType.Position:
        return "Chức vụ duyệt"
      case ReviewerType.Deparment:
        return "Phòng ban duyệt"
      default:
        return "Đối tượng"
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange} >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thiết lập đối tượng duyệt (bước {processDetail?.stepNumber ?? 0})</DialogTitle>
            <DialogDescription>Chọn người duyệt hoặc nhóm người duyệt ở bước duyệt này</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Reviewer Type Selection */}
            <div className="grid gap-2">
              <Label htmlFor="reviewer-type">Đối tượng duyệt</Label>
              <Select defaultValue={String(ReviewerType.User)}
                onValueChange={handleReviewerTypeChange} disabled={loading}>
                <SelectTrigger className="w-full" id="reviewer-type">
                  <SelectValue placeholder="Chọn đối tượng duyệt" />
                </SelectTrigger>
                <SelectContent>
                  {reviewerTypes?.map((x) => (
                    <SelectItem key={x.key} value={String(x.key)}>
                      {x.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reviewer Selection */}
            <div className="grid gap-2">
              <Label htmlFor="reviewer">{getLabelText()}</Label>
              <Select defaultValue={formState.reviewerId}
                onValueChange={handleReviewerChange} disabled={loading}>
                <SelectTrigger className="w-full" id="reviewer">
                  <SelectValue placeholder={getPlaceholderText()} />
                </SelectTrigger>
                <SelectContent>
                  {getReviewerOptions().map((x) => (
                    <SelectItem key={x.key} value={String(x.key)}>
                      {x.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Selection */}
            <div className="grid gap-2">
              <Label htmlFor="date-range">Ngày duyệt (bắt đầu - kết thúc)</Label>
              <DateRangePicker
                placeholder="Chọn ngày bắt đầu, kết thúc"
                side="left"
                align="end"
                from={formState.dateStart}
                to={formState.dateEnd}
                onApply={(range) => setFormState({ ...formState, dateStart: dateToString(range?.from), dateEnd: dateToString(range?.to) })}

              />
            </div>

            {/* Action selection */}
            <div className="grid gap-2">
              <Label htmlFor="reviewer">Hành động</Label>
              <Select defaultValue={blockchainEnabled ? String(SignType.Blockchain) : String(formState.signType)}
                onValueChange={handleSignTypeChange} disabled={loading}>
                <SelectTrigger className="w-full" id="reviewer-type">
                  <SelectValue placeholder="Chọn đối tượng duyệt" />
                </SelectTrigger>
                <SelectContent>
                  {blockchainEnabled ? (<SelectItem key={SignType.Blockchain} value={String(SignType.Blockchain)}>Giao dịch blockchain</SelectItem>) :
                    signTypes?.filter(x=>x.key!=SignType.Blockchain).map((x) => (
                      <SelectItem key={x.key} value={String(x.key)}>
                        {x.value}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            {/* Veto Right */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="veto-right"
                checked={formState.vetoRight}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true
                  setFormState((prev) => ({ ...prev, vetoRight: isChecked }))
                  console.log("Veto right:", isChecked)
                }}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1">
                      <Label htmlFor="veto-right" className="cursor-pointer">
                        Quyền phủ quyết
                      </Label>
                      <CircleHelp className="text-slate-500" size={16} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="text-sm">
                    Nếu có quyền phủ quyết, người duyệt có thể từ chối văn bản và yêu cầu kí lại ở bước bất kì trước đó
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            <Button onClick={handleSaveChanges}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
