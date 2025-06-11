import { File, FileText } from "lucide-react"

export function formatFileSize(bytes?: number): string {
    if (!bytes || bytes < 0) return "Không xác định"
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileExtentions(fileName: string): string {
    const parts = fileName.split('.')
    if (parts.length > 1) {
        return "." + parts[parts.length - 1].toLowerCase()
    }
    return "Không xác định"
}

export function getFileIcon(fileName: string): React.ReactNode {
    const fileType = getFileExtentions(fileName).toLowerCase()
    if (fileType === ".pdf") {
        return <FileText size={16} className="text-red-500" />
    }
    if (fileType === ".png" || fileType === ".jpg" || fileType === ".jpeg" || fileType === ".gif") {
        return <FileText size={16} className="text-blue-500" />
    }
    if (fileType === ".doc" || fileType === ".docx") {
        return <FileText size={16} className="text-blue-700" />
    }
    if (fileType === ".xls" || fileType === ".xlsx") {
        return <FileText size={16} className="text-green-600" />
    }
    return <File size={16} />
}

export const handleDownload = async (file? :{fileUrl?: string, fileName?: string}) => {
    if (file?.fileUrl) {
        const response = await fetch(file.fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = file.fileName || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
    }
}

export function isFileCanBySign(fileType?: string): boolean {
    return fileType ? [".pdf"].includes(fileType.toLowerCase()) : false;
}

export function isPdfFile(fileType?: string): boolean {
    return fileType ? [".pdf"].includes(fileType.toLowerCase()) : false;
}