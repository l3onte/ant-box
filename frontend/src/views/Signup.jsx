import Input from "../components/forms-components/Input";
import AntBoxBlack from '../assets/page-img/AntBox-Black.png';
import Button from '../components/forms-components/Button';

export default function Signup() {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50/20">
            <div className="flex items-center gap-50">
                <div>
                    <img className="w-100 h-100" src={AntBoxBlack} alt="Ant Box Logo" />
                </div>

                <form action="" className="flex flex-col gap-y-4">
                    {/* Users Forms */}
                    <div>
                        <p className="border-b border-gray-300 text-2xl font-bold py-1 mb-2">Información del propietario</p>
                        <div className="flex gap-8">
                            <label className="mb-5">
                                Nombre
                                <Input 
                                    type={'text'}
                                    placeholder={'Leonte'}
                                />
                            </label>

                            <label>
                                Apellido
                                <Input 
                                    type={'text'}
                                    placeholder={'Canales'}
                                />
                            </label>
                        </div>

                        <div className="flex gap-8">
                            <label>
                                Nombre de usuario
                                <Input 
                                    type={'text'}
                                    placeholder={'l3onte'}
                                />
                            </label>
                            
                            <label className="mb-5">
                                Correo
                                <Input 
                                    type={'text'}
                                    placeholder={'l3onte@antbox.com'}
                                />
                            </label>
                        </div>

                        <div className="flex gap-8">
                            <label>
                                Contraseña
                                <Input 
                                    type={'password'}
                                    placeholder={'Password'}
                                />
                            </label>

                            <label>
                                Confirmar Contraseña
                                <Input 
                                    type={'password'}
                                    placeholder={'Confirmar Password'}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Shop form */}
                    <div>
                        <p className="border-b border-gray-300 text-2xl font-bold py-1 mb-2">Información de la tienda</p>
                        <div className="flex gap-8">
                            <label className="mb-4">
                                Nombre de la tienda
                                <Input 
                                    type={'text'}
                                    placeholder={'Pulperia el gato'}
                                />
                            </label>

                            <label>
                                Direccion
                                <Input 
                                    type={'text'}
                                    placeholder={'Rpto. Roberto Calderon'}
                                /> 
                            </label>
                        </div>

                        <div className="flex gap-8">
                            <label>
                                Telefono
                                <Input 
                                    type={'tel'}
                                    placeholder={'+505 5432 5432'}
                                />
                            </label>

                            <label className="flex flex-col">
                                Moneda 
                                <select className="bg-gray-100/70 w-70 shadow-sm placeholder-gray-500 px-4 py-2 rounded transition">
                                    <option>NIO - Córdoba</option>
                                    <option>USD - Dólar Estadounidense</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label>
                            Logo de la tienda 
                            <Input type={'file'} accept='image/*'/>
                        </label>
                    </div>

                    <Button 
                        name={'Asociar Tienda'}
                        type={'signup'}
                    />
                </form>
            </div>
        </div>
    )
}