'use client';

import "./dashboard.css"
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/app/dashboard/components/app-sidebar";
import MobileHeader from "@/app/dashboard/components/mobile-header";

export default function DashboardLayout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <MobileHeader/>
            <main className="p-4">
                {children}
            </main>
        </SidebarProvider>
    );
}
