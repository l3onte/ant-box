import ModuleLayout from "../../components/layout-components/ModuleLayout"

export default function Clientes() {
    const moduleInfo = {
        title: 'Clientes',
        route: 'Menu Principal / Clientes',
        buttonName: 'Nuevo Cliente',
        buttonType: 'submit',
        buttonVariant: 'add'
    }

    return (
        <ModuleLayout moduleInfo={moduleInfo}/>
    )
    
}