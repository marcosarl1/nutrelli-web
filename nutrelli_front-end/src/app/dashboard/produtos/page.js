"use client";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Edit,
    Ellipsis,
    Filter,
    Loader2,
    Plus,
    Search,
    Trash2, XCircle
} from "lucide-react";
import {useCallback, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import productsService from "@/services/productsService";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {ProductForm} from "@/app/dashboard/components/product-form";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {useToast} from "@/hooks/use-toast";

export default function Products() {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedAvailability, setSelectedAvailability] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalElements: 0
    });
    const { toast } = useToast();

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const startTime = Date.now();
            const data = await productsService.findAllProducts(
                pagination.currentPage - 1,
                pagination.pageSize,
                searchQuery,
                selectedCategory,
                selectedAvailability
            );
            const elapsed = Date.now() - startTime;
            if (elapsed < 500) {
                await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
            }
            setProducts(data.content);
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
    }, [pagination.currentPage, pagination.pageSize, searchQuery, selectedCategory, selectedAvailability]);

    const fetchProductCategories = useCallback(async () => {
        try {
            setLoading(true)
            const data = await productsService.findAllProductCategories();
            setCategories(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await fetchProducts();
            await fetchProductCategories();
        };
        fetchData();
    }, [fetchProducts, fetchProductCategories]);

    const handleAddProduct = async (formData) => {
        try {
            setLoading(true);
            await productsService.addProduct(formData);
            await fetchProducts();
            setPagination(prevState => ({...prevState, currentPage: 1}));
            toast({
                description: <span>&#x2705; Produto adicionado com sucesso!</span>,
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleEditProduct = async (formData) => {
        try {
            setLoading(true);
            await productsService.editProduct(formData.id, formData);
            await fetchProducts();
            setPagination(prevState => ({...prevState, currentPage: 1}));
            toast({
                description: <span>&#x2705; Produto editado com sucesso!</span>,
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteProduct = async () => {
        try {
            setLoading(true);
            await productsService.deleteProduct(selectedProduct.id);
            await fetchProducts();
            setSelectedProduct(null);
            setPagination(prevState => ({...prevState, currentPage: 1}));
            toast({
                description: <span>&#x2705; Produto deletado com sucesso!</span>,
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
        setSelectedAvailability(null);
        setPagination(prevState => ({...prevState, currentPage: 1}));
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setSelectedCategory(null);
        setSelectedAvailability(null);
        setPagination(prevState => ({...prevState, currentPage: 1}));
    }

    const handleCategorySelect = (categoryId) => {
        setSearchQuery('');
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
        setSelectedAvailability(null);
        setPagination(prevState => ({...prevState, currentPage: 1}));
    }

    const handlePageChange = (newPage) => {
        setPagination(prevState => ({
            ...prevState, currentPage: newPage
        }))
    };

    return (
        <div className="space-y-6 ">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Produtos</h1>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-1 sm:gap-3 items-center">
                    <div className="relative w-52 lg:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"/>
                        <Input
                            placeholder="Buscar produtos..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="pl-9"/>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Filter className="h-4 w-4"/>
                                <span className="hidden sm:inline">Filtros</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                className={cn("cursor-pointer",
                                    selectedAvailability === null && selectedCategory === null ? "bg-blue-50" : "")}
                                onClick={() => resetFilters()}>Todos</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                className={cn("cursor-pointer",
                                    selectedAvailability === true ? "bg-blue-50" : "")}
                                onClick={() => {
                                    setSelectedAvailability(true);
                                    setSelectedCategory(null);
                                    setPagination(prevState => ({...prevState, currentPage: 1}));
                                }}>Disponível</DropdownMenuItem>
                            <DropdownMenuItem
                                className={cn("cursor-pointer",
                                    selectedAvailability === false ? "bg-blue-50" : "")}
                                onClick={() => {
                                    setSelectedAvailability(false);
                                    setSelectedCategory(null);
                                    setPagination(prevState => ({...prevState, currentPage: 1}));
                                }}>Indisponível</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            {loading ? (
                                <DropdownMenuItem disabled>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                    Carregando...
                                </DropdownMenuItem>
                            ) : error ? (
                                <DropdownMenuItem disabled className="text-red-500">
                                    {error}
                                </DropdownMenuItem>
                            ) : (
                                categories.map((category) => (
                                    <DropdownMenuItem
                                        key={category.id}
                                        className={cn("gap-2", selectedCategory === category.id ? "bg-blue-50" : "")}
                                        onClick={() => handleCategorySelect(category.id)}>
                                        {category.name}
                                        {selectedCategory === category.id}
                                    </DropdownMenuItem>
                                ))
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="gap-2 bg-red-900 hover:bg-red-900/90">
                            <Plus className="h-4 w-4"/>
                            <span className="hidden sm:inline">Novo Produto</span></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adicionar Produto</DialogTitle>
                            <DialogDescription>Preencha os dados do novo produto</DialogDescription>
                        </DialogHeader>
                        <ProductForm
                            categories={categories}
                            onSubmit={async (formData) => {
                                await handleAddProduct(formData);
                                setIsDialogOpen(false);
                            }}
                            isSubmitting={loading}/>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>
                                <span className="sm:hidden">Disp.</span>
                                <span className="hidden sm:inline">Disponibilidade</span>
                            </TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                        Carregando produtos...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    Nenhum produto encontrado
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.price.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary"
                                               className="px-3 py-0.5">{product.productCategory.name}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="sm:hidden">
                                                {product.available ? (
                                                    <CheckCircle className="h-4 w-4 text-green-500"/>
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-red-500"/>
                                                )}
                                            </span>
                                            <span className="hidden sm:inline">
                                                <Badge
                                                    variant="success"
                                                    className={cn("px-3 py-0.5",
                                                        product.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                                            {product.available ? "Disponível" : "Indisponível"}</Badge>
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Ellipsis className="h-4 w-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DialogTrigger asChild onClick={() => setSelectedProduct(product)}>
                                                        <DropdownMenuItem
                                                            className="gap-2">
                                                            <Edit className="h-4 w-4"/>
                                                            Editar
                                                        </DropdownMenuItem>
                                                    </DialogTrigger>
                                                    <DropdownMenuItem
                                                        className="gap-2 text-red-600"
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setIsDeleteDialogOpen(true);
                                                        }}>
                                                        <Trash2 className="h-4 w-4"/>Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Editar produto</DialogTitle>
                                                    <DialogDescription>Altere os dados do produto</DialogDescription>
                                                </DialogHeader>
                                                <ProductForm
                                                    initialData={selectedProduct}
                                                    categories={categories}
                                                    onSubmit={handleEditProduct}
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                    Mostrando {products.length} de {pagination.totalElements} produtos
                </p>
                <div className="flex justify-center gap-1 sm:gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={pagination.currentPage === 1}
                        onClick={() => handlePageChange(pagination.currentPage - 1)}>
                        <ChevronLeft className="h-4 w-4"/>
                    </Button>
                    {(() => {
                        const totalPages = pagination.totalPages;
                        const currentPage = pagination.currentPage;
                        const pagesToShow = 3;
                        let startPage = Math.max(1, Math.min(currentPage - Math.floor(pagesToShow / 2), totalPages - pagesToShow + 1));
                        let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

                        if (endPage - startPage + 1 < pagesToShow) {
                            startPage = Math.max(1, endPage - pagesToShow + 1);
                        }

                        const pages = [];
                        for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                                <Button variant={currentPage === i ? "outline" : "ghost"}
                                        key={i}
                                        onClick={() => handlePageChange(i)}>{i}</Button>
                            );
                        }

                        if (startPage > 1) {
                            pages.unshift(
                                <span key={"start-ellipsis"} className="flex items-center px-2">...</span>
                            );
                        }
                        if (endPage < totalPages) {
                            pages.push(
                                <span key={"end-ellipsis"} className="flex items-center px-2">...</span>
                            );
                        }

                        return pages;
                    })()}
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.currentPage + 1)}>
                        <ChevronRight className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o produto &#34;{selectedProduct?.name}&#34;?
                            Esta ação não poderá ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteProduct}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                    Excluíndo
                                </>
                            ): (
                                'Excluir'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}