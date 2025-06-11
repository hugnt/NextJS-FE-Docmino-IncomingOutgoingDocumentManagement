"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { formatFileSize, getFileExtentions, getFileIcon, handleDownload, isPdfFile } from "@/lib/fileHelper"
import { cn } from "@/lib/utils"
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer"
import {
    AlertCircle,
    Download,
    File,
    Loader2,
    Maximize2,
    Minimize2,
    X
} from "lucide-react"
import { useEffect, useState } from "react"

interface FileViewerProps {
    isFileViewerOpen: boolean
    setIsFileViewerOpen: (open: boolean) => void
    file: { fileUrl: string; fileName?: string; fileSize?: number; fileType?: string } | null
}

export default function FileViewer(props: FileViewerProps) {
    const { isFileViewerOpen, setIsFileViewerOpen, file } = props
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        if (isFileViewerOpen && file) {
            setIsLoading(true)
            setHasError(false)
            // Simulate loading time
            const timer = setTimeout(() => {
                setIsLoading(false)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [isFileViewerOpen, file])


    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    return (
        <Dialog open={isFileViewerOpen} onOpenChange={setIsFileViewerOpen}>
            <DialogContent
                className={cn("[&>button]:hidden", `${isFullscreen ? "sm:max-w-10/12 h-[95vh]" : "sm:max-w-[1000px] h-[85vh]"} p-0 gap-0 transition-all duration-300`)}
            >
                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                {file?.fileName && getFileIcon(file.fileName)}
                                <DialogTitle className="text-lg font-semibold truncate">{file?.fileName || "Unknown File"}</DialogTitle>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    {file?.fileName && getFileExtentions(file.fileName)}
                                </Badge>
                                {file?.fileSize && (
                                    <Badge variant="outline" className="text-xs">
                                        {formatFileSize(file.fileSize)}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={()=>handleDownload({fileName: file?.fileName, fileUrl: file?.fileUrl})} className="h-8 w-8 p-0" title="Download file">
                                <Download className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleFullscreen}
                                className="h-8 w-8 p-0"
                                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                            >
                                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            </Button>
                            <Separator orientation="vertical" className="h-6" />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsFileViewerOpen(false)}
                                className="h-8 w-8 p-0"
                                title="Close"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 overflow-hidden relative bg-background h-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Loading document...</p>
                            </div>
                        </div>
                    ) : hasError ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col items-center gap-4 text-center max-w-md">
                                <AlertCircle className="h-12 w-12 text-destructive" />
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Unable to load document</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        The document could not be displayed. This might be due to an unsupported file format or a network
                                        issue.
                                    </p>
                                    <Button onClick={()=>handleDownload({fileName: file?.fileName, fileUrl: file?.fileUrl})} variant="outline">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download File
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : file ? (
                        <div className="h-full w-full bg-muted p-2">
                            {!isPdfFile(getFileExtentions(file?.fileName??""))?<DocViewer
                                documents={[
                                    {
                                        uri: file.fileUrl,
                                        fileName: file.fileName ?? "Document",
                                    },
                                ]}
                                pluginRenderers={DocViewerRenderers}
                                className="h-[78vh]! w-full"
                                config={{
                                    header: {
                                        disableHeader: true,
                                        disableFileName: true,
                                    },
                                }}

                            />:
                            <iframe className="w-full h-[78vh]" src={file.fileUrl}/>}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No file selected</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with file info */}
                {file && !isLoading && !hasError && (
                    <div className="px-6 py-3 border-t bg-muted/20">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span></span>
                            <span>Use scroll wheel to zoom • Click and drag to pan</span>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
