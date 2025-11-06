import ModuleLayout from "../../components/layout-components/ModuleLayout";
import TableControls from "../../components/layout-components/table-components/TableControls";
import Pagination from "../../components/layout-components/table-components/Pagination";

export default function Productos() {
    const moduleInfo = {
        title: 'Productos',
        route: 'Menu Principal / Productos',
        buttonName: 'Nuevo Producto',
        buttonType: 'submit',
        buttonVariant: 'add'
    }

    return (
        <ModuleLayout 
            moduleInfo={moduleInfo}
        >
            <TableControls />
            <Pagination/>
        </ModuleLayout>
    )
}