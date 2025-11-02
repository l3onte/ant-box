import { useState, useEffect } from "react"
import { useStore } from "../../services/storeContext"
import Input from "../forms-components/Input"
import Button from "../forms-components/Button"
import API from "../../services/API"
import Swal from "sweetalert2"
import { UserPlus } from 'lucide-react';

export default function FormVentas() {
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);

    return (
        <form className="relative flex flex-col gap-2 text-black">

            <div className="flex items-center gap-2">
                <select className="bg-gray-100/70 w-70 shadow-sm placeholder-gray-500 px-4 py-2 rounded transition">
                    <option selected>Seleccione un cliente</option>
                </select>

                <UserPlus 
                    onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                    className="-right-8 absolute size-5 hover:text-gray-400 transition transform duration-300 cursor-pointer"
                />
            </div>

            {isAddFormOpen && (
                <>
                    <label>
                        Cliente
                        <Input placeholder={'Brithany Blanco'}/>
                    </label>            
                    <label>
                        Dirección
                        <Input placeholder={'Rpto. Roberto Calderon'}/>
                    </label>
                    <label>
                        Telefono
                        <Input placeholder={'+505 8880 0237'}/>
                    </label>
                    <label>
                        Correo
                        <Input placeholder={'brithany@antbox.com'}/>
                    </label>
                </>
            )}

            
            <label className="flex flex-col">
                Producto
                <select className="bg-gray-100/70 w-70 shadow-sm placeholder-gray-500 px-4 py-2 rounded transition">
                    <option value="">Productos...</option>
                </select>
            </label>

            <label>
                Cantidad
                <Input type={'number'} placeholder={'5'}/>
            </label>

            <Button 
                name="Guardar"
                type="submit"
                variant={'addForm'}
            />
        </form>
    )
}