"use client";

import {Edit, Edit3, Ellipsis, Filter, Loader2, Plus, Search, Trash2} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useCallback, useEffect, useState} from "react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Pagination} from "@/app/dashboard/components/pagination";
import {cn} from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {inventoryService} from "@/services/inventoryService";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Badge} from "@/components/ui/badge";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {useToast} from "@/hooks/use-toast";
import {InventoryForm} from "@/app/dashboard/components/inventory-form";
import productsService from "@/services/productsService";

export default function Inventory() {
    const [inventory, setInventory] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [newQuantity, setNewQuantity] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState('');
    const [activeFilter, setActiveFilter] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalElements: 0
    });
    const {toast} = useToast();

    const fetchInventory = useCallback(async () => {
        try {
            setLoading(true);
            const startTime = Date.now();
            const data = await inventoryService.findAllItems(
                pagination.currentPage - 1,
                pagination.pageSize,
                searchQuery,
                activeFilter
            );
            const elapsed = Date.now() - startTime;
            if (elapsed < 500) {
                await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
            }
            setInventory(data.content);
            setPagination(prevState => ({
                ...prevState,
                totalPages: data.totalPages,
                totalElements: data.totalElements,
            }));
        } catch (error) {
            setErrors(error.message);
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, pagination.pageSize, searchQuery, activeFilter]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchInventory();
        }
        fetchData();
    }, [fetchInventory]);

    const handleAddItem = async (formData) => {
        try {
            setLoading(true);
            await inventoryService.addItem(formData);
            await fetchInventory();
            toast({
                title: <span>&#x2705; Item adicionado!</span>,
                description: "O item foi adicionado com sucesso ao estoque."
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao adicionar item",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }

    const handleEditItem = async (formData) => {
        try {
            setLoading(true);
            await inventoryService.updateItem(selectedItem.id, formData);
            await fetchInventory();
            toast({
                title: <span>&#x2705; Item adicionado!</span>,
                description: "O item foi atualizado com sucesso ao estoque."
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao atualizar item",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteItem = async () => {
        try {
            setLoading(true);
            await inventoryService.deleteItem(selectedItem.id);
            setIsDeleteDialogOpen(false);
            await fetchInventory();
            setSelectedItem(null);
            setPagination(prevState => ({...prevState, currentPage: 1}));
            toast({
                description: <span>&#x2705; Produto deletado com sucesso!</span>,
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao atualizar item",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }

    const handleUpdateQuantity = async (itemId) => {
        try {
            setLoading(true);
            await inventoryService.updateQuantity(itemId, parseFloat(newQuantity));
            await fetchInventory();
            setNewQuantity("");
            toast({
                title: <span>&#x2705; Quantidade atualizada!</span>,
                description: "A quantidade foi atualizada com sucesso"
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao atualizar quantidade",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }

    const resetFilters = () => {
        setSearchQuery('');
        setActiveFilter(false);
        setPagination(prevState => ({...prevState, currentPage: 1}));
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setActiveFilter(false);
        setPagination(prevState => ({...prevState, currentPage: 1}));
    }

    const handlePageChange = (newPage) => {
        setPagination(prevState => ({
            ...prevState, currentPage: newPage
        }))
    };

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
                            value={searchQuery}
                            onChange={handleSearch}
                            className={"pl-9"}/>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"} className={"gap-2"}>
                                <Filter className={"h-4 w-4"}/>
                                <span className={"hidden sm:inline"}>Filtros</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={"end"} className={"w-48"}>
                            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                className={cn("cursor-pointer",
                                    activeFilter === false ? "bg-blue-50" : "")}
                                onClick={resetFilters}>
                                Todos
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                className={cn("cursor-pointer",
                                    activeFilter === true ? "bg-blue-50" : "")}
                                onClick={() => setActiveFilter(true)}>
                                Estoque baixo
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className={"gap-2 bg-red-900 hover:bg-red-900/90"}>
                            <Plus className={"h-4 w-4"}/>
                            <span className={"hidden sm:inline"}>Novo item</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adicionar item ao estoque</DialogTitle>
                            <DialogDescription>Preencha os dados do novo item</DialogDescription>
                        </DialogHeader>
                        <InventoryForm
                            onSubmit={async (formData) => {
                                await handleAddItem(formData);
                                setIsDialogOpen(false)
                            }}
                            isSubmitting={loading}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <div className={"border rounded-lg"}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className={"w-0 sm:w-[100px]"}>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className={"text-center py-8"}>
                                    <div className={"flex justify-center items-center gap-2"}>
                                        <Loader2 className={"h-4 w-4 animate-spin"}/>
                                        Carregando itens...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : inventory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className={"text-center py-8 text-gray-500"}>
                                    Nenhum item encontrado
                                </TableCell>
                            </TableRow>
                        ) : (
                            inventory.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className={"font-medium"}>{item.name}</TableCell>
                                    <TableCell>
                                        <div className={"flex items-center gap-2"}>
                                            {item.quantity} {item.measurementUnit}
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"ghost"}
                                                        size={"icon"}
                                                        className={""}>
                                                        <Edit3 className={"h-4 w-4"}/>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className={"w-60"}>
                                                    <div className={"space-y-4"}>
                                                        <span className={"text-sm"}>Insira a nova quantidade</span>
                                                        <Input type={"number"}
                                                               value={newQuantity}
                                                               onChange={(e) => setNewQuantity(e.target.value)}/>
                                                        <Button
                                                            className={"cursor-pointer bg-red-900 hover:bg-red-900/90"}
                                                            onClick={() => handleUpdateQuantity(item.id)}>Salvar</Button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={item.quantity < item.minimumQuantity ? "destructive" : "outline"}
                                            className={"px-3 py-0.5"}>
                                            {item.quantity < item.minimumQuantity ? "Baixo Estoque" : "Normal"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant={"ghost"} size={"icon"}>
                                                        <Ellipsis className={"h-4 w-4"}/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align={"end"}>
                                                    <DialogTrigger asChild onClick={() => setSelectedItem(item)}>
                                                        <DropdownMenuItem className={"gap-2"}>
                                                            <Edit className={"h-4 w-4"}/>
                                                            Editar
                                                        </DropdownMenuItem>
                                                    </DialogTrigger>
                                                    <DropdownMenuItem
                                                        className={"gap-2 text-red-600"}
                                                        onClick={() => {
                                                            setSelectedItem(item)
                                                            setIsDeleteDialogOpen(true);
                                                        }}>
                                                        <Trash2 className={"h-4 w-4"}/>
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Editar item no estoque</DialogTitle>
                                                    <DialogDescription>Altere os dados do item</DialogDescription>
                                                </DialogHeader>
                                                <InventoryForm
                                                    onSubmit={async (formData) => {
                                                        await handleEditItem(formData);
                                                        setIsDialogOpen(false)
                                                    }}
                                                    isSubmitting={loading}
                                                    initialData={selectedItem}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalElements={pagination.totalElements}
                pageSize={pagination.pageSize}
                onPageChange={handlePageChange}
                itemsLabel={"itens"}/>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o item &#34;{selectedItem?.name}&#34;?
                            Esta ação não poderá ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className={"bg-red-600 hover:bg-red-700 focus:ring-red-600"}
                            disabled={loading}
                            onClick={handleDeleteItem}>
                            {loading ? (
                                <>
                                    <Loader2 className={"h-4 w-4 animate-spin mr-2"}/>
                                    Excluíndo
                                </>
                            ) : ('Excluir')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}