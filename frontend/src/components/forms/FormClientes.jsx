import API from "../../services/API"
import Input from "../forms-components/Input"
import Button from "../forms-components/Button"
import { useEffect, useState } from "react"
import { useStore } from "../../services/storeContext"
import Swal from "sweetalert2"

export default function FormClientes({ onClose, onSuccess, customerData }) {
    const { store } = useStore();
    const [data, setData] = useState({
        nombre: customerData.nombre || "",
        direccion: customerData.direccion || "",
        telefono: customerData.telefono || "",
        email: customerData.email || ""
    })

    useEffect(() => {
        setData({
            nombre: customerData?.nombre || "",
            direccion: customerData?.direccion || "",
            telefono: customerData?.telefono || "",
            email: customerData?.email || ""
        })
    }, [customerData])

    const handleChange = (event) => {
        setData(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await API.put(`/ant-box/customers/updateCustomer/${customerData.id_cliente}`, {data});

            Swal.fire({
                icon: "success",
                title: "Vendedor Actualizado",
                text: "Los datos se han guardado correctamente.",
                timer: 1500,
                showConfirmButton: false
            })

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
                Cliente
                <Input 
                    type={'text'}
                    name={'nombre'}
                    value={data.nombre}
                    onChange={handleChange}
                />
            </label>

            <label>
                Dirección
                <Input 
                    type={'text'}
                    name={'direccion'}
                    value={data.direccion}
                    onChange={handleChange}
                />
            </label>

            <label>
                Telefono 
                <Input 
                    type={'text'}
                    name={'telefono'}
                    value={data.telefono}
                    onChange={handleChange}
                />
            </label>

            <label>
                Correo 
                <Input 
                    type={'text'}
                    name={'email'}
                    value={data.email}
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