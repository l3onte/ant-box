import Input from "./Input"
import Button from "./Button"

export default function LoginForm() {
    return (
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
    )
}