'use client';

import Sidebar from "@/app/dashboard/components/sidebar";
import {useState} from "react";

export default function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    return (
        <html lang="en">
            <body>
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>
                <main className="d-flex flex-grow-1 p-4" style={{marginLeft: isSidebarOpen ? '280px' : '80px', transition: 'margin-left 0.3s ease'}}>{children}</main>
            </body>
        </html>
    );
}
