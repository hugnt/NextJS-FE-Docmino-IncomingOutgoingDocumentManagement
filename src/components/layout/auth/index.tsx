import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div className="flex flex-col gap-6">
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            {children}
                            <div className="relative hidden bg-muted md:block">
                                <Image
                                    src="https://www.mastercontrol.com/images/default-source/gxp-lifeline/20222/august/2022-bl-data-integrity-standards_900x400.png?Status=Temp&sfvrsn=adfe7dcc_2"
                                    alt="Library background"
                                    layout="fill"
                                    objectFit="cover"
                                    className="dark:brightness-[0.2] dark:grayscale"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                        By clicking continue, you agree to our{" "}
                        <Link href="#">Terms of Service</Link>{" "}
                        and{" "}
                        <Link href="#">Privacy Policy</Link>.
                    </div>
                </div>
            </div>
        </div>
    );
}
