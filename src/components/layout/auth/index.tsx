import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <div className="flex flex-col gap-6">
                    <Card className="overflow-hidden shadow-2xl border-0 p-0">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            {children}
                            <div className="relative hidden bg-gradient-to-br from-blue-600 to-purple-600 md:block">
                                <div className="absolute inset-0 bg-black/20"></div>
                                <Image
                                    src="https://www.mastercontrol.com/images/default-source/gxp-lifeline/20222/august/2022-bl-data-integrity-standards_900x400.png?Status=Temp&sfvrsn=adfe7dcc_2"
                                    alt="Document Management System"
                                    fill
                                    className="object-cover opacity-80"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white p-8">
                                        <h2 className="text-3xl font-bold mb-4">Hệ thống quản lý văn bản điện tử</h2>
                                        <p className="text-lg opacity-90">
                                            Quản lý văn bản đến, đi và nội bộ theo quy trình chuẩn, minh bạch và bảo mật
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="text-balance text-center text-xs text-gray-500 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-blue-600">
                        Bằng cách tiếp tục, bạn đồng ý với{" "}
                        <Link href="#" className="text-blue-600">
                            Điều khoản dịch vụ
                        </Link>{" "}
                        và{" "}
                        <Link href="#" className="text-blue-600">
                            Chính sách bảo mật
                        </Link>{" "}
                        của chúng tôi.
                    </div>
                </div>
            </div>
        </div>
    )
}
