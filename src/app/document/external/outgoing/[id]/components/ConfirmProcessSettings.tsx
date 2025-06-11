/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import documentFileRequest from '@/api/documentFileRequest';
import PDFSignatureSettingDetails from '@/app/document/components/PDFSignatureSettingDetails';
import PDFSignatureSettingList from '@/app/document/components/PDFSignatureSettingList';
import PDFSigningDetails from '@/app/document/components/PDFSigningDetails';
import PDFSigningList from '@/app/document/components/PDFSigningList';
import ReviewerSettings from '@/app/document/components/ReviewerSettings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useDocumentContext } from '@/context/documentContext';
import { isFileCanBySign } from '@/lib/fileHelper';
import { cn, formatDate, handleError } from '@/lib/utils';
import { defaultConfirmProcess, defaultProcessDetails, ImageSignature, ProcessDetail, ProcessSignDetail, ProcessStatus, SignType } from '@/types/ConfirmProcess';
import { DocumentFile } from '@/types/DocumentFile';
import { ExternalDocumentDetail } from '@/types/ExternalDocument';
import { File, Pen, Plus } from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';

interface ConfirmProcessSettingsProps {
  form: UseFormReturn<ExternalDocumentDetail, any, ExternalDocumentDetail>,
  readOnly?: boolean;
  signerProcess?: ProcessDetail | null;
  imageSignatures?: ImageSignature[];
  setImageSignatures?: (signatures?: ImageSignature[]) => void;
}

const getProcessDefault = (stepNumber: number) => {
  return {
    ...defaultProcessDetails,
    stepNumber,
  }
}

