import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Edit3, Loader2} from "lucide-react";
import {Input} from "@/components/ui/input";

export function QuantityEditor({currentQuantity, measurementUnit, onUpdate, isLoading}) {
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false)

    const validateAndUpdate = async () => {
        setError('');

        if (!quantity) {
            setError("A quantidade é obrigatória");
            return;
        }

        const numericQuantity = parseFloat(quantity);
        if (isNaN(numericQuantity)) {
            setError("Digite um número válido");
            return;
        }

        if (numericQuantity < 0) {
            setError("A quantidade não pode ser negativa");
            return;
        }

        if (numericQuantity > 999999) {
            setError("Quantidade muito alta");
            return;
        }

        try {
            await onUpdate(numericQuantity);
            setQuantity('');
            setIsOpen(false);
        } catch (error) {
            setError('Erro ao atualizar quantidade');;
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={"h-8 w-8"}>
                    <Edit3 className={"h-4 w-4"}/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className={"w-80"}>
                <div className={"space-y-4"}>
                    <div>
                        <h4 className={"font-medium mb-2"}>Insira a nova quantidade</h4>
                        <p className={"text-sm text-gray-500 mb-4"}>Quantidade
                            Atual: {currentQuantity} {measurementUnit}</p>
                    </div>
                    <div className={"space-y-2"}>
                        <Input
                            type={"number"}
                            step={"0.01"}
                            placeholder={"Nova quantidade"}
                            value={quantity}
                            onChange={(e) => {
                                setQuantity(e.target.value)
                                setError('');
                            }}
                            className={error ? "border-red-500" : ""}/>
                        {error && (
                            <p className={"text-sm text-red-500"}>{error}</p>
                        )}
                    </div>
                    <div className={"flex justify-end gap-2"}>
                        <Button
                        variant={"outline"}
                        onClick={() => {
                            setIsOpen(false);
                            setQuantity("");
                            setError("");
                        }}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={validateAndUpdate}
                            disabled={isLoading}
                            className={"cursor-pointer bg-red-900 hover:bg-red-900/90"}>
                            {isLoading ? (
                                <>
                                    <Loader2 className={"h-4 w-4 animate-spin mr-2"}/>
                                    Atualizando...
                                </>
                            ) : ('Salvar')}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}