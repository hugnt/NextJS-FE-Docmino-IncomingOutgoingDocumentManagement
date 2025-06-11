/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import documentFileRequest from '@/api/documentFileRequest'
import FileViewer from '@/components/dialog/FileViewer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getFileTypeAccepted } from '@/constants/fileTypes'
import { formatFileSize, getFileExtentions, getFileIcon } from '@/lib/fileHelper'
import { cn, dateTimeToString, newGuid } from '@/lib/utils'
import { ProcessDetail, ProcessSignDetail } from '@/types/ConfirmProcess'
import { DocumentFile, FileEncoding } from '@/types/DocumentFile'
import { InternalDocumentDetail } from '@/types/InternalDocument'
import { FormMode } from '@/types/form'
import { format } from 'date-fns'
import { Check, Eye, File, FileUp, Pen, Trash2, X } from 'lucide-react'
import React, { Fragment, useState } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'


interface FileAttachmentProps {
    formMode?: FormMode,
    form: UseFormReturn<InternalDocumentDetail, any, InternalDocumentDetail>,
}

export default function FileAttachment(props: FileAttachmentProps) {
    const { formMode, form } = props
    const [isDragging, setIsDragging] = useState(false);
    const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
    const [editingFileId, setEditingFileId] = useState<string | null>(null)
    const [editingFileName, setEditingFileName] = useState<string>("")
    const [selectedFile, setSelectedFile] = useState<DocumentFile>()
    const [loading, setLoading] = useState<boolean>(false);
    const documentFiles = useWatch({
        control: form.control,
        name: "documentFiles",
    });

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files) {
            addFiles(e.dataTransfer.files)
        }
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files) {
            addFiles(e.target.files)
        }
    }

    const addFiles = (files: FileList) => {
        const newFiles = Array.from(files).map((file) => {
            const res: DocumentFile = {
                id: newGuid(),
                fileName: file.name,
                fileUrl: "",
                fileType: getFileExtentions(file.name),
                fileEncoding: FileEncoding.None,
                description: "",
                createdAt: format(new Date(), "yyyy-MM-dd HH:mm"),
                fileSize: file.size,
                file: file,
                isNewFile: true,
                isSigned: false,
            }
            return res
        })
        const currentFiles = documentFiles ?? []
        // Gán fileIndex cho tất cả các file sau khi thêm mới
        const updatedFiles = [...currentFiles, ...newFiles].map((file, idx) => ({
            ...file,
            fileIndex: idx,
        }))
        form.setValue("documentFiles", updatedFiles)
        console.log("Files: ", updatedFiles)
    }

    const removeFile = (id: string) => {
        const currentFiles = documentFiles ?? []
        const updatedFiles = currentFiles
            .filter((file) => file.id !== id)
            .map((file, idx) => ({
                ...file,
                fileIndex: idx,
            }))
        form.setValue("documentFiles", updatedFiles)

        const processDetails = form.getValues("confirmProcess.processDetails") ?? [];
        const updatedProcessDetails = processDetails.map((processDetail: ProcessDetail) => {
            if (!processDetail.signDetails) return processDetail;
            // Lọc và cập nhật lại signDetails
            const updatedSignDetails = processDetail.signDetails
                .filter((signDetail: ProcessSignDetail) =>
                    updatedFiles.some(file => file.id === signDetail.fileId)
                )
                .map((signDetail: ProcessSignDetail) => {
                    const fileIndex = updatedFiles.findIndex(file => file.id === signDetail.fileId);
                    return { ...signDetail, fileIndex };
                });
            return { ...processDetail, signDetails: updatedSignDetails };
        });
        form.setValue("confirmProcess.processDetails", updatedProcessDetails);
        console.log("Files: ", updatedFiles)
    }

    const startEditing = (file: any) => {
        setEditingFileId(file.id)
        setEditingFileName(file.fileName.replace(/\.[^/.]+$/, ""))
    }

    const saveFileName = (file: DocumentFile) => {
        const extension = file.fileName.includes(".") ? file.fileName.substring(file.fileName.lastIndexOf(".")) : ""
        const updatedFiles = (documentFiles ?? []).map((f) =>
            f.id === file.id ? { ...f, fileName: editingFileName + extension } : f,
        )
        form.setValue("documentFiles", updatedFiles)
        setEditingFileId(null)
    }

    const cancelEditing = () => {
        setEditingFileId(null)
    }

    const handleViewFile = async (file: DocumentFile) => {
        setLoading(true);
        await documentFileRequest.getFileUrl(file.id).then((res) => {
            file.fileUrl = res.data || "";
            setSelectedFile(file)
            setIsFileViewerOpen(true)
        }).finally(() => {
            setLoading(false)
        })
    }


    return (
        <div className="space-y-4">
            {(formMode == FormMode.ADD || formMode == FormMode.EDIT) &&
                <Fragment>
                    <Label>Tệp đính kèm</Label>
                    <div
                        className={cn(
                            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("file-upload")?.click()}>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <FileUp className="h-10 w-10 text-muted-foreground" />
                            <h3 className="font-medium text-lg">Kéo và thả tệp vào đây</h3>
                            <p className="text-sm text-muted-foreground">hoặc nhấp để chọn tệp</p>
                            <input id="file-upload" type="file" multiple accept={getFileTypeAccepted()}
                                className="hidden"
                                onChange={handleFileInputChange} />
                        </div>
                    </div>
                </Fragment>
            }


            <div className="mt-6 rounded-md border shadow-sm">
                <h3 className="font-medium p-4 bg-muted/50 border-b">Tệp đã tải lên</h3>

                {(documentFiles?.length ?? 0) > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableCell className="w-[50px] text-center font-medium">No.</TableCell>
                                <TableHead className="font-medium">Tên tệp</TableHead>
                                <TableHead className="font-medium">Loại</TableHead>
                                <TableHead className="font-medium">Kích thước</TableHead>
                                <TableHead className="font-medium">Ngày tải lên</TableHead>
                                <TableHead className="w-[100px] text-center font-medium">
                                    {loading ? <span className="animate-pulse">Đang tải...</span> : "Thao tác"}
                                    
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(documentFiles ?? []).map((file, i) => (
                                <TableRow key={file.id} className="hover:bg-muted/10">
                                    <TableCell className="text-center font-medium text-muted-foreground">{i + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            {getFileIcon(file.fileName)}
                                            {editingFileId === file.id ? (
                                                <div className="flex items-center gap-2 w-full">
                                                    <Input
                                                        value={editingFileName}
                                                        onChange={(e) => setEditingFileName(e.target.value)}
                                                        className="h-8"
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => saveFileName(file)}
                                                            className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
                                                        >
                                                            <Check size={16} />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={cancelEditing}
                                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        >
                                                            <X size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="text-sm truncate max-w-[200px]" title={file.fileName}>
                                                        {file.fileName}
                                                    </span>
                                                    {(formMode === FormMode.ADD || formMode === FormMode.EDIT) && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => startEditing(file)}
                                                            className="h-8 w-8 ml-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                            title="Đổi tên"
                                                        >
                                                            <Pen size={14} />
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{file.fileType || "Unknown"}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{formatFileSize(file.fileSize)}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{dateTimeToString(file.createdAt)}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-1">
                                            {formMode === FormMode.VIEW && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleViewFile(file)}
                                                    className="h-8 w-8 text-primary hover:text-primary/90 hover:bg-primary/10"
                                                    disabled={loading}
                                                    title="Xem tệp"
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                            )}

                                            {(formMode === FormMode.ADD || formMode === FormMode.EDIT) && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeFile(file.id)}
                                                    className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                                    title="Xóa tệp"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <File size={48} className="mb-4 text-muted-foreground/50" />
                        <p>Chưa có tệp nào được tải lên</p>
                    </div>
                )}
            </div>


            <FileViewer isFileViewerOpen={isFileViewerOpen}
                setIsFileViewerOpen={setIsFileViewerOpen}
                file={
                    selectedFile ? {
                        fileUrl: selectedFile.fileUrl || (selectedFile.file ? URL.createObjectURL(selectedFile.file) : ""),
                        fileName: selectedFile.fileName
                    } : null
                } />
        </div>
    )
}
