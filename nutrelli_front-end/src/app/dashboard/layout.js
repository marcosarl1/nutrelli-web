'use client';

import Sidebar from "@/app/dashboard/components/sidebar/sidebar";
import {useState} from "react"
import "./dashboard.css"

export default function DashboardLayout({children}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    return (
        <div className="d-flex">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>
            <main className={`d-flex flex-grow-1 p-4 w-100 ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                {children}
            </main>
        </div>
    );
}
