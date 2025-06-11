import { Badge } from "@/components/ui/badge"
import { DirectoryType } from "@/types/DocumentDirectory"
import { ContainerStatus } from "@/types/Dossier"
import { Archive, Folder, Package, Warehouse } from "lucide-react"

export function getDirectoryIcon(type: DirectoryType, size: number = 8): React.ReactNode {
    if (type === DirectoryType.Inventory) {
        return <Warehouse className={`h-${size} w-${size} text-blue-600`} />
    }
    if (type === DirectoryType.Sheft) {
        return <Archive className={`h-${size} w-${size} text-purple-600`} />
    }
    if (type === DirectoryType.Box) {
        return <Package className={`h-${size} w-${size} text-green-600`} />
    }
    return <Folder size={16} />
}

export function getDirectoryName(type: DirectoryType): string {
    if (type === DirectoryType.Inventory) {
        return "Kho"
    }
    if (type === DirectoryType.Sheft) {
        return "Kệ"
    }
    if (type === DirectoryType.Box) {
        return "Hộp"
    }
    return "Thư mục"
}

export function getParentDirectoryIcon(type: DirectoryType): React.ReactNode {
    if (type === DirectoryType.Sheft) {
        return <Warehouse className="h-4 w-4 text-blue-600" />
    }
    if (type === DirectoryType.Box) {
        return <Archive className="h-4 w-4 text-purple-600" />
    }
    return <Folder size={16} />
}


export const getDossierStatusBadge = (status: ContainerStatus) => {
    switch (status) {
        case ContainerStatus.Open:
            return <Badge className="bg-green-500">Đang hoạt động</Badge>
        case ContainerStatus.Closed:
            return <Badge className="bg-yellow-500">Không hoạt động</Badge>
        case ContainerStatus.Cancel:
            return <Badge className="bg-blue-500">Đã hủy</Badge>
        default:
            return <Badge className="bg-gray-500">Nháp</Badge>
    }
}