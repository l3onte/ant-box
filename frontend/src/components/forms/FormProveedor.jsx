import Input from "../forms-components/Input"
import Button from "../forms-components/Button"
import API from "../../services/API"
import { useState, useEffect } from "react"
import { useStore } from "../../services/storeContext"
import Swal from "sweetalert2"

export default function FormSupplier({ onClose, onSuccess,  supplierDataEdit, isEditing = false }) {
    const { store } = useStore();

    const [supplierData, setSupplierData] = useState({
        nombre: '',
        direccion: '',
        telefono: '',
        email: '',
        status: 'Activo',
        id_proveedor: ''
    });

    useEffect(() => {
        if (supplierDataEdit) {
            setSupplierData({
                nombre: supplierDataEdit.nombre,
                direccion: supplierDataEdit.direccion,
                telefono: supplierDataEdit.telefono,
                email: supplierDataEdit.email,
                status: supplierDataEdit.status,
                id_proveedor: supplierDataEdit.id_proveedor
            });
        }
    }, [supplierDataEdit]);


    const handleChange = (event) => {
        setSupplierData(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (isEditing) {
                console.log(supplierDataEdit.id_proveedor)
                await API.put(`/ant-box/suppliers/updateSupplier/${supplierDataEdit.id_proveedor}`, { updateData: supplierData});

                Swal.fire({
                    icon: "success",
                    title: "Proveedor Actualizado",
                    text: "Los datos se han actualizado correctamente.",
                    timer: 1500,
                    showConfirmButton: false
                })
            } else {
                await API.post(`/ant-box/suppliers/postSupplier/${store.id_tienda}`, {supplierData});

                Swal.fire({
                    icon: "success",
                    title: 'Proveedor Agregado!',
                    text: 'El proveedor se agrego con éxito',
                    timer: 1500,
                    showConfirmButton: false
                })
            }

            onSuccess();
            onClose();
        } catch (error) {
            const errors = error.response?.data?.errors;

            if (errors && Array.isArray(errors)) {
                const errorList = errors.map(err => `<li class="text-red-300">${err.msg}</li>`).join('');

                Swal.fire({
                    icon: 'error',
                    title: 'Errores al actualizar',
                    html: `<ul class="text-center">${errorList}</ul>`
                });

            } else {
                Swal.fire({
                    icon: 'error',
                    title: '¡Error al actualizar!',
                    text: error.response?.data?.message || 'Error del servidor'
                })
            }
        }
    }

    return (
        <form className="flex flex-col gap-2 text-black" onSubmit={handleSubmit}> 
            <label>
                Proveedor
                <Input
                    type={'text'}
                    placeholder={'Maseca.SA'}
                    name={'nombre'}
                    value={supplierData.nombre}
                    onChange={handleChange}
                />
            </label>

            <label>
                Direccion
                <Input
                    type={'text'}
                    placeholder={'Rpto. Roberto Calderon'}
                    name={'direccion'}
                    value={supplierData.direccion}
                    onChange={handleChange}
                />
            </label>            

            <label>
                Telefono
                <Input 
                    type={'text'}
                    placeholder={'+505 8880 0237'}
                    name={'telefono'}
                    value={supplierData.telefono}
                    onChange={handleChange}
                />
            </label>

            <label>
                Correo
                <Input
                    type={'email'}
                    placeholder={'maseca@gruma.com'}
                    name={'email'}
                    value={supplierData.email}
                    onChange={handleChange}
                />
            </label>

            {isEditing && (
                <label className="flex flex-col">
                    Estado
                    <select 
                        name="status"
                        value={supplierData.status}
                        onChange={handleChange}
                        className="bg-gray-100/70 w-70 shadow-sm placeholder-gray-500 px-4 py-2 rounded transition">
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </label>
            )}

            <Button 
                name="Guardar" 
                type="submit"
                variant={'addForm'}
            />
        </form>
    )
}