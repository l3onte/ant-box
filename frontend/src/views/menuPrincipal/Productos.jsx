import ModuleLayout from "../../components/layout-components/ModuleLayout"

export default function Productos() {
    const moduleInfo = {
        title: 'Productos',
        route: 'Menu Principal / Productos',
        buttonName: 'Nuevo Producto',
        buttonType: 'submit',
        buttonVariant: 'add'
    }

    return (
        <ModuleLayout moduleInfo={moduleInfo} />
    )
}