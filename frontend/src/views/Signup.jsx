import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeInfo } from 'lucide-react';
import Input from "../components/forms-components/Input";
import AntBoxBlack from '../assets/page-img/AntBox-Black.png';
import Button from '../components/forms-components/Button';
import API from '../services/API.js';
import Swal from 'sweetalert2';

export default function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
     
    const [userData, setUserData] = useState({
        nombreUsuario: '',
        apellido: '',
        correo: '',
        username: '',
        password: '',
        rol: 'administrador'
    });

    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [storeData, setStoreData] = useState({
        nombreTienda: '',
        direccion: '',
        telefono: '',
        moneda: '',
        logo: ''
    });

    const handleUserChange = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleStoreChange = (event) => {
        const { name, value } = event.target;
        setStoreData({ ...storeData, [name]: value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        
        if (userData.password !== passwordConfirm) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden.'
            })
            return;
        }

        try {
            const payload = {
                userData, 
                storeData
            }

            const response = await API.post('/ant-box/users/newAssociation', payload);

            Swal.fire({
                icon: 'success',
                title: '¡Registrado!',
                text: 'Tu tienda se ha asociado correctamente.'
            });

            setUserData({
                nombreUsuario: '',
                apellido: '',
                correo: '',
                username: '',
                password: '',
                rol: ''
            });

            setStoreData({
                nombreTienda: '',
                direccion: '',
                telefono: '',
                moneda: '',
                logo: ''
            });

            setPasswordConfirm('');
            navigate('/login');

        } catch (error) {
            const errors = error.response?.data?.errors;

            if (errors && Array.isArray(errors)) {
                const errorList = errors.map(err => `<li class="text-red-300">${err.msg}</li>`).join('');

                Swal.fire({
                icon: 'error',
                title: 'Errores en el formulario',
                html: `<ul class="text-center">${errorList}</ul>`
                });

            } else {
                Swal.fire({
                icon: 'error',
                title: '¡Error al asociarse!',
                text: error.response?.data?.message || 'Error del servidor'
                })
            }
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50/20">
            <div className="flex items-center gap-50">
                <div>
                    <img className="w-80 h-80" src={AntBoxBlack} alt="Ant Box Logo" />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                    {/* Users Forms */}
                    <div>
                        <p className="border-b border-gray-300 text-2xl font-bold py-1 mb-1">Información del propietario</p>
                        <span className="text-sm text-gray-400 flex items-center gap-2 mb-2">
                            <BadgeInfo className="w-3 h-3"/>
                            Los campos con un <span className="text-red-400">*</span>son obligatorios.
                        </span>

                        <div className="flex gap-8">
                            <label className="mb-5">
                                <span className="text-red-400">* </span>Nombre
                                <Input 
                                    type={'text'}
                                    placeholder={'Leonte'}
                                    name={'nombreUsuario'}
                                    onChange={handleUserChange}
                                />
                            </label>

                            <label>
                                <span className="text-red-400">* </span>Apellido
                                <Input 
                                    type={'text'}
                                    placeholder={'Canales'}
                                    name={'apellido'}
                                    onChange={handleUserChange}
                                />
                            </label>
                        </div>

                        <div className="flex gap-8">
                            <label>
                                <span className="text-red-400">* </span>Nombre de usuario
                                <Input 
                                    type={'text'}
                                    placeholder={'l3onte'}
                                    name={'username'}
                                    onChange={handleUserChange}
                                />
                            </label>
                            
                            <label className="mb-5">
                                <span className="text-red-400">* </span>Correo
                                <Input 
                                    type={'text'}
                                    placeholder={'l3onte@antbox.com'}
                                    name={'correo'}
                                    onChange={handleUserChange}
                                />
                            </label>
                        </div>

                        <div className="flex gap-8">
                            <label>
                                <span className="text-red-400">* </span>Contraseña
                                <Input 
                                    type={'password'}
                                    placeholder={'Password'}
                                    name={'password'}
                                    onChange={handleUserChange}
                                />
                            </label>

                            <label>
                                <span className="text-red-400">* </span>Confirmar Contraseña
                                <Input 
                                    type={'password'}
                                    placeholder={'Confirmar Password'}
                                    name={'confirmPassword'}
                                    onChange={(event) => setPasswordConfirm(event.target.value)}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Shop form */}
                    <div>
                        <p className="border-b border-gray-300 text-2xl font-bold py-1 mb-1">Información de la tienda</p>
                        <span className="text-sm text-gray-400 flex items-center gap-2 mb-2">
                            <BadgeInfo className="w-3 h-3"/>
                            Los campos con un <span className="text-red-400">*</span>son obligatorios.
                        </span>
                        <div className="flex gap-8">
                            <label className="mb-4">
                                <span className="text-red-400">* </span>Nombre de la tienda
                                <Input 
                                    type={'text'}
                                    placeholder={'Pulperia el gato'}
                                    name={'nombreTienda'}
                                    onChange={handleStoreChange}
                                />
                            </label>

                            <label>
                                Direccion
                                <Input 
                                    type={'text'}
                                    placeholder={'Rpto. Roberto Calderon'}
                                    name={'direccion'}
                                    onChange={handleStoreChange}
                                /> 
                            </label>
                        </div>

                        <div className="flex gap-8">
                            <label>
                                Telefono
                                <Input 
                                    type={'tel'}
                                    placeholder={'+505 5432 5432'}
                                    name={'telefono'}
                                    onChange={handleStoreChange}
                                />
                            </label>

                            <label className="flex flex-col">
                                <div className="flex">
                                    <span className="text-red-400 mr-1">*</span>
                                    <span>Moneda</span> 
                                </div>
                                <select 
                                    className="bg-gray-100/70 w-70 shadow-sm placeholder-gray-500 px-4 py-2 rounded transition"
                                    name="moneda"
                                    onChange={handleStoreChange}
                                >
                                    <option>NIO - Córdoba</option>
                                    <option>USD - Dólar Estadounidense</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label>
                            Logo de la tienda 
                            <Input 
                                type="file" 
                                onChange={(e) => setStoreData({ ...storeData, logo: e.target.files[0] })}      
                            />
                        </label>
                    </div>

                    <Button 
                        name={'Asociar Tienda'}
                        type={'submit'}
                        variant={'signup'}
                    />
                </form>
            </div>
        </div>
    )
}