"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PATH } from "@/constants/paths";
import { useAuthContext } from "@/context/authContext";
import { handleSuccessApi } from "@/lib/utils";
import { LoginRequest, Role } from "@/types/User";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function Login() {
    const { login } = useAuthContext();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<LoginRequest>({
        defaultValues: {
            username: '',
            password: ''
        },
    });

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const data = form.getValues();
        try {
            const loginResult = await login(data);
            handleSuccessApi({ message: "Đăng nhập thành công!" });
            if (loginResult.data?.user.roleId == Role.Approver) {
                router.push(PATH.DocumentSign);
            }
            else {
                router.push(PATH.Dashboard);
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-muted">
            <Form {...form}>
                <form onSubmit={handleFormSubmit} className="p-6 md:p-8 w-full max-w-md bg-white shadow rounded-lg">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col items-center text-center">
                            <h1 className="text-2xl font-bold">Welcome Back</h1>
                            <p className="text-muted-foreground">
                                Login to your Docmino account
                            </p>
                        </div>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter username" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} placeholder="Enter password" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button loading={loading} type="submit" className="w-full">
                            Login
                        </Button>
                        {/* <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href={PATH.Register} className="underline underline-offset-4">
                                Register
                            </Link>
                        </div> */}
                    </div>
                </form>
            </Form>
        </div>
    );
}
