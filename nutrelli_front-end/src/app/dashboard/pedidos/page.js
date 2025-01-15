'use client';

import {Edit, Filter, Loader2, Plus, Search} from "lucide-react";
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
import {Badge} from "@/components/ui/badge";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {useToast} from "@/hooks/use-toast";
import {OrderForm} from "@/app/dashboard/components/order-form";
import {ordersService} from "@/services/ordersService";
import {Pagination} from "@/app/dashboard/components/pagination";

export default function Orders() {
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalElements: 0
    });
    const {toast} = useToast();

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const startTime = Date.now();
            const data = await ordersService.findAllOrders(
                pagination.currentPage - 1,
                pagination.pageSize,
                searchQuery,
                selectedStatus
            );
            const elapsed = Date.now() - startTime;
            if (elapsed < 500) {
                await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
            }
            setOrders(data.content);
            setPagination(prevState => ({
                ...prevState,
                totalPages: data.totalPages,
                totalElements: data.totalElements,
            }));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, pagination.pageSize, searchQuery, selectedStatus]);

    const fetchOrderStatuses = useCallback(async () => {
        try {
            setLoading(true);
            const data = await ordersService.findAllOrderStatuses();
            setStatuses(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await fetchOrders();
            await fetchOrderStatuses()
        };
        fetchData()
    }, [fetchOrders, fetchOrderStatuses]);

    const handleAddOrder = async (formData) => {
        try {
            setLoading(true);
            console.log(formData);
            await ordersService.addOrder(formData);
            toast({
                title: <span>&#x2705; Pedido adicionado com sucesso</span>,
                description: "O pedido foi salvo no sistema",
            });
            await fetchOrders()
        } catch (error) {
            toast({
                title: "Erro ao adicionar pedido",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setLoading(false);
        }
    }

    const handleEditOrder = async (formData) => {
        try {
            setLoading(true);
            console.log(formData);
            await ordersService.editOrder(selectedOrder.id, formData);
            toast({
                title: <span>&#x2705; Pedido atualizado com sucesso</span>,
                description: "O pedido foi atualizado com sucesso"
            });
            await fetchOrders();
        } catch (error) {
            toast({
                title: "Erro ao atualizar produto",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setLoading(false);
        }
    }

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedStatus(null);
        setPagination(prevState => ({...prevState, currentPage: 1}));
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setPagination(prevState => ({...prevState, currentPage: 1}));
    }

    const handleStatusSelect = (status) => {
        setSearchQuery('');
        setSelectedStatus(status);
        setPagination(prevState => ({...prevState, currentPage: 1}));
    }

    const handlePageChange = (newPage) => {
        setPagination(prevState => ({
            ...prevState, currentPage: newPage
        }))
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Pedidos</h1>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-1 sm:gap-3 items-center">
                    <div className="relative w-52 lg:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"/>
                        <Input
                            placeholder="Buscar pedidos..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="pl-9"/>
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
                                className={cn('cursor-pointer', selectedStatus === null ? "bg-blue-50" : "")}
                                onClick={() => resetFilters()}>Todos</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            {statuses.map((status) => (
                                <DropdownMenuItem
                                    key={status.name}
                                    className={cn("cursor-pointer", selectedStatus && selectedStatus.name === status.name ? "bg-blue-50" : "")}
                                    onClick={() => handleStatusSelect(status)}>
                                    {status.description}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-red-900 hover:bg-red-900/90">
                            <Plus className={"h-4 w-4"}/>
                            <span className={"hidden sm:inline"}>Novo pedido</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adicionar pedido</DialogTitle>
                            <DialogDescription>Preencha os dados do novo pedido</DialogDescription>
                        </DialogHeader>
                        <OrderForm
                            statuses={statuses}
                            onSubmit={async (formData) => {
                                await handleAddOrder(formData);
                                setIsDialogOpen(false);
                            }}
                            isSubmitting={loading}/>
                    </DialogContent>
                </Dialog>
            </div>
            <div className={"border rounded-lg"}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={"sm:hidden"}>Cli.</TableHead>
                            <TableHead className={"hidden sm:table-cell"}>Cliente</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead className={"sm:hidden"}>Sts.</TableHead>
                            <TableHead className={"hidden sm:table-cell"}>Status</TableHead>
                            <TableHead className={"hidden sm:table-cell"}>Valor</TableHead>
                            <TableHead className={"hidden sm:table-cell"}>Tipo de pagamento</TableHead>
                            <TableHead className={"sm:hidden"}>Prods.</TableHead>
                            <TableHead className={"hidden sm:table-cell"}>Produtos</TableHead>
                            <TableHead className={"w-0 sm:w-[100px]"}>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className={"text-center py-8"}>
                                    <div className={"flex justify-center items-center gap-2"}>
                                        <Loader2 className={"h-4 w-4 animate-spin"}/>
                                        Carregando pedidos...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className={"text-center py-8 text-gray-500"}>
                                    Nenhum pedido encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell
                                        className={"font-medium sm:hidden"}>
                                        {order.customer.substring(0, 10)}...
                                    </TableCell>
                                    <TableCell
                                        className={"font-medium hidden sm:table-cell"}>
                                        {order.customer}
                                    </TableCell>
                                    <TableCell className={"hidden sm:table-cell"}>
                                        {new Date(order.orderDate + 'T00:00:00').toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className={"sm:hidden"}>
                                        {new Date(order.orderDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit'
                                        })}
                                    </TableCell>
                                    <TableCell className={"hidden sm:table-cell"}>
                                        <Badge variant={"secondary"} className={"px-3 py-0.5"}>
                                            {order.orderStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className={"sm:hidden"}>
                                        <Badge variant="secondary" className={"px-3 py-0.5"}>
                                            {order.orderStatus.substring(0, 3)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className={"hidden sm:table-cell"}>
                                        {order.totalValue.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </TableCell>
                                    <TableCell
                                        className={"hidden sm:table-cell"}>
                                        {order.paymentType.name}
                                    </TableCell>
                                    <TableCell>
                                        <div className={"sm:hidden"}>
                                            <HoverCard>
                                                <HoverCardTrigger asChild>
                                                    <Button
                                                        variant={"link"}
                                                        className={"p-0 h-auto"}>
                                                        <Badge
                                                            variant={"outline"}
                                                            className={"px-2 py-0.5 cursor-pointer"}>
                                                            {order.orderedProducts.length} prods.
                                                        </Badge>
                                                    </Button>
                                                </HoverCardTrigger>
                                                <HoverCardContent className={"w-64"}>
                                                    <div className={"space-y-2"}>
                                                        <h4 className={"text-sm font-semibold"}>Produtos</h4>
                                                        <div className={"text-sm"}>
                                                            <p>
                                                                <span className={"font-medium"}>Valor: </span>
                                                                {order.totalValue.toLocaleString('pt-BR', {
                                                                    style: 'currency',
                                                                    currency: 'BRL'
                                                                })}
                                                            </p>
                                                            <p>
                                                                <span className={"font-medium"}>Pagamento: </span>
                                                                {order.paymentType.name}
                                                            </p>
                                                        </div>
                                                        <div className={"flex flex-col gap-1"}>
                                                            {order.orderedProducts.map((orderedProduct, index) => (
                                                                <div
                                                                    key={`${order.id}-${orderedProduct.productId}-${index}`}
                                                                    className={"flex items-center gap-2"}>
                                                                    <span className={"text-sm"}>
                                                                        {orderedProduct.productName}
                                                                    </span>
                                                                    <Badge variant={"outline"}
                                                                           className={"px-2 py-0.5 text-sm"}>
                                                                        {orderedProduct.quantity}x
                                                                    </Badge>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </HoverCardContent>
                                            </HoverCard>
                                        </div>
                                        <div className={"hidden sm:flex flex-col gap-1"}>
                                            {order.orderedProducts.map((orderedProduct, index) => (
                                                <div key={`${order.id}-${orderedProduct.productId}-${index}`}
                                                     className={"flex items-center gap-2"}>
                                                    <span>{orderedProduct.productName}</span>
                                                    <Badge variant={"outline"}
                                                           className={"px-2 py-0.5"}>
                                                        {orderedProduct.quantity}x
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant={"ghost"}
                                                    className={"lg:px-1"}
                                                    onClick={() => setSelectedOrder(order)}>
                                                    <Edit className={"h-4 w-4"}/>
                                                    <span className={"hidden sm:inline"}>Editar</span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Editar Pedido</DialogTitle>
                                                    <DialogDescription>Altere os dados do pedido</DialogDescription>
                                                </DialogHeader>
                                                <OrderForm
                                                    initialData={selectedOrder}
                                                    statuses={statuses}
                                                    onSubmit={async (formData) => {
                                                        await handleEditOrder(formData);
                                                        setIsDialogOpen(false);
                                                    }}
                                                    isSubmitting={loading}/>
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
                itemsLabel={"pedidos"}/>
        </div>
    )
}