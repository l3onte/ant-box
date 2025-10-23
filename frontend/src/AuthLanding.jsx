import { useState } from 'react'
import Input from './components/forms-components/Input'
import Button from './components/forms-components/Button'
import AntBoxBlack from './assets/page-img/AntBox-Black.png';

function AuthLanding() {
  return (
    <>
      <div className='flex flex-col items-center justify-center h-screen bg-gray-50/20'>
        <div className='flex gap-20 items-center justify-between'>
          <div className='flex flex-col'>
            <img className='w-90 h-90' src={AntBoxBlack} alt="Ant Box logo" aria-label='Ant Box Logo'/>
          </div>

          <div className='flex flex-col gap-2'>
            <form action="" className='flex flex-col gap-4'>
              <Input type={'text'} placeholder={'Nombre de usuario'}/>
              <Input type={'password'} placeholder={'Contraseña'} />

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

              <Button name={'Iniciar Sesión'} type={'login'}/>
            </form>

            <div className='flex text-gray-300 gap-3 items-center'>
              <div className='border w-full'></div>
              <span>O</span>
              <div className='border w-full'></div>
            </div> 

            <Button name={'Crear Cuenta'} type={'signup'}/>
          </div>         
        </div>
      </div>
    </>
  )
}

export default AuthLanding
