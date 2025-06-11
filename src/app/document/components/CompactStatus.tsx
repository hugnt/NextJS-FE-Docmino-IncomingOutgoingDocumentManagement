"use client"

import { DocumentStatus } from "@/types/Document"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import { Fragment } from "react"


interface CompactStatusProps {
    status: DocumentStatus
}
export default function CompactStatus(props: CompactStatusProps) {
    const { status } = props
    return (
        <Fragment>

            {/* In Process Status */}
            {status == DocumentStatus.InProcess && <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800 text-sm font-medium">Văn bản đang trong quá trình duyệt</span>
            </div>}

            {/* Cancel Status */}
            {status == DocumentStatus.Cancel &&<div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-red-800 text-sm font-medium">Văn bản đã hủy duyệt</span>
            </div>}

            {/* Published Status */}
            {status == DocumentStatus.Published &&<div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-800 text-sm font-medium">Văn bản đã được ban hành</span>
            </div>}
        </Fragment>
    )
}
