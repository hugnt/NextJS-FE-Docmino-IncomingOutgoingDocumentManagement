export default function ErrorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='h-svh'>
            <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                {children}
            </div>
        </div>
    )
}