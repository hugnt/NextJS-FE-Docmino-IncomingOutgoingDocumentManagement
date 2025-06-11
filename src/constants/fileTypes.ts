interface AllowedFileType {
    type: string;
    maxSize: number; // in bytes
}

const ALLOWED_FILE_TYPES: AllowedFileType[] = [
    { type: "application/pdf", maxSize: 10 * 1024 * 1024 }, // .pdf, 10MB
    { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", maxSize: 10 * 1024 * 1024 }, // .docx, 10MB
    { type: "application/msword", maxSize: 10 * 1024 * 1024 }, // .doc, 10MB
    { type: "image/jpeg", maxSize: 5 * 1024 * 1024 }, // .jpg, .jpeg, 5MB
    { type: "image/png", maxSize: 5 * 1024 * 1024 }, // .png, 5MB
    { type: "image/gif", maxSize: 5 * 1024 * 1024 }, // .gif, 5MB
    { type: "image/bmp", maxSize: 5 * 1024 * 1024 }, // .bmp, 5MB
    { type: "image/webp", maxSize: 5 * 1024 * 1024 }, // .webp, 5MB
    { type: "application/vnd.ms-excel", maxSize: 10 * 1024 * 1024 }, // .xls, 10MB
    { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", maxSize: 10 * 1024 * 1024 }, // .xlsx, 10MB
    { type: "text/csv", maxSize: 2 * 1024 * 1024 }, // .csv, 2MB
    { type: "text/plain", maxSize: 2 * 1024 * 1024 }, // .txt, 2MB
];

export const isFileTypeAllowed = (fileType: string): boolean => {
    return ALLOWED_FILE_TYPES.some(ft => ft.type === fileType);
};

export const getFileTypeDescription = (fileType: string): string => {
    switch (fileType) {
        case "application/pdf":
            return "PDF Document (.pdf)";
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return "Word Document (.docx)";
        case "application/msword":
            return "Word Document (.doc)";
        case "image/jpeg":
            return "JPEG Image (.jpg, .jpeg)";
        case "image/png":
            return "PNG Image (.png)";
        case "image/gif":
            return "GIF Image (.gif)";
        case "image/bmp":
            return "Bitmap Image (.bmp)";
        case "image/webp":
            return "WebP Image (.webp)";
        case "application/vnd.ms-excel":        
            return "Excel Spreadsheet (.xls)";
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            return "Excel Spreadsheet (.xlsx)";
        case "text/csv":
            return "CSV File (.csv)";
        case "text/plain":
            return "Text File (.txt)";
        default:
            return "Unknown File Type";
    }
};

export const getFileTypeAccepted = (): string => {
    return ALLOWED_FILE_TYPES.map(ft => ft.type).join(",");
};