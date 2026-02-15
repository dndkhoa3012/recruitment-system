"use client"

import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import React from "react"

import { App } from "antd"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = React.useState(true)

    return (
        <App>
            <SidebarProvider
                open={open}
                onOpenChange={setOpen}
                className=""
                style={
                    {
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset className="overflow-x-hidden">
                    <SiteHeader />
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 min-w-0">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </App>
    )
}