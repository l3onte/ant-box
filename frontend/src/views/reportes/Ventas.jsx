import ModuleLayout from "../../components/layout-components/ModuleLayout";

export default function Ventas() {
    const moduleInfo = {
        title: 'Ventas',
        route: 'Reportes / Ventas',
        buttonName: 'Nueva Venta',
        buttonType: 'submit',
        buttonVariant: 'add'
    }

    return (
        <ModuleLayout moduleInfo={moduleInfo}/>
    )
}