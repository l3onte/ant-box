import { useState, useEffect } from "react";
import { useStore } from "../../services/storeContext";
import Input from "../forms-components/Input";
import Button from "../forms-components/Button";
import API from "../../services/API";
import Swal from "sweetalert2";
import { UserPlus, PlusCircle, Trash2 } from 'lucide-react';

export default function FormVentas() {
    const { store } = useStore();
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [saleProducts, setSaleProducts] = useState([{ id_producto: "", cantidad: 1 }]);
    const [newCustomer, setNewCustomer] = useState({
        nombre: "",
        direccion: "",
        telefono: "",
        email: ""
    });

    useEffect(() => {
        API.get(`/ant-box/customers/getCustomers/${store.id_tienda}`)
            .then((res) => setCustomers(res.data.rows || []))
            .catch(console.error);
    }, [store.id_tienda]);

    useEffect(() => {
        API.get(`/ant-box/sales/getProducts/${store.id_tienda}`)
            .then((res) => setProducts(res.data))
            .catch(console.error);
    }, [store.id_tienda]);

    const handleAddProduct = () => {
        setSaleProducts([...saleProducts, { id_producto: "", cantidad: 1 }]);
    };

    const handleRemoveProduct = (index) => {
        setSaleProducts(saleProducts.filter((_, i) => i !== index));
    };

    const handleChangeProduct = (index, field, value) => {
        const updated = [...saleProducts];
        updated[index][field] = value;
        setSaleProducts(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCustomer && !isAddFormOpen) {
            Swal.fire("Error", "Debe seleccionar o agregar un cliente.", "error");
            return;
        }

        if (saleProducts.some(p => !p.id_producto || p.cantidad <= 0)) {
            Swal.fire("Error", "Debe seleccionar productos y cantidades válidas.", "error");
            return;
        }

        try {
            let id_cliente = selectedCustomer;

            if (isAddFormOpen) {
                const newCustomerRes = await API.post(`/ant-box/customers/postCustomer/${store.id_tienda}`, newCustomer);
                id_cliente = newCustomerRes.data.id_cliente;
            }

            const saleInfo = {
                fecha_venta: new Date().toISOString().split("T")[0],
                id_cliente,
                productos: saleProducts
            };

            const result = await API.post(`/ant-box/sales/postSale/${store.id_tienda}`, { saleInfo });

            Swal.fire("Éxito", "Venta registrada correctamente.", "success");

            const receipt = await API.get(`/ant-box/sales/receipt/${result.data.ventaId}`);
            openReceiptWindow(receipt.data);
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo registrar la venta.", "error");
        }
    };

    const openReceiptWindow = (data) => {
        const { venta, detalles } = data;

        const html = `
          <html>
            <head>
              <title>Recibo de Venta #${venta.id_venta}</title>
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
              <h2>Recibo de Venta</h2>
              <p><strong>ID Venta:</strong> ${venta.id_venta}</p>
              <p><strong>Cliente:</strong> ${venta.cliente}</p>
              <p><strong>Fecha:</strong> ${venta.fecha_venta}</p>

              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${detalles.map(d => `
                    <tr>
                      <td>${d.producto}</td>
                      <td>${d.cantidad}</td>
                      <td>${d.precio_unitario}</td>
                      <td>${d.subtotal}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>

              <p class="total">Total: ${venta.total}</p>
              <script>window.print();</script>
            </body>
          </html>
        `;

        const win = window.open("", "_blank");
        win.document.write(html);
        win.document.close();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 w-full max-h-[60vh] overflow-y-auto p-1 text-sm text-black"
        >
            <div className="flex items-center gap-2 relative">
                <select
                    className="bg-gray-100/70 w-full shadow-sm px-3 py-2 rounded text-sm"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    disabled={isAddFormOpen}
                >
                    <option value="">Seleccione un cliente</option>
                    {customers.map((c) => (
                        <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>
                    ))}
                </select>

                <UserPlus
                    onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                    className="absolute right-5 size-4 hover:text-gray-500 cursor-pointer"
                />
            </div>

            {isAddFormOpen && (
                <div className="flex flex-col items-center gap-3 rounded text-sm">
                    <Input placeholder="Nombre" value={newCustomer.nombre}
                        onChange={(e) => setNewCustomer({ ...newCustomer, nombre: e.target.value })} />
                    <Input placeholder="Dirección" value={newCustomer.direccion}
                        onChange={(e) => setNewCustomer({ ...newCustomer, direccion: e.target.value })} />
                    <Input placeholder="Teléfono" value={newCustomer.telefono}
                        onChange={(e) => setNewCustomer({ ...newCustomer, telefono: e.target.value })} />
                    <Input placeholder="Correo" value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                </div>
            )}

            <div className="flex flex-col gap-2 mt-2">
                {saleProducts.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <select
                            className="bg-gray-100/70 shadow-sm px-3 py-2 rounded text-sm"
                            value={item.id_producto}
                            onChange={(e) => handleChangeProduct(index, "id_producto", e.target.value)}
                        >
                            <option value="">Producto...</option>
                            {products.map((p) => (
                                <option key={p.id_producto} value={p.id_producto}>
                                    {p.nombre} | {p.precio_venta} {store.moneda === 'NIO' ? 'C$' : '$'} | <span>stock {p.stock}</span>
                                </option>
                            ))}
                        </select>

                        <input 
                            type="number" 
                            min="1"
                            value={item.cantidad}
                            onChange={(e) => handleChangeProduct(index, "cantidad", e.target.value)}
                            placeholder="Cant."   
                            className="w-16 text-sm bg-gray-100/70 shadow-sm placeholder-gray-500 px-4 py-2 rounded transition" 
                        />

                        {saleProducts.length > 1 && (
                            <Trash2
                                onClick={() => handleRemoveProduct(index)}
                                className="text-red-500 cursor-pointer hover:text-red-700"
                                size={16}
                            />
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddProduct}
                    className="flex items-center justify-start gap-1 text-blue-600 text-xs mt-1"
                >
                    <PlusCircle size={14} /> Agregar producto
                </button>
            </div>

            {/* Botón Guardar */}
            <div className="flex justify-end">
                <Button
                    name="Guardar venta"
                    type="submit"
                    variant="addForm"
                    className="w-full text-sm py-2"
                />
            </div>
        </form>
    );
}
