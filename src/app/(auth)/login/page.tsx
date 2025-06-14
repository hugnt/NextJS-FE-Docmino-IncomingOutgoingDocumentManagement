"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PATH } from "@/constants/paths"
import { useAuthContext } from "@/context/authContext"
import { handleSuccessApi } from "@/lib/utils"
import { type LoginRequest, Role } from "@/types/User"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Login() {
    const { login } = useAuthContext()
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<LoginRequest>({
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const data = form.getValues()
        try {
            const loginResult = await login(data)
            handleSuccessApi({ message: "Đăng nhập thành công!" })
            if (loginResult.data?.user.roleId == Role.Approver) {
                router.push(PATH.DocumentSign)
            } else {
                router.push(PATH.Dashboard)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col justify-center px-8 py-12 lg:px-12">
            <div className="mx-auto w-full max-w-sm">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center mb-6">
                        <Image src="/images/logo.png" alt="Docmino" width={40} height={40} className="mr-3" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Docmino
                        </span>
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Chào mừng trở lại</h1>
                        <p className="text-gray-600">Đăng nhập vào tài khoản của bạn</p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-sm font-medium text-gray-700">Tên đăng nhập</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Nhập tên đăng nhập"
                                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-sm font-medium text-gray-700">Mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            {...field}
                                            placeholder="Nhập mật khẩu"
                                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <a href="#" className="text-blue-600 hover:text-blue-500 transition-colors">
                                    Quên mật khẩu?
                                </a>
                            </div>
                        </div>

                        <Button
                            loading={loading}
                            type="submit"
                            className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                            disabled={loading}
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
