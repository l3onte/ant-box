import Button from "../forms-components/Button"
import Input from "../forms-components/Input"
import { useState, useEffect } from "react"
import API from "../../services/API.js"
import { useStore } from "../../services/storeContext.jsx"
import { PackagePlus } from 'lucide-react';
import Swal from "sweetalert2";

export default function FormCompras({ onClose, onSuccess, purchaseData, isEditing = false }) {
    const { store } = useStore();
    const [proveedores, setProveedores] = useState([]);
    const [products, setProducts] = useState([]);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        id_proveedor: '',
        id_producto: '',
        cantidad: '',
        precio_compra: ''
    });

    const [newProduct, setNewProduct] = useState({
        nombre: '',
        descripcion: '',
        precio_compra: '',
        porcentaje_ganancia: '',
        stock_minimo: ''
    });

    // Cargar datos al editar
    useEffect(() => {
        if (purchaseData) {
            setData({
                id_proveedor: purchaseData.id_proveedor || '',
                id_producto: purchaseData.id_producto || '',
                cantidad: purchaseData.cantidad || '',
                precio_compra: purchaseData.precio_compra || ''
            });
        }
    }, [purchaseData]);

    // Cargar proveedores
    useEffect(() => {
        API.get(`/ant-box/suppliers/getSuppliers/${store.id_tienda}?page=${1}&limit=${9999}`)
            .then(res => setProveedores(res?.data?.result || []))
            .catch(err => console.error(err.message));
    }, [store.id_tienda]);

    // Cargar productos
    useEffect(() => {
        API.get(`/ant-box/products/getProducts/${store.id_tienda}`)
            .then(res => setProducts(res?.data?.rows || []))
            .catch(err => console.error(err.message));
    }, [store.id_tienda]);

    const handleChange = (e) => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleNewProductChange = (e) => {
        setNewProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let win; // Abrimos la ventana aquí para que no la bloquee el navegador
        try {
            const payload = {
                ...data,
                nuevo_producto: isAddFormOpen ? newProduct : null
            };

            let result;

            if (isEditing) {
                result = await API.put(`/ant-box/purchases/updatePurchase/${purchaseData.id_compra}`, payload);
                Swal.fire({
                    icon: "success",
                    title: "Compra actualizada",
                    text: "La compra se actualizó correctamente.",
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                result = await API.post(`/ant-box/purchases/postPurchase/${store.id_tienda}`, payload);
                Swal.fire({
                    icon: "success",
                    title: "Compra registrada",
                    text: "La compra se agregó correctamente.",
                    timer: 1500,
                    showConfirmButton: false
                });
            }

            onSuccess?.();
            onClose?.();

            const id_compra = result.data?.id_compra || purchaseData?.id_compra;
            if (id_compra) {
                try {
                    const receipt = await API.get(`/ant-box/purchases/receipt/${id_compra}`);
                    const win = window.open("", "_blank");
                    openReceiptWindow(receipt.data, win);
                } catch (err) {
                    console.error("Error al generar recibo:", err);
                    Swal.fire({
                        icon: "warning",
                        title: "Compra guardada pero no se pudo generar el recibo",
                        text: err.response?.data?.message || err.message
                    });
                }
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al guardar",
                text: error.response?.data?.message || "Error del servidor"
            });
        } finally {
            setLoading(false);
        }
    };

    const openReceiptWindow = (data, win) => {
        const { compra, detalles } = data;

        const html = `
        <html>
            <head>
            <title>Recibo de Compra #${compra.id_compra}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h2 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background-color: #f3f3f3; }
                .total { text-align: right; font-weight: bold; margin-top: 20px; }
            </style>
            </head>
            <body>
            <h2>Recibo de Compra</h2>
            <p><strong>ID Compra:</strong> ${compra.id_compra}</p>
            <p><strong>Proveedor:</strong> ${compra.proveedor}</p>
            <p><strong>Fecha:</strong> ${compra.fecha_compra}</p>

            <table>
                <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Compra</th>
                    <th>Subtotal</th>
                </tr>
                </thead>
                <tbody>
                ${detalles.map(d => `
                    <tr>
                    <td>${d.producto}</td>
                    <td>${d.cantidad}</td>
                    <td>${d.precio_compra}</td>
                    <td>${(d.precio_compra * d.cantidad)}</td>
                    </tr>
                `).join("")}
                </tbody>
            </table>

            <p class="total">Total: ${compra.total}</p>
            <script>window.print();</script>
            </body>
        </html>
        `;

        win.document.write(html);
        win.document.close();
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 text-black max-h-[500px] overflow-y-auto pr-2"
        >
            {/* Select de Proveedor */}
            <label className="text-sm font-semibold">Proveedor</label>
            <select
                name="id_proveedor"
                value={data.id_proveedor}
                onChange={handleChange}
                className="bg-gray-100/70 w-full shadow-sm placeholder-gray-500 px-4 py-2 rounded transition"
                required
            >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((prov) => (
                    <option key={prov.id_proveedor} value={prov.id_proveedor}>
                        {prov.nombre}
                    </option>
                ))}
            </select>
            
            {/* Select de Producto */}
            <label className="text-sm font-semibold">Producto</label>
            <div className="flex items-center gap-2 relative">
                <select 
                    name="id_producto"
                    value={data.id_producto}
                    onChange={handleChange}
                    disabled={isAddFormOpen}
                    className="bg-gray-100/70 w-full shadow-sm placeholder-gray-500 px-4 py-2 rounded transition"
                    required
                >
                    <option value="">Seleccione un producto</option>
                    {products.map((p) => (
                        <option key={p.id_producto} value={p.id_producto}>
                            {p.nombre}
                        </option>
                    ))}
                </select>

                {/* Botón para agregar nuevo producto */}
                {!isEditing && (
                    <PackagePlus 
                        onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                        className="absolute right-5 size-4 hover:text-gray-500 cursor-pointer" 
                    />
                )}    
            </div>

            {isAddFormOpen && (
                <div className="border-t border-gray-300 pt-2 mt-2">
                    <h3 className="font-semibold mb-1 text-gray-700">Nuevo Producto</h3>
                    <label>Nombre</label>
                    <Input name="nombre" value={newProduct.nombre} onChange={handleNewProductChange} placeholder="Ej. Jabón líquido" />
                    
                    <label>Descripción</label>
                    <Input name="descripcion" value={newProduct.descripcion} onChange={handleNewProductChange} placeholder="Ej. 500ml" />
                    
                    <label>Precio de Compra</label>
                    <Input type="number" name="precio_compra" value={newProduct.precio_compra} onChange={handleNewProductChange} placeholder="100" />
                    
                    <label>Porcentaje de Ganancia</label>
                    <Input name="porcentaje_ganancia" value={newProduct.porcentaje_ganancia} onChange={handleNewProductChange} placeholder="15" />
                    
                    <label>Stock Mínimo</label>
                    <Input type="number" name="stock_minimo" value={newProduct.stock_minimo} onChange={handleNewProductChange} placeholder="3" />
                </div>
            )}


            <label>Cantidad</label>
            <Input 
                type="number"
                placeholder="2"
                name="cantidad"
                value={data.cantidad}
                onChange={handleChange}
                required
            />
            <label>Precio de compra</label>
            <Input
                type="number"
                placeholder="100.00"
                name="precio_compra"
                value={data.precio_compra}
                onChange={handleChange}
                required
            />

            <Button 
                name={loading ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"} 
                type="submit"
                disabled={loading}
                variant="addForm"
            />
        </form>
    )
}
