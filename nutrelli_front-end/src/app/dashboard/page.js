"use client";

import {useCallback, useEffect, useState} from "react";
import productsService from "@/services/productsService";
import {ordersService} from "@/services/ordersService";
import {inventoryService} from "@/services/inventoryService";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {AlertTriangle, Package, ShoppingCart} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";

const CHART_COLORS = [
    "#FF6B6B", "#4ECDC4", "#FFE66D", "#6B5B95", "#FFA07A"
];

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        lowStockItems: [],
        revenue: 0,
        topProducts: [],
        recentOrders: []
    })

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const [products, orders, inventory] = await Promise.all([
                productsService.findAllProducts(0, 1000),
                ordersService.findAllOrders(0, 1000),
                inventoryService.findAllItems(0, 1000)
            ]);
            const totalRevenue = orders.content
                .filter(order => order.orderStatus === "Finalizado")
                .reduce((sum, order) => sum + order.totalValue, 0);

            const productSales = {};
            orders.content.forEach(order => {
                order.orderedProducts.forEach(product => {
                    productSales[product.productName] = (productSales[product.productName] || 0) + product.quantity;
                });
            });

            const topProducts = Object.entries(productSales)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([name, quantity], index) => ({
                        name,
                        quantity,
                        color: CHART_COLORS[index]
                    })
                );

            setStats({
                totalProducts: products.totalElements,
                totalOrders: orders.totalElements,
                lowStockItems: inventory.content.filter(item => item.quantity < item.minimumQuantity),
                revenue: totalRevenue,
                topProducts,
                recentOrders: orders.content.slice(0, 5)
            });
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();

    }, [fetchDashboardData]);


    return (
        <div className={"h-full flex flex-col"}>
            <div className={"flex-1 space-y-6"}>
                <h1 className={"text-4xl font-bold"}>Bem-vindo ao sistema interno da <span
                    className={"text-red-700"}>Nutrelli</span>!</h1>
                <div className={"grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4"}>
                    <Card>
                        <CardHeader className={"flex flex-row items-center justify-between space-y-0 pb-2"}>
                            <CardTitle className={"font-medium"}>Produtos cadastrados</CardTitle>
                            <Package className={"h-4 w-4 text-gray-500"}/>
                        </CardHeader>
                        <CardContent>
                            <div className={"text-2xl font-bold"}>{stats.totalProducts}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className={"flex flex-row items-center justify-between space-y-0 pb-2"}>
                            <CardTitle className={"font-medium"}>Total de pedidos</CardTitle>
                            <ShoppingCart className={"h-4 w-4 text-gray-500"}/>
                        </CardHeader>
                        <CardContent>
                            <div className={"text-2xl font-bold"}>{stats.totalOrders}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className={"flex flex-row items-center justify-between space-y-0 pb-2"}>
                            <CardTitle className={"font-medium"}>Itens com estoque baixo</CardTitle>
                            <AlertTriangle className={"h-4 w-4 text-red-500"}/>
                        </CardHeader>
                        <CardContent>
                            <div className={"text-2xl font-bold"}>{stats.lowStockItems.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className={"flex flex-row items-center justify-between space-y-0 pb-2"}>
                            <CardTitle className={"font-medium"}>Receita Total</CardTitle>
                            <ShoppingCart className={"h-4 w-4 text-gray-500"}/>
                        </CardHeader>
                        <CardContent>
                            <div className={"text-2xl font-bold"}>{stats.revenue.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })}</div>
                        </CardContent>
                    </Card>
                </div>
                {stats.lowStockItems.length > 0 && (
                    <Alert variant={"destructive"}>
                        <AlertTriangle className={"h-4 w-4"}/>
                        <AlertTitle>Alerta de Estoque</AlertTitle>
                        <AlertDescription>
                            {stats.lowStockItems.length} item(s) com estoque abaixo do mínimo.
                            <ul className={"mt-2 list-disc list-inside"}>
                                {stats.lowStockItems.slice(0, 3).map(item => (
                                    <li key={item.id}>
                                        {item.name}: {item.quantity} {item.measurementUnit} (Mín: {item.minimumQuantity} {item.measurementUnit})
                                    </li>
                                ))}
                                {stats.lowStockItems.length > 3 && (
                                    <li>E mais {stats.lowStockItems.length - 3} item(s)</li>
                                )}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}
                <div className={"grid gap-4 md:grid-cols-2"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Top 5 Produtos Mais Vendidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width={"100%"} height={300}>
                                <BarChart data={stats.topProducts}>
                                    <CartesianGrid strokeDasharray={"3 3"}/>
                                    <XAxis dataKey={"name"}/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Bar
                                        dataKey={"quantity"}
                                        fill={"be123c"}
                                        radius={[4, 4, 0, 0]}>
                                        {
                                            stats.topProducts.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color}/>
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Últimos Pedidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={"space-y-4"}>
                                {stats.recentOrders.map(order => (
                                    <div key={order.id} className={"flex justify-between items-center border-b pb-2"}>
                                        <div>
                                            <p className={"font-medium"}>{order.customer}</p>
                                            <p className={"text-sm text-gray-500"}>
                                                {new Date(order.orderDate + 'T00:00:00').toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className={"text-right"}>
                                            <p className={"font-medium"}>
                                                {order.totalValue.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                })}
                                            </p>
                                            <Badge variant={"outline"} className={cn("px-2 py-100 text-xs",
                                                order.orderStatus === "Pendente" && "bg-yellow-100 text-yellow-800",
                                                order.orderStatus === "Em preparo" && "bg-blue-100 text-blue-800",
                                                order.orderStatus === "Pronto para retirada" && "bg-purple-100 text-purple-800",
                                                order.orderStatus === "Finalizado" && "bg-green-100 text-green-800",
                                                order.orderStatus === "Cancelado" && "bg-red-100 text-red-800")}>
                                                {order.orderStatus}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <footer className={"mt-8 border-t border-gray-200"}>
                <div className={"px-4 pt-2"}>
                    <div className={"items-center justify-center text-sm text-gray-600"}>
                        <div className={"text-center"}>
                            <p>&copy; {new Date().getFullYear()} Nutrelli. Todos os direitos reservados.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}