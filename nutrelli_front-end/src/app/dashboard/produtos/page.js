"use client";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Edit,
    Ellipsis,
    Filter,
    Loader2,
    MoreVertical,
    Plus,
    Search,
    Trash2
} from "lucide-react";
import {useEffect, useState} from "react";
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
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";


export default function Products() {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalElements: 0
    });
    useEffect(() => {
        fetchProducts();
        fetchProductCategories();
    }, [pagination.currentPage, pagination.pageSize, searchQuery, selectedCategory]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productsService.findAllProducts(
                pagination.currentPage - 1,
                pagination.pageSize,
                searchQuery,
                selectedCategory
            );
            setProducts(data.content);
            setPagination(prevState => ({
                ...prevState,
                totalPages: data.totalPages,
                totalElements: data.totalElements,
            }));
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false);
        }
    }

    const fetchProductCategories = async () => {
        try {
            setLoading(true)
            const data = await productsService.findAllProductCategories();
            setCategories(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setSelectedCategory(null);
        setPagination(prevState => ({...prevState, currentPage: 1}));
    }

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
        setPagination(prevState => ({...prevState, currentPage: 1}));
    }

    const handlePageChange = (newPage) => {
        setPagination(prevState => ({
            ...prevState, currentPage: newPage
        }))
    };

    return (
        <div className="space-y-6 mt-16 lg:mt-0">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Produtos</h1>
                </div>
                <Button className="gap-2 bg-blue-400 hover:bg-blue-400/80"><Plus className="h-4 w-4"/>Novo
                    Produto</Button>
            </div>
            <div className="flex gap-3 items-center justify-between">
                <div className="relative flex-1 max-w-sm">
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
                            Filtros
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>Disponível</DropdownMenuItem>
                        <DropdownMenuItem>Indisponível</DropdownMenuItem>
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

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"><input type="checkbox" className="h-4 w-4"/></TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Disponibilidade</TableHead>
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
                                    <TableCell><input type="checkbox" className="h-4 w-4"/></TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.price.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{product.productCategory.name}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="success"
                                            className={product.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                                            {product.available ? "Disponível" : "Indisponível"}</Badge>
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
                                                    <DialogTrigger asChild>
                                                        <DropdownMenuItem
                                                            className="gap-2">
                                                            <Edit className="h-4 w-4"/>
                                                            Editar
                                                        </DropdownMenuItem>
                                                    </DialogTrigger>
                                                    <DropdownMenuItem className="gap-2 text-red-600">
                                                        <Trash2 className="h-4 w-4"/>Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Teste</DialogTitle>
                                                    <DialogDescription>Teste</DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>

                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Mostrando {products.length} de {pagination.totalElements} produtos
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={pagination.currentPage === 1}
                        onClick={() => handlePageChange(pagination.currentPage - 1)}>
                        <ChevronLeft className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.currentPage + 1)}>
                        <ChevronRight className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
        </div>
    );
}