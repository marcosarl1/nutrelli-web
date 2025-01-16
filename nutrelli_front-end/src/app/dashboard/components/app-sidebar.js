import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import {useMemo} from "react";
import {Archive, House, LayoutDashboard, LogOut, ShoppingBasket, Store, Users} from "lucide-react";
import {Button} from "@/components/ui/button";
import {logout} from "@/services/loginService";
import {useRouter, usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export function AppSidebar() {
    const {open, toggleSidebar, isMobile} = useSidebar();
    const menuItems = useMemo(() => [
        {title: 'Início', icon: <House className="h-5 w-5 text-red-700"/>, href: '/dashboard'},
        {title: 'Produtos', icon: <Store className="h-5 w-5 text-red-700"/>, href: '/dashboard/produtos'},
        {title: 'Pedidos', icon: <ShoppingBasket className="h-5 w-5 text-red-700"/>, href: '/dashboard/pedidos'},
        {title: 'Estoque', icon: <Archive className="h-5 w-5 text-red-700"/>, href: '/dashboard/estoque'},], []);
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await logout();
            await router.push('/login');
        } catch (error) {
            console.error('Erro ao fazer logout: ', error);
        }
    }
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <button onClick={toggleSidebar} className="flex justify-center items-center my-6">
                    <LayoutDashboard className="h-5 w-5 text-red-700"/>
                </button>
                <div className={cn("mb-6", open ? "px-10 justify-between" : "p-1 flex flex-col items-center gap-4")}>
                    <Link href="/dashboard" className="flex items-center justify-center ">
                        <Image
                            src={open ? '/nutrelli.svg' : '/nutrelli-icon.svg'}
                            alt="Nutrelli Logo"
                            width={open ? 190 : 50}
                            height={open ? 90 : 50}
                            style={{width: '100%', height: '100%'}}
                            className="transition ease-linear"
                            priority/>
                    </Link>

                </div>
            </SidebarHeader>
            <SidebarContent className="">
                <SidebarGroup>
                    <nav className="space-y-6">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (<div key={item.title}>
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={isMobile && toggleSidebar}
                                    className={cn("text-base font-normal",
                                        "hover:bg-red-50 rounded-lg",
                                        open ? "pl-7 py-2 m-3 flex items-center justify-between" : "p-1 py-2 flex flex-col items-center",
                                        isActive && "text-red-700 font-medium bg-red-50")}>
                                    <div className="flex items-center">{item.icon}
                                        {open && <span className="ml-3 ">{item.title}</span>}
                                    </div>
                                </Link>
                            </div>)
                        })}
                    </nav>
                </SidebarGroup>
            </SidebarContent>
            <SidebarSeparator/>
            <SidebarFooter>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            className="w-full justify-center gap-2">
                            <LogOut className="h-5 w-5"/>
                            <span className={!open ? 'hidden' : 'block'}>Sair</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar saída</AlertDialogTitle>
                            <AlertDialogDescription>Tem certeza que deseja sair do
                                sistema?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-500/90">Sair</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </SidebarFooter>
        </Sidebar>)
}