import React from 'react'

interface PageHeaderProps {
    children?: React.ReactNode,
    title: string,
    subtitle?: string
}

export default function PageHeader(props: PageHeaderProps) {
    const { children, title = "Page", subtitle = "" } = props;
    return (
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
            <div>
                <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
                <p className='text-muted-foreground'>
                    {subtitle}
                </p>
            </div>
            <div className='flex gap-2'>
                {children}
            </div>
        </div>
    )
}
