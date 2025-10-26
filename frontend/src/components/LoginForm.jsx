import { useState } from "react";
import { useUser } from '../services/userContext';
import { useStore } from "../services/storeContext";
import { useNavigate } from "react-router-dom";
import Input from "./forms-components/Input"
import Button from "./forms-components/Button"
import API from "../services/API";
import Swal from "sweetalert2";

export default function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });  

  const { setStore } = useStore();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await API.post('/ant-box/users/login', {
        username: loginData.username,
        password: loginData.password
      });

      const user = response.data.user;
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    
      const storeResponse = await API.get(`/ant-box/store/getStoreById/${user.id}`);
      const storeData = storeResponse.data;

      setStore(storeData);
      localStorage.setItem('store', JSON.stringify(storeData)); 

      Swal.fire({
        icon: 'success',
        title: '¡Inicio de sesión exitoso!',
        text: 'Bienvenido de nuevo.'
      });

      navigate('/dashboard');
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
          title: '¡Error de inicio de sesión!',
          text: error.response?.data?.message || 'Error del servidor'
        })
      }
    }
  }

  return (
        <form 
          onSubmit={handleLogin} 
          className='flex flex-col gap-4'
        >
          <Input 
            type={'text'} 
            placeholder={'Nombre de usuario'}
            name={'username'}
            onChange={handleChange}
          />

          <Input 
            type={'password'} 
            placeholder={'Contraseña'}
            name={'password'}
            onChange={handleChange} 
          />

          <div className='flex justify-between text-sm'>
            <label className='flex gap-1 cursor-pointer'>
              <input type="checkbox"/>
              Recuerdame
            </label>
            
            <div>
              <span className='text-sky-600 underline hover:text-sky-300 cursor-pointer'>
                Olvide mi contraseña
              </span>
            </div>
          </div>

          <Button 
            name={'Iniciar Sesión'} 
            type={'submit'} 
            variant={'login'}
          />
        </form>
    )
}