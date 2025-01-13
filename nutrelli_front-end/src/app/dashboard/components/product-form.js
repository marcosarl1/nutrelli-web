import {useState} from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogFooter} from "@/components/ui/dialog";
import {CheckCircle2, Loader2, XCircle} from "lucide-react";
import {Switch} from "@/components/ui/switch";

export function ProductForm({ onSubmit, isSubmitting, initialData = null, categories = [ ]}) {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        categoryId: "",
        available: true,
        ...(initialData ? {
            id: initialData.id,
            name: initialData.name,
            price: initialData.price,
            categoryId: initialData.productCategory?.id?.toString(),
            available: initialData.available
        } : {})
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Por favor, insira o nome do produto";
        }

        if (!formData.price || formData.price < 0) {
            newErrors.price = "Por favor, insira um preço válido";
        }

        if (!formData.categoryId || formData.categoryId.trim() === "") {
            newErrors.categoryId = "Por favor, selecione uma categoria de produto";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                ...formData,
                productCategory: {
                    id: parseInt(formData.categoryId)
                },
                price: parseFloat(formData.price)
            });
            console.log(formData)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Nome do produto</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Digite o nome do produto"
                    className={errors.name ? "border-red-500" : ""}/>
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="price">Preço</Label>
                <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="0,00"
                    className={errors.price ? "border-red-500" : ""}/>
                {errors.price && (
                    <p className="text-sm text-red-500">{errors.price}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                    value={formData.categoryId}
                    onValueChange={(value) => handleChange("categoryId", value)}>
                    <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione uma categoria"/>
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.categoryId && (
                    <p className="text-sm text-red-500">{errors.categoryId}</p>
                )}
            </div>
            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="available">Disponibilidade</Label>
                        <p className="text-sm text-gray-500">{formData.available ? "Produto disponível para venda" : "Produto indisponível para venda"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {formData.available ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500"/>
                        ) : (
                            <XCircle className="h-4 w-4 text-red-500"/>
                        )}
                        <Switch
                            id="available"
                            checked={formData.available}
                            onCheckedChange={(checked) => handleChange("available", checked)}/>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                        Cancelar
                    </Button>
                </DialogClose>
                <Button type="submit" className="bg-red-900 hover:bg-red-900/90"
                        disabled={isSubmitting}>
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