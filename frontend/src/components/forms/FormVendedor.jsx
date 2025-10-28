import { useState, useEffect } from "react"
import { useStore } from "../../services/storeContext"
import Input from "../forms-components/Input"
import Button from "../forms-components/Button"
import API from "../../services/API"
import Swal from "sweetalert2"

export default function FormVendedor({ onClose, onSuccess, sellerData, isEditing = false }) {
    const { store } = useStore();

    const [userData, setUserData] = useState({
        nombre: '',
        apellido: '',
        username: '',
        correo: '',
        password: '',
        rol: 'vendedor'
    });
    
    useEffect(() => {
        if (sellerData) {
            const [nombre = '', apellido = ''] = (sellerData.Vendedor || '').split(' ');

            setUserData({
                nombre,
                apellido,
                username: sellerData.Username || '',
                correo: sellerData.Correo || '',
                password: '',
                rol: sellerData.Rol || 'vendedor'
            })
        }
    }, [sellerData]);

    const handleChange = (event) => {
        setUserData(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (isEditing) {
                await API.put(`/ant-box/sellers/updateSeller/${sellerData.id}`, {userData});
                
                Swal.fire({
                    icon: "success",
                    title: "Vendedor Actualizado",
                    text: "Los datos se han guardado correctamente.",
                    timer: 1500,
                    showConfirmButton: false
                })
            } else {
                await API.post(`/ant-box/sellers/postSeller/${store.id_tienda}`, { userData })
                
                Swal.fire({
                    icon: "success",
                    title: 'Vendedor Agregado!',
                    text: 'El vendedor se agrego con exito',
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
                Nombre
                <Input 
                    name="nombre"  
                    value={userData.nombre} 
                    onChange={handleChange} 
                    placeholder={'Luis'}
                />
            </label>

            <label>
                Apellido
                <Input 
                    name="apellido"  
                    value={userData.apellido} 
                    onChange={handleChange} 
                    placeholder={'Sandoval'}
                />
            </label>

            <label>
                Username
                <Input 
                    name="username" 
                    value={userData.username} 
                    onChange={handleChange} 
                    placeholder={'luis007'}
                />
            </label>

            <label>
                Correo
                <Input 
                    name="correo"  
                    value={userData.correo} 
                    onChange={handleChange} 
                    placeholder={'luis@antbox.com'}
                />
            </label>

            {!isEditing && (
                <label>
                    Contraseña
                    <Input 
                        name="password" 
                        type="password" 
                        value={userData.password} 
                        onChange={handleChange} 
                        placeholder={'Password'}
                    />
                </label>
            )}

            <label className="flex flex-col">
                Rol
                <select 
                    name="rol"
                    value={userData.rol}
                    onChange={handleChange}
                    className="bg-gray-100/70 w-70 shadow-sm placeholder-gray-500 px-4 py-2 rounded transition">
                    <option value="vendedor">Vendedor</option>
                    <option value="administrador">Administrador</option>
                </select>
            </label>
            <Button 
                name="Guardar" 
                type="submit"
                variant={'addForm'}
            />
        </form>
    )
}