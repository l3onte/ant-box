import ModuleLayout from "../../components/layout-components/ModuleLayout"

export default function Vendedores() {
    const moduleInfo = {
        title: 'Vendedores',
        route: 'Menu Principal / Vendedores',
        buttonName: 'Nuevo Vendedor',
        buttonType: 'submit',
        buttonVariant: 'add'
    }

    return (
        <ModuleLayout moduleInfo={moduleInfo}/>
    )
}