"use client";

import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useState} from "react";

export default function Stock() {
    const [searchQuery, setSearchQuery] = useState("");
    return (
        <div className={"space-y-6"}>
            <div className={"flex justify-between items-center"}>
                <h1 className={"text-2xl font-bold"}>Estoque</h1>
            </div>
            <div className={"flex items-center justify-between"}>
                <div className={"flex gap-1 sm:gap-3 items-center"}>
                    <div className={"relative w-52 lg:w-80"}>
                        <Search className={"absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"}/>
                        <Input
                            placeholder={"Buscar items..."}
                            value={searchQuery}/>
                    </div>
                </div>
            </div>
        </div>
    )
}