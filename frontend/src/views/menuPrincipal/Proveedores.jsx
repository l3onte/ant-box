import ModuleLayout from "../../components/layout-components/ModuleLayout"

export default function Productos() {
    const moduleInfo = {
        title: 'Proveedores',
        route: 'Menu Principal / Proveedores',
        buttonName: 'Nuevo Proveedor',
        buttonType: 'submit',
        buttonVariant: 'add'
    }

    return (
        <ModuleLayout moduleInfo={moduleInfo} />
    )
}