import Button from "../forms-components/Button"
import Input from "../forms-components/Input"
import { useState, useEffect } from "react"
import API from "../../services/API.js"
import { useStore } from "../../services/storeContext.jsx"
import { PackagePlus, PlusCircle, Trash2 } from 'lucide-react';
import Swal from "sweetalert2";

export default function FormCompras({ onClose, onSuccess, purchaseData, isEditing = false }) {
    const { store } = useStore();
    const [proveedores, setProveedores] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estado para múltiples productos
    const [productos, setProductos] = useState([{ 
        id_producto: "", 
        cantidad: 1, 
        precio_compra: "",
        nuevo_producto: null
    }]);

    const [idProveedor, setIdProveedor] = useState('');

    // Cargar datos al editar
    useEffect(() => {
        if (purchaseData && purchaseData.detalles) {
            setIdProveedor(purchaseData.id_proveedor);
            // Convertir los detalles a la estructura de múltiples productos
            const detallesFormateados = purchaseData.detalles.map(detalle => ({
                id_producto: detalle.id_producto,
                cantidad: detalle.cantidad,
                precio_compra: detalle.precio_compra,
                nuevo_producto: null
            }));
            setProductos(detallesFormateados);
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
        API.get(`/ant-box/products/getProducts/${store.id_tienda}?page=${1}&limit=${9999}`)
            .then(res => setProducts(res?.data?.rows || []))
            .catch(err => console.error(err.message));
    }, [store.id_tienda]);

    const handleAddProduct = () => {
        setProductos([...productos, { 
            id_producto: "", 
            cantidad: 1, 
            precio_compra: "",
            nuevo_producto: null
        }]);
    };

    const handleRemoveProduct = (index) => {
        if (productos.length > 1) {
            setProductos(productos.filter((_, i) => i !== index));
        }
    };

    const handleChangeProduct = (index, field, value) => {
        const updated = [...productos];
        updated[index][field] = value;
        setProductos(updated);
    };

    const handleChangeNewProduct = (index, field, value) => {
        const updated = [...productos];
        if (!updated[index].nuevo_producto) {
            updated[index].nuevo_producto = {
                nombre: '',
                descripcion: '',
                precio_compra: '',
                porcentaje_ganancia: '',
                stock_minimo: ''
            };
        }
        updated[index].nuevo_producto[field] = value;
        // Sincronizar precio_compra
        if (field === 'precio_compra') {
            updated[index].precio_compra = value;
        }
        setProductos(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validaciones
            if (!idProveedor) {
                Swal.fire("Error", "Debe seleccionar un proveedor.", "error");
                return;
            }

            if (productos.some(p => (!p.id_producto && !p.nuevo_producto?.nombre) || !p.cantidad || !p.precio_compra)) {
                Swal.fire("Error", "Todos los productos deben estar completos.", "error");
                return;
            }

            const payload = {
                id_proveedor: idProveedor,
                productos: productos.map(producto => ({
                    id_producto: producto.id_producto,
                    cantidad: Number(producto.cantidad),
                    precio_compra: Number(producto.precio_compra),
                    nuevo_producto: producto.id_producto ? null : {
                        nombre: producto.nuevo_producto?.nombre,
                        descripcion: producto.nuevo_producto?.descripcion || '',
                        precio_compra: Number(producto.precio_compra),
                        porcentaje_ganancia: Number(producto.nuevo_producto?.porcentaje_ganancia) || 0,
                        stock_minimo: Number(producto.nuevo_producto?.stock_minimo) || 0
                    }
                }))
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
            console.error("Error completo:", error);
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
                    <td>${(d.cantidad * d.precio_compra).toFixed(2)}</td>
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
                value={idProveedor}
                onChange={(e) => setIdProveedor(e.target.value)}
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
            
            {/* Lista de Productos */}
            <div className="flex flex-col gap-2 mt-2">
                {productos.map((producto, index) => (
                    <div key={index} className="border p-2 rounded">
                        <div className="flex items-center gap-2 relative">
                            <select 
                                value={producto.id_producto}
                                onChange={(e) => handleChangeProduct(index, 'id_producto', e.target.value)}
                                className="bg-gray-100/70 w-full shadow-sm placeholder-gray-500 px-4 py-2 rounded transition"
                                
                            >
                                <option value="">Seleccione un producto</option>
                                {products.map((p) => (
                                    <option key={p.id_producto} value={p.id_producto}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>

                            {productos.length > 1 && (
                                <Trash2
                                    onClick={() => handleRemoveProduct(index)}
                                    className="text-red-500 cursor-pointer hover:text-red-700"
                                    size={16}
                                />
                            )}
                        </div>

                        {/* Si no selecciona un producto existente, mostrar formulario para nuevo producto */}
                        {!producto.id_producto && (
                            <div className="border-t border-gray-300 pt-2 mt-2">
                                <h3 className="font-semibold mb-1 text-gray-700">Nuevo Producto</h3>
                                <label>Nombre</label>
                                <Input 
                                    value={producto.nuevo_producto?.nombre || ''} 
                                    onChange={(e) => handleChangeNewProduct(index, 'nombre', e.target.value)} 
                                    placeholder="Ej. Jabón líquido" 
                                    required
                                />
                                
                                <label>Descripción</label>
                                <Input 
                                    value={producto.nuevo_producto?.descripcion || ''} 
                                    onChange={(e) => handleChangeNewProduct(index, 'descripcion', e.target.value)} 
                                    placeholder="Ej. 500ml" 
                                />
                                
                                <label>Porcentaje de Ganancia</label>
                                <Input 
                                    type="number"
                                    value={producto.nuevo_producto?.porcentaje_ganancia || ''} 
                                    onChange={(e) => handleChangeNewProduct(index, 'porcentaje_ganancia', e.target.value)} 
                                    placeholder="15" 
                                />
                                
                                <label>Stock Mínimo</label>
                                <Input 
                                    type="number"
                                    value={producto.nuevo_producto?.stock_minimo || ''} 
                                    onChange={(e) => handleChangeNewProduct(index, 'stock_minimo', e.target.value)} 
                                    placeholder="3" 
                                />
                            </div>
                        )}

                        <div className="flex gap-2 mt-2">
                            <div className="flex-1">
                                <label>Cantidad</label>
                                <Input 
                                    type="number"
                                    placeholder="2"
                                    value={producto.cantidad}
                                    onChange={(e) => handleChangeProduct(index, 'cantidad', e.target.value)}
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="flex-1">
                                <label>Precio de compra</label>
                                <Input
                                    type="number"
                                    placeholder="100.00"
                                    value={producto.precio_compra}
                                    onChange={(e) => handleChangeProduct(index, 'precio_compra', e.target.value)}
                                    required
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button 
                    type="button"
                    onClick={handleAddProduct}
                    className="flex items-center justify-start gap-1 text-blue-600 text-xs mt-1"
                >
                    <PlusCircle size={14}/> Agregar producto
                </button>
            </div>

            <Button 
                name={loading ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"} 
                type="submit"
                disabled={loading}
                variant="addForm"
            />
        </form>
    )
}