export default function ConfirmProcessSettings(props: ConfirmProcessSettingsProps) {
  const { form, readOnly, signerProcess, imageSignatures, setImageSignatures = () => { } } = props;
  const { processTypes, processManagers } = useDocumentContext();
  const [openReviewerDiaglog, setOpenReviewerDialog] = useState<boolean>(false);
  const [selectedProcess, setSelectedProcess] = useState<ProcessDetail>();
  const [showSignSettings, setShowSignSettings] = useState<boolean>(false);
  const [openPDFSignatureSettings, setOpenPDFSignatureSettings] = useState<boolean>(false);
  const [openPDFSigningSettings, setOpenPDFSigningSettings] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<DocumentFile>();
  const [selectedSignDetails, setSelectedSignDetails] = useState<ProcessSignDetail>();
  const [loading, setLoading] = useState<boolean>(false);

  const processCount = form.watch('processCount');

  const documentFiles = useWatch({
    control: form.control,
    name: "documentFiles",
  });

  const blockchainEnabled = useWatch({
    control: form.control,
    name: "confirmProcess.blockchainEnabled",
  });

  const watchedProcessDetails = useWatch({
    control: form.control,
    name: "confirmProcess.processDetails",
  });

  const processDetails = useMemo(() => {
    const showingFileSetting = (watchedProcessDetails ?? []).some((x: ProcessDetail) => x.signType == SignType.Image || x.signType == SignType.DigitalSignature);
    setShowSignSettings(showingFileSetting);
    return watchedProcessDetails ?? [];
  }, [watchedProcessDetails]);

  const isDocumentInProcess = form.getValues("confirmProcess")?.status == ProcessStatus.InProcess;

  useEffect(() => {
    const showingFileSetting = processDetails.some(x => x.signType == SignType.Image || x.signType == SignType.DigitalSignature);
    setShowSignSettings(showingFileSetting);
  }, [processDetails])

  const hanleChangeConfirmLevel = (value: number) => {
    form.setValue('processCount', value);
    if (value === 0) {
      form.setValue("confirmProcess", null);
    }
    else {
      form.setValue("confirmProcess", defaultConfirmProcess);
    }
  }

  const handleSetReviewer = (data?: ProcessDetail) => {
    setSelectedProcess(data);
    setOpenReviewerDialog(true)
  };

  const handleSetPDFSignature = async (data: DocumentFile) => {
    if (data.isNewFile) {
      setSelectedFile(data);
      setOpenPDFSignatureSettings(true)
    }
    else {
      setLoading(true);
      await documentFileRequest.getFileUrl(data.id).then((res) => {
        data.fileUrl = res.data || "";
        setSelectedFile(data);
        setOpenPDFSignatureSettings(true)
      }).finally(() => {
        setLoading(false)
      })
    }

  }

  const handleSaveReviewer = (data: ProcessDetail, isReset = false) => {
    if (isReset) {
      return;
    }
    if ((data.signType == SignType.Image || data.signType == SignType.DigitalSignature)
      && (!documentFiles?.some(x => isFileCanBySign(x.fileType)))) {
      handleError({ title: "Chọn hình thức ký thất bại", message: "Vui lòng tải lên tệp PDF trước khi chọn hình thức ký này" });
      // form.setValue(`confirmProcess.processDetails.${data.stepNumber - 1}.signType`, SignType.None);
      return;
    }
    if (data.signType == SignType.None && form.getValues(`confirmProcess.processDetails`)?.some(x => x.signType != SignType.None)) {
      setShowSignSettings(false);
    } else {
      setShowSignSettings(true);
    }
    form.setValue(`confirmProcess.processDetails.${data.stepNumber - 1}`, data)
    setOpenReviewerDialog(false)
  }

  const handleSaveSignatureSettings = (data?: ProcessDetail[]) => {
    if (data) {
      form.setValue("confirmProcess.processDetails", data)
    }
    setOpenPDFSignatureSettings(false)
  }


  const handlePDFSigningViewer = async (data: DocumentFile) => {
    setLoading(true);
    await documentFileRequest.getFileUrl(data.id).then((res) => {
      data.fileUrl = res.data || "";
      const signatureInfo = signerProcess?.signDetails?.find(x => x.fileId === data.id);
      setSelectedFile(data);
      setSelectedSignDetails(signatureInfo);
      setOpenPDFSigningSettings(true)
    }).finally(() => {
      setLoading(false)
    })

  }

  const handleSaveUserSignature = (data?: ImageSignature, isReset = false) => {
    if (!data) return;
    console.log("handleSaveUserSignature", data);
    const updatedImageSignatures = [
      ...(imageSignatures?.filter(x => x.fileId !== data.fileId) || []),
      { ...data, isVerify: !isReset && data.isVerify }
    ];
    setImageSignatures(updatedImageSignatures);
    setOpenPDFSigningSettings(isReset);
  };


  return (
    <div className='grid grid-cols-4 gap-3'>
      <FormField
        name='processCount'
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Số lượng cấp duyệt</FormLabel>
            <Select
              value={field.value ? String(field.value) : "0"}
              defaultValue="0"
              disabled={readOnly}
              onValueChange={val => hanleChangeConfirmLevel(Number(val))}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Chọn số lượng cấp duyệt" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="0" value="0">Không duyệt</SelectItem>
                {Array.from({ length: 10 }, (_, i) => {
                  const value = (i + 1).toString();
                  return (
                    <SelectItem key={value} value={value}>
                      {`${value} cấp duyệt`}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {processCount != null && processCount !== 0 && (
        <Fragment>
          <FormField
            control={form.control}
            name="confirmProcess.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mức độ của quy trình duyệt</FormLabel>
                <Select
                  value={field.value ? String(field.value) : "2"}
                  onValueChange={val => field.onChange(Number(val))}>
                  <FormControl className="w-full">
                    <SelectTrigger disabled={readOnly}>
                      <SelectValue placeholder="Trạng thái xử lý" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent >
                    {
                      processTypes?.map(x => {
                        return <SelectItem key={x.key} value={String(x.key)}>{x.value}</SelectItem>
                      })
                    }
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmProcess.managerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Người chịu trách nhiệm</FormLabel>
                <Select
                  defaultValue={processManagers && processManagers.length > 0 ? processManagers[0].key : ""}
                  value={field.value}
                  onValueChange={field.onChange}>
                  <FormControl className="w-full">
                    <SelectTrigger disabled={readOnly}>
                      <SelectValue placeholder="Chọn người giám sát" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent >
                    {
                      processManagers?.map(x => {
                        return <SelectItem key={x.key} value={x.key}>{x.value}</SelectItem>
                      })
                    }
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmProcess.blockchainEnabled'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel>Duyệt trên Blockchain</FormLabel>
                <FormControl>
                  <div className='flex items-center space-x-3'>
                    <Switch
                      disabled={readOnly}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      name={field.name}
                    />
                    <span className='text-sm mb-1 italic'>*Các tài khoản duyệt phải có ví Cardano</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div></div>
          <div></div>
          <FormField
            control={form.control}
            name='confirmProcess.description'
            render={({ field }) => (
              <FormItem className='space-y-1 col-span-5'>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea readOnly={readOnly} className="min-h-auto"  {...field} placeholder='Nhập mô tả' rows={1} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Fragment>
      )}

      {processCount != null && processCount !== 0 &&
        <Fragment>
          <div className="col-span-2 p-6 space-y-0 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {isDocumentInProcess ? "Quy trình duyệt" : "Thiết lập quy trình duyệt"}
              </h2>
            </div>
            {Array.from({ length: Number(processCount) }, (_, index) => {
              const processInfo = processDetails[index]
              const isExistingApprover = !!processInfo
              const isCurrentProcessStep = processInfo?.stepNumber === form.getValues("confirmProcess.currentStepNumber");
              const isNextProcessStep = processInfo?.stepNumber > form.getValues("confirmProcess.currentStepNumber");
              return (
                <div key={index} className="relative">
                  <div className={`flex items-start'}  space-x-4`}>
                    <div className="relative flex flex-col items-center">
                      <div
                        className={cn("rounded-full h-12 w-12 border-2 flex items-center justify-center text-lg font-medium shadow-sm",
                          isExistingApprover ? "border-blue-500 bg-blue-500 text-white" : "border-blue-400 bg-white text-blue-500",
                          isDocumentInProcess && (isCurrentProcessStep ? "border-green-500 bg-green-500 text-white" : isNextProcessStep && "border-blue-200 bg-blue-200 text-white"))}
                      >
                        {index + 1}
                      </div>

                      {index < processCount! - 1 && (
                        <div className="flex flex-col items-center">
                          <div className={cn("h-10 w-0.5 bg-blue-400", isDocumentInProcess && isNextProcessStep && "bg-blue-200")}></div>
                          <div className={cn("w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-blue-400 mb-1", isDocumentInProcess && isNextProcessStep && "border-t-blue-200")}></div>
                        </div>
                      )}
                    </div>

                    {isExistingApprover ? (
                      <div className={cn("flex-1 bg-blue-50 rounded-lg p-3 shadow-sm h-fit", isDocumentInProcess && isCurrentProcessStep && "bg-green-50 border-2 border-green-200 border-dashed ")}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{processInfo.reviewerName}</p>
                            <p className="text-xs text-gray-600">Ngày duyệt: {formatDate(processInfo.dateStart)} - {formatDate(processInfo.dateEnd)}</p>
                            <p className="text-xs text-gray-600">Hành động: {processInfo.actionName}</p>
                          </div>
                          <div className='space-x-3'>
                            {!readOnly && <Button
                              onClick={() => handleSetReviewer(processInfo)}
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100"
                              title="Sửa thông tin người duyệt">
                              <Pen size={16} />
                            </Button>}
                            {isDocumentInProcess &&
                              (isCurrentProcessStep ?
                                <Badge className='bg-yellow-500'>Chờ duyệt</Badge>
                                : isNextProcessStep ? <Badge className='bg-blue-500'>Chưa duyệt</Badge> : <Badge className='bg-green-500'>Đã duyệt</Badge>)
                            }
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button
                        disabled={readOnly}
                        onClick={() => handleSetReviewer(getProcessDefault(index + 1))}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2 text-blue-500 border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                        title="Thêm người duyệt">
                        <Plus size={16} className="mr-2 " /> Thêm người duyệt
                      </Button>
                    )}
                  </div>
                </div>
              )
            }
            )}
          </div>

          {showSignSettings && !isDocumentInProcess &&
            <Fragment>
              {(documentFiles?.filter(x => isFileCanBySign(x.fileType))?.length ?? 0) > 0 ? (
                <PDFSignatureSettingList
                  pdfFiles={documentFiles!.filter(x => isFileCanBySign(x.fileType))}
                  readOnly={readOnly}
                  loading={loading}
                  handleSetPDFSignature={handleSetPDFSignature}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <File size={48} className="mb-4 text-muted-foreground/50" />
                  <p>Chưa có tệp nào được tải lên</p>
                </div>
              )}
            </Fragment>
          }

          {isDocumentInProcess
            && signerProcess && signerProcess.signDetails && signerProcess.signDetails.length > 0
            && <PDFSigningList
              loading={loading}
              imageSignatures={imageSignatures}
              pdfFiles={documentFiles!.filter(x => isFileCanBySign(x.fileType) && signerProcess.signDetails!.some(y => y.fileId === x.id))}
              handlePDFSigningViewer={handlePDFSigningViewer}
            />}
        </Fragment>
      }

      <ReviewerSettings
        processDetail={selectedProcess}
        onOpenChange={setOpenReviewerDialog}
        open={openReviewerDiaglog}
        onSave={handleSaveReviewer}
        blockchainEnabled={blockchainEnabled}
      />


      <PDFSignatureSettingDetails
        processDetails={processDetails}
        file={selectedFile}
        open={openPDFSignatureSettings}
        onOpenChange={setOpenPDFSignatureSettings}
        onSave={handleSaveSignatureSettings}
      />

      <PDFSigningDetails
        file={selectedFile}
        imageSignature={imageSignatures?.find(x => x.fileId === selectedFile?.id)}
        signerSettings={selectedSignDetails}
        open={openPDFSigningSettings}
        onOpenChange={setOpenPDFSigningSettings}
        onSave={handleSaveUserSignature}
      />

    </div>
  )
}