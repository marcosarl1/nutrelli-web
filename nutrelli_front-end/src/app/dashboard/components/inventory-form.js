import {useCallback, useEffect, useState} from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {inventoryService} from "@/services/inventoryService";
import {cn} from "@/lib/utils";
import {DialogClose, DialogFooter} from "@/components/ui/dialog";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";


export function InventoryForm({onSubmit, isSubmitting, initialData}) {
    const [formData, setFormData] = useState({
        name: "",
        quantity: "",
        measurementUnit: "",
        minimumQuantity: "",
        ...(initialData ? {
            name: initialData.name,
            quantity: initialData.quantity,
            measurementUnit: initialData.measurementUnit,
            minimumQuantity: initialData.minimumQuantity,
        } : {})
    });
    const [errors, setErrors] = useState({});
    const [measurementUnits, setMeasurementUnits] = useState([]);

    const fetchMeasurementUnits = useCallback(async () => {
        try {
            const res = await inventoryService.findAllMeasurementUnits();
            setMeasurementUnits(res);
        } catch (error) {
            setErrors(error.message);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await fetchMeasurementUnits();
        };
        fetchData()
    }, [fetchMeasurementUnits]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Por favor, insira o nome do item";
        }

        if (!formData.quantity) {
            newErrors.quantity = "Por favor, insira a quantidade";
        } else if (isNaN(formData.quantity) || Number(formData.quantity) < 0) {
            newErrors.quantity = 'A quantidade deve ser um número positivo';
        }

        if (!formData.measurementUnit) {
            newErrors.measurementUnit = "Por favor, selecione uma unidade de medida";
        }

        if (!formData.minimumQuantity) {
            newErrors.minimumQuantity = "Por favor, insira a quantidade mínima";
        } else if (isNaN(formData.minimumQuantity) || Number(formData) < 0) {
            newErrors.minimumQuantity = "A quantidade mínima deve ser um número positivo";
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
                quantity: parseFloat(formData.quantity),
                minimumQuantity: parseFloat(formData.minimumQuantity),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className={"space-y-6"}>
            <div className={"space-y-2"}>
                <Label htmlFor={"name"}>Nome do Item</Label>
                <Input
                    id={"name"}
                    placeholder={"Digite o nome do item"}
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={errors.name ? "border-red-500" : ""}/>
                {errors.name && (
                    <p className={"text-sm text-red-500"}>{errors.name}</p>
                )}
            </div>
            <div className={"space-y-2"}>
                <Label htmlFor={"quantity"}>Quantidade</Label>
                <div className={"flex gap-2"}>
                    <Input
                        id={"quantity"}
                        type={"number"}
                        placeholder={"0.00"}
                        value={formData.quantity}
                        className={"w-full"}
                        onChange={(e) => handleChange("quantity", e.target.value)}/>
                    <Select
                        value={formData.measurementUnit}
                        onValueChange={(value) => handleChange('measurementUnit', value)}>
                        <SelectTrigger className={cn("w-32", errors.measurementUnit ? "border-red-500" : "")}>
                            <SelectValue placeholder={"Medida"}/>
                        </SelectTrigger>
                        <SelectContent>
                            {measurementUnits.map((unit) => (
                                <SelectItem key={unit.name} value={unit.name}>
                                    {unit.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {errors.quantity && (
                    <p className={"text-sm text-red-500"}>{errors.quantity}</p>
                )}
                {errors.measurementUnit && (
                    <p className={"text-sm text-red-500"}>{errors.measurementUnit}</p>
                )}
            </div>
            <div className={"space-y-2"}>
                <Label htmlFor={"minimumQuantity"}>Quantidade Mínima</Label>
                <div className={"flex items-center gap-2"}>
                    <Input
                        id={"minimumQuantity"}
                        type={"number"}
                        placeholder={"0.00"}
                        value={formData.minimumQuantity}
                        onChange={(e) => handleChange("minimumQuantity", e.target.value)}
                        className={errors.minimumQuantity ? "border-red-500" : ""}/>
                    <div className={cn("w-32 px-3 py-2  rounded-md text-sm text-gray-500", formData.measurementUnit ? "border" : "")}>
                        {formData.measurementUnit ? measurementUnits.find(u => u.name === formData.measurementUnit)?.name : ""}
                    </div>
                </div>
                {errors.minimumQuantity && (
                    <p className={"text-sm text-red-500"}>{errors.minimumQuantity}</p>
                )}

            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type={"button"} variant={"outline"}>Cancelar</Button>
                </DialogClose>
                <Button
                    type={"submit"}
                    className={"bg-red-900 hover:bg-red-900/90"}
                    disabled={isSubmitting}>
                    {isSubmitting ? (
                        <><Loader2 className={"mr-2 h-4 w-4 animate-spin"}/>Salvando...</>
                    ) : ('Salvar')}
                </Button>
            </DialogFooter>
        </form>
    );
}