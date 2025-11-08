import ModuleLayout from "../../components/layout-components/ModuleLayout";
import TableControls from "../../components/layout-components/table-components/TableControls";
import Pagination from "../../components/layout-components/table-components/Pagination";
import Table from "../../components/layout-components/Table.jsx";
import { useEffect, useState } from "react";
import API from "../../services/API.js";
import { useStore } from "../../services/storeContext.jsx";
import { Edit, Trash2 } from "lucide-react";

export default function Compras() {
    const { store } = useStore();
    const [purchases, setPurchases] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [total, setTotal] = useState(0);

    const moduleInfo = {
        title: 'Compras',
        route: 'Reportes / Compras',
        buttonName: 'Nueva Compra',
        buttonType: 'submit',
        buttonVariant: 'add'
    }

    const columns = [
        { header: 'id', accessor: 'id_compra' },
        { header: 'Fecha de Compra', accessor: 'fecha_compra' },
        { header: 'Proveedor', accessor: 'proveedor' },
        { header: 'Producto', accessor: 'producto' },
        { header: 'Cantidad', accessor: 'cantidad' },
        { 
            header: 'Precio de Compra', 
            accessor: 'precio_compra',
            Cell: (row) => (
                <div>
                    {row.precio_compra} 
                    <span>{store.moneda === 'NIO' ? 'C$' : '$'}</span>
                </div>
            )
        },
        { 
            header: 'Total', 
            accessor: 'total',
            Cell: (row) => (
                <div>
                    {row.total}
                    <span>{store.moneda === 'NIO' ? 'C$' : '$'}</span>
                </div>
            ) 
        },
        {
            header: '',
            accessor: 'actions',
            Cell: () => (
                <div className="flex gap-2">
                    <button
                        className="p-1 text-gray-700 rounded cursor-pointer hover:text-gray-500"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        className="p-1 text-gray-700 rounded cursor-pointer hover:text-gray-500"
                    >
                        <Edit size={16} />
                    </button>
                </div>
            )
        }
    ]

    useEffect(() => {
        API.get(`/ant-box/purchases/getPurchases/${store.id_tienda}?page=${page}&limit=${limit}`)
            .then((response) => {
                setPurchases(response?.data?.rows);
                setTotal(response?.data?.total);
            })
            .catch(error => console.error(error)); 
    }, [store.id_tienda, page])

    return (
        <ModuleLayout moduleInfo={moduleInfo}>
            <TableControls />
            <Table 
                columns={columns} 
                data={purchases} 
            />
            <Pagination 
                page={page}
                limit={limit}
                total={total}
                onPageChange={(newPage) => setPage(newPage)} 
            />
        </ModuleLayout>
    )
}