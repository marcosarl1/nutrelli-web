'use client';

import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/app/dashboard/components/app-sidebar";
import MobileHeader from "@/app/dashboard/components/mobile-header";

export default function DashboardLayout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <MobileHeader/>
            <main className="flex-1 p-4 lg:p-6 m-14 lg:mt-0">
                {children}
            </main>
        </SidebarProvider>
    );
}
