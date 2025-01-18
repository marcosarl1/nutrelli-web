'use client';

import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/app/dashboard/components/app-sidebar";
import MobileHeader from "@/app/dashboard/components/mobile-header";
import {Toaster} from "@/components/ui/toaster";

export default function DashboardLayout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <MobileHeader/>
            <main className="flex-1 p-4 mt-16 md:mt-4 lg:mt-4 md:p-2 lg:p-2 sm:mx-0 md:mx-8 lg:mx-14">
                {children}
            </main>
            <Toaster/>
        </SidebarProvider>
    );
}
