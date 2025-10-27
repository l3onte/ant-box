import { useState } from "react"
import { useStore } from "../../services/storeContext"
import Input from "../forms-components/Input"
import Button from "../forms-components/Button"
import API from "../../services/API"
import Swal from "sweetalert2"

export default function FormVendedor({ onClose, onSuccess }) {
    const { store } = useStore();

    const [userData, setUserData] = useState({
        nombre: '',
        apellido: '',
        username: '',
        correo: '',
        password: '',
        rol: 'vendedor'
    });
    
    const handleChange = (event) => {
        setUserData(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await API.post(`/ant-box/sellers/postSeller/${store.id_tienda}`, { userData })
            onSuccess();

            Swal.fire({
                icon: "success",
                title: 'Vendedor Agregado!',
                text: 'El vendedor se agrego con exito',
                timer: 1500,
                showConfirmButton: false
            })

            onClose();
        } catch (error) {   
            console.error(error);

            const message = error.response?.data?.errors 
                ? error.response.data.errors.map(e => e.msg).join(', ')
                : error.message;

            Swal.fire({
                icon: "error",
                title: "Error",
                text: message,
                timer: 2500
            })
        }
    }

    return (
        <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
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

            <label className="flex flex-col">
                Rol
                <select 
                    name="moneda"
                    value={userData.rol}
                    onChange={handleChange}
                    className="bg-gray-100/70 w-70 shadow-sm placeholder-gray-500 px-4 py-2 rounded transition">
                    <option value="vendedor">Vendedor</option>
                    <option value="administrador">Administrador</option>
                </select>
            </label>
            <Button name="Guardar" type="submit"/>
        </form>
    )
}