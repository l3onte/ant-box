import { useState } from 'react'
import LoginForm from './components/LoginForm';
import Button from './components/forms-components/Button'
import AntBoxBlack from './assets/page-img/AntBox-Black.png';

function AuthLanding() {
  return (
    <>
      <div className='flex flex-col items-center justify-center h-screen bg-gray-50/20'>
        <div className='flex gap-20 items-center justify-between'>
          <div className='flex flex-col'>
            <img className='w-60 h-60' src={AntBoxBlack} alt="Ant Box logo" aria-label='Ant Box Logo'/>
          </div>

          <div className='flex flex-col gap-2'>
            <LoginForm />

            <div className='flex text-gray-300 gap-3 items-center'>
              <div className='border w-full'></div>
              <span>O</span>
              <div className='border w-full'></div>
            </div> 

            <Button 
              name={'Asociar Tienda'} 
              type={'signup'} 
              to={'/signup'}
              variant={'signup'}
            />
          </div>         
        </div>
      </div>
    </>
  )
}

export default AuthLanding
