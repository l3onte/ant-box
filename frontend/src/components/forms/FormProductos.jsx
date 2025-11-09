import Input from "../forms-components/Input"
import Button from "../forms-components/Button"
import API from "../../services/API.js"
import { useState, useEffect } from "react"
import { useStore } from "../../services/storeContext.jsx"
import Swal from "sweetalert2";

export default function Productos({ isEditing, onClose, onSuccess, productDataEdit }) {
    const { store } = useStore();
    const [proveedores, setProveedores] = useState([]);
    const [productData, setProductData] = useState({
        id_proveedor: '',
        nombre: '',
        descripcion: '',
        precio_compra: '',
        porcentaje_ganancia: ''
    });

    useEffect(() => {
        if (productDataEdit) {
            setProductData({
                id_proveedor: productDataEdit.id_proveedor || '',
                nombre: productDataEdit.nombre || '',
                descripcion: productDataEdit.descripcion || '',
                precio_compra: productDataEdit.precio_compra || '',
                porcentaje_ganancia: productDataEdit.porcentaje_ganancia || ''
            });
        }
    }, [productDataEdit]);

    const handleChange = (event) => {
        setProductData(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    useEffect(() => {
        API.get(`/ant-box/suppliers/getSuppliers/${store.id_tienda}`)
            .then((response) => {
                setProveedores(response.data.result);
            })
            .catch(error => console.error(error.message));
    }, [store.id_tienda]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await API.put(`/ant-box/products/updateProduct/${productDataEdit.id_producto}`, productData )
            
            Swal.fire({
                icon: "success",
                title: "Producto Actualizado",
                text: "Los datos se han actualizado correctamente.",
                timer: 1500,
                showConfirmButton: false
            })
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo actualizar el producto.",
            });
        }
    }


    return (
        <form className="flex flex-col gap-2 text-black" onSubmit={handleSubmit}> 
            <label className="flex flex-col">
                Proveedor
                <select
                    name="id_proveedor"
                    value={productData.id_proveedor}
                    onChange={handleChange}
                    className="bg-gray-100/70 w-70 shadow-sm placeholder-gray-500 px-4 py-2 rounded transition"
                >
                    <option value="">Seleccione un proveedor</option>
                    {proveedores.map((proveedor) => (
                        <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                            {proveedor.nombre}
                        </option>
                    ))}
                </select>

            </label>

            <label>
                Pruducto
                <Input
                    type={'text'}
                    placeholder={'Jabulani'}
                    name={'nombre'}
                    value={productData.nombre}
                    onChange={handleChange}
                />
            </label>            

            <label>
                Descripción
                <Input 
                    type={'text'}
                    placeholder={'Balon de futbol'}
                    name={'descripcion'}
                    value={productData.descripcion}
                    onChange={handleChange}
                />
            </label>

            <label>
                Precio de compra
                <Input
                    type={'number'}
                    placeholder={'100.00'}
                    name={'precio_compra'}
                    value={productData.precio_compra}
                    onChange={handleChange}
                />
            </label>

            <label>
                Porcentaje de ganancia
                <Input
                    type={'number'}
                    placeholder={'5%'}
                    name={'porcentaje_ganancia'}
                    value={productData.porcentaje_ganancia}
                    onChange={handleChange}
                />
            </label>

            <Button 
                name="Guardar" 
                type="submit"
                variant={'addForm'}
            />
        </form>
    )
}