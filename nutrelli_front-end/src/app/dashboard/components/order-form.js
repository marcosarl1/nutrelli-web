import {DialogClose, DialogFooter} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {AlertCircle, CalendarIcon, Loader2, Plus, Trash2} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useCallback, useEffect, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {ptBR} from "date-fns/locale";
import productsService from "@/services/productsService";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ordersService} from "@/services/ordersService";
import {Alert, AlertDescription} from "@/components/ui/alert";

export function OrderForm({onSubmit, isSubmitting, initialData = null, statuses = []}) {
    const isOrderLocked = initialData &&
        (initialData.orderStatus === "Finalizado" || initialData.orderStatus === "Cancelado");
    const defaultStatus = statuses.find(status => status.name === "PENDENTE") || statuses[0];
    const [formData, setFormData] = useState({
        id: "",
        customer: "",
        orderDate: "",
        orderStatus: defaultStatus?.name,
        paymentTypeId: "",
        orderedProducts: [{productId: "", productName: "", quantity: ""}],
        ...(initialData ? {
            id: initialData.id,
            customer: initialData.customer,
            orderDate: new Date(initialData.orderDate + 'T00:00:00'),
            orderStatus: statuses.find(status => status.description === initialData.orderStatus).name || initialData.orderStatus,
            paymentTypeId: initialData.paymentType?.id?.toString(),
            orderedProducts: initialData.orderedProducts.map(product => ({
                productId: product.productId,
                productName: product.productName,
                quantity: product.quantity
            })),
        } : {})
    });
    const [products, setProducts] = useState([]);
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [openCombobox, setOpenCombobox] = useState(Array(formData.orderedProducts.length).fill(false));
    const [errors, setErrors] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination] = useState({
        currentPage: 1,
        pageSize: 5,
        totalPages: 1,
        totalElements: 0
    });

    const fetchProducts = useCallback(async () => {
        try {
            const data = await productsService.findAllProducts(
                pagination.currentPage - 1,
                pagination.pageSize,
                searchQuery);
            setProducts(data.content);
        } catch (error) {
            setErrors(error.message);
        }
    }, [pagination.currentPage, pagination.pageSize, searchQuery]);

    const fetchPaymentTypes = useCallback(async () => {
        try {
            const data = await ordersService.findAllPaymentTypes();
            setPaymentTypes(data);
        } catch (error) {
            setErrors(error.message);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await fetchProducts();
            await fetchPaymentTypes();
        };
        fetchData();
    }, [fetchProducts, fetchPaymentTypes]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customer.trim()) {
            newErrors.customer = "Por favor, insira o nome do cliente"
        }

        if (!formData.orderDate) {
            newErrors.orderDate = "Por favor, selecione a data de entrega"
        }

        formData.orderedProducts.forEach((product, index) => {
            if (!product.productName) {
                newErrors[`orderedProducts[${index}].productName`] = "Por favor, selecione o produto"
            }

            if (!product.quantity) {
                newErrors[`orderedProducts[${index}].quantity`] = "Por favor, insira a quantidade de produtos"
            } else if (isNaN(product.quantity) || Number(product.quantity) <= 0) {
                newErrors[`orderedProducts[${index}].quantity`] = "A quantidade deve ser um número maior que zero"
            }
        });

        if (!formData.paymentTypeId) {
            newErrors.paymentTypeId = "Por favor, selecione o tipo de pagamento";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleChange = (field, value) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prevState => ({
                ...prevState,
                [field]: undefined
            }));
        }
    };

    const handleProductChange = (index, productId) => {
        const selectedProduct = products.find(p => p.id === productId);
        const updatedProducts = [...formData.orderedProducts];
        updatedProducts[index] = {
            ...updatedProducts[index],
            productId: productId,
            productName: selectedProduct?.name || "",
            quantity: updatedProducts[index].quantity || ""
        };
        setFormData(prevState => ({
            ...prevState,
            orderedProducts: updatedProducts
        }));
        setOpenCombobox(prevState => {
            if (!Array.isArray(prevState)) {
                return Array(formData.orderedProducts.length).fill(false);
            }
            const newOpen = [...prevState];
            newOpen[index] = false;
            return newOpen;
        });
        if (errors[`orderedProducts[${index}].productName`]) {
            setErrors(prevState => ({
                ...prevState,
                [`orderedProducts[${index}].productName`]: undefined
            }));
        }
    }

    const handleQuantityChange = (index, value) => {
        const updatedProducts = [...formData.orderedProducts];
        updatedProducts[index] = {
            ...updatedProducts[index],
            quantity: value
        };
        setFormData(prevState => ({
            ...prevState,
            orderedProducts: updatedProducts
        }));
        if (errors[`orderedProducts[${index}].quantity`]) {
            setErrors(prevState => ({
                ...prevState,
                [`orderedProducts[${index}].quantity`]: undefined
            }));
        }
    }

    const addProductField = () => {
        setSearchQuery("");
        setFormData(prevState => ({
            ...prevState,
            orderedProducts: [...prevState.orderedProducts, {productId: "", quantity: "", productName: ""}]
        }));
        setOpenCombobox(prevState => {
            if (!Array.isArray(prevState)) {
                return Array(formData.orderedProducts.length + 1).fill(false);
            }
            return [...prevState, false];
        });
    }

    const deleteProductField = (index) => {
        if (formData.orderedProducts.length === 1) return;

        setFormData(prevState => ({
            ...prevState,
            orderedProducts: prevState.orderedProducts.filter((_, i) => i !== index)
        }));

        setOpenCombobox(prevState => {
            const newState = [...prevState];
            newState.splice(index, 1);
            return newState
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                ...formData,
                orderDate: formData.orderDate ? format(new Date(formData.orderDate), 'yyyy-MM-dd') : null,
                paymentType: {
                    id: parseInt(formData.paymentTypeId)
                },
            })
        }
    };

    const currentStatus = statuses.find(status => status.name === formData.orderStatus || status.description === formData.orderStatus);

    if (isOrderLocked) {
        return (
            <div className={"space-y-4"}>
                <Alert variant={"destructive"}>
                    <AlertCircle className={"h-4 w-4"}/>
                    <AlertDescription className={"mt-1.5"}>
                        Este pedido não pode ser editado pois está {initialData.orderStatus.toLowerCase()}.
                    </AlertDescription>
                </Alert>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type={"button"} variant={"outline"}>Fechar</Button>
                    </DialogClose>
                </DialogFooter>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={"space-y-6"}>
            <div className={"space-y-2"}>
                <Label htmlFor="customer">Nome do Cliente</Label>
                <Input
                    id={"customer"}
                    value={formData.customer}
                    onChange={(e) => handleChange("customer", e.target.value)}
                    placeholder={"Digite o nome do cliente"}
                    className={errors.customer ? "border-red-500" : ""}
                    disabled={isOrderLocked}/>
                {errors.customer && (
                    <p className={"text-sm text-red-500"}>{errors.customer}</p>
                )}
            </div>
            <div className={"space-y-2"}>
                <Label>Data de entrega</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn("w-full justify-start font-normal", errors.orderDate ? "border-red-500" : "")}
                            disabled={isOrderLocked}>
                            <CalendarIcon className={"w-4 h-4 mr-2 opacity-50"}/>
                            {formData.orderDate ? (
                                format(formData.orderDate, "PPP", {locale: ptBR})
                            ) : (
                                <span>Escolha uma data</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={"w-auto p-0"} align={"start"}>
                        <Calendar
                            mode={"single"}
                            selected={formData.orderDate}
                            onSelect={(date) => handleChange("orderDate", date)}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                    </PopoverContent>
                </Popover>
                {errors.orderDate && (
                    <p className={"text-sm text-red-500"}>{errors.orderDate}</p>
                )}
            </div>
            <div className={"space-y-2"}>
                <Label>Produtos</Label>
                {formData.orderedProducts.map((product, index) => (
                    <div key={`${product.productId}-${index}}`} className={"flex flex-col gap-2"}>
                        <div className={"flex gap-2 items-start"}>
                            <Popover
                                open={openCombobox[index]}
                                onOpenChange={(open) => {
                                    const newOpen = [...openCombobox];
                                    newOpen[index] = open;
                                    setOpenCombobox(newOpen);
                                }}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        role={"combobox"}
                                        aria-expanded={openCombobox}
                                        className={cn("w-full justify-between", errors[`orderedProducts[${index}].productName`] ? "border-red-500" : "")}
                                        disabled={isOrderLocked}>
                                        {product.productName || "Selecione um produto"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className={"w-[300px] p-0"}>
                                    <Command>
                                        <CommandInput value={searchQuery} onValueChange={setSearchQuery}
                                                      placeholder={"Buscar produtos..."}/>
                                        <CommandList>
                                            <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                                            <CommandGroup>
                                                {Array.isArray(products) && products.map((item) => (
                                                    <CommandItem
                                                        key={item.id}
                                                        value={item.name}
                                                        onSelect={() => handleProductChange(index, item.id)}>
                                                        {item.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <Input
                                type={"number"}
                                placeholder={"Qtd"}
                                className={cn("w-24", errors[`orderedProducts[${index}].quantity`] ? "border-red-500" : "")}
                                value={product.quantity}
                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                disabled={isOrderLocked}/>
                            <Button
                                type={"button"}
                                variant={"outline"}
                                size={"icon"}
                                className={"p-3"}
                                onClick={() => deleteProductField(index)}
                                disabled={formData.orderedProducts.length === 1 || isOrderLocked}>
                                <Trash2 className={"h-4 w-4 text-red-500 "}/>
                            </Button>

                        </div>
                        {errors[`orderedProducts[${index}].productName`] && (
                            <p className={"text-sm text-red-500"}>{errors[`orderedProducts[${index}].productName`]}</p>
                        )} {errors[`orderedProducts[${index}].quantity`] && (
                        <p className={"text-sm text-red-500"}>{errors[`orderedProducts[${index}].quantity`]}</p>
                    )}
                    </div>
                ))}
                <Button
                    type={"button"}
                    variant={"outline"}
                    size={"sm"}
                    className={"mt-2"}
                    onClick={addProductField}
                    disabled={isOrderLocked}>
                    <Plus className={"h-4 w-4 mr-2"}/>
                    Adicionar produto
                </Button>
            </div>
            <div className={"space-y-2"}>
                <Label>Tipo de pagamento</Label>
                <Select
                    value={formData.paymentTypeId}
                    onValueChange={(value) => handleChange("paymentTypeId", value)}
                    disabled={isOrderLocked}>
                    <SelectTrigger className={errors.paymentTypeId ? "border-red-500" : ""}>
                        <SelectValue placeholder={"Selecione o tipo de pagamento"}>
                            {paymentTypes?.find(pt => pt.id.toString() === formData.paymentTypeId)?.name}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {paymentTypes.map((paymentType) => (
                            <SelectItem
                                key={paymentType.id}
                                value={paymentType.id.toString()}>
                                {paymentType.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.paymentTypeId && (
                    <p className={"text-sm text-red-500"}>{errors.paymentTypeId}</p>
                )}
            </div>
            <div className={"space-y-2"}>
                <Label>Status do pedido</Label>
                <Select
                    value={formData.orderStatus}
                    onValueChange={(value) => handleChange("orderStatus", value)}
                    disabled={!initialData || isOrderLocked}>
                    <SelectTrigger>
                        <SelectValue>{currentStatus?.description || "Selecione um status"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {statuses.map((status) => (
                            <SelectItem key={status.name} value={status.name}>{status.description}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                        Cancelar
                    </Button>
                </DialogClose>
                <Button type="submit" className="bg-red-900 hover:bg-red-900/90" disabled={isSubmitting || isOrderLocked}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        </>
                    ) : ('Salvar')}
                </Button>
            </DialogFooter>
        </form>
    );
}