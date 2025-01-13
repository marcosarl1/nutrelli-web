import {useSidebar} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {Menu} from "lucide-react";

export default function MobileHeader() {
    const {toggleSidebar} = useSidebar();
    return (
        <div className="lg:hidden md:hidden fixed top-0 left-0 right-0 z-50">
            <header className="bg-[#FFFCF5] px-4 py-3 flex items-center justify-start shadow-sm">
                <Button
                    variant="ghost"
                    onClick={toggleSidebar}
                className="hover:bg-orange-200/80">
                    <Menu /></Button>
                <h1 className="text-lg ml-2 font-semibold">Nutrelli Funcionário</h1>
            </header>
        </div>
    );
}