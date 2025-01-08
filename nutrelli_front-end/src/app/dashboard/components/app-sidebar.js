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
import Logo from "../../../../public/nutrelli-logo.png";
import {useMemo} from "react";
import {Box, Layers, LogOut, ShoppingCart, Users} from "lucide-react";
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
        {title: 'Produtos', icon: <Box className="h-5 w-5"/>, href: '/dashboard/produtos'},
        {title: 'Pedidos', icon: <ShoppingCart className="h-5 w-5"/>, href: '/dashboard/pedidos'},
        {title: 'Clientes', icon: <Users className="h-5 w-5"/>, href: '/dashboard/clientes'},
        {title: 'Estoque', icon: <Layers className="h-5 w-5"/>, href: '/dashboard/estoque'},], []);
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
        <Sidebar
        collapsible="icon">
        <SidebarHeader className="px-2 py-3">

            <div className={cn(open ? "flex items-center justify-between" : "flex flex-col items-center gap-4")}>
                <Link href="/dashboard" className="flex items-center justify-center ">
                    <Image
                        src={Logo}
                        alt="Nutrelli Logo"
                        width={120}
                        height={120}
                        className="h-auto w-auto rounded-full bg-white shadow-md transition-all duration-700"
                        priority/>
                </Link>
                <SidebarTrigger className={cn(open ? "ml-2" : "mt-4")}/>
            </div>
        </SidebarHeader>
        <SidebarSeparator className="mb-2"/>
        <SidebarContent className="flex-1 ">
            <SidebarGroup>
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (<div key={item.title}>
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={isMobile && toggleSidebar}
                                className={cn("text-base mb-3 font-medium",
                                    "hover:bg-gray-100 rounded-lg",
                                    open ? "p-2 ml-2 flex items-center justify-between" : "p-1 flex flex-col items-center",)}>
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