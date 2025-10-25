import ModuleLayout from "../../components/layout-components/ModuleLayout";

export default function Compras() {
    const moduleInfo = {
        title: 'Compras',
        route: 'Reportes / Compras',
        buttonName: 'Nueva Compra',
        buttonType: 'submit',
        buttonVariant: 'add'
    }

    return (
        <ModuleLayout moduleInfo={moduleInfo} />
    )
}