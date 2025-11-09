import { useEffect, useState } from "react";
import ModuleLayout from "../../components/layout-components/ModuleLayout";
import Table from '../../components/layout-components/Table';
import Pagination from "../../components/layout-components/table-components/Pagination";
import TableControls from "../../components/layout-components/table-components/TableControls";
import API from "../../services/API";
import { useStore } from "../../services/storeContext";
import { Menu } from "lucide-react";

export default function Inventario() {
    const { store } = useStore();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('ASC');

    const moduleInfo = {
        title: 'Inventario',
        route: 'Reportes / Inventario'
    }
    
    const columns = [
        { header: 'nombre', accessor: 'nombre'},
        { header: 'descripción', accessor: 'descripcion' },
        { header: 'comprado', accessor: 'total_comprado' },
        { header: 'vendido', accessor: 'total_vendido' },
        { header: 'stock', accessor: 'stock_real' },
        { 
            header: 'estado', 
            accessor: 'alerta_stock',
            Cell: (row) => (
                <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                        row.alerta_stock === 'OK'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                >
                    {row.alerta_stock}
                </span>
            )
        },
        { 
            header: '',
            accessor: 'actions',
            Cell: (row) => (
                <button>
                    <Menu size={16}/>
                </button>
            )
         }
    ]

    useEffect(() => {
        API.get(`/ant-box/inventory/getInventory/${store.id_tienda}?page=${page}&limit=${limit}&search=${searchTerm}&sort=${sortOrder}`)
            .then((response) => {
                setInventory(response?.data?.rows);
                setTotal(response?.data?.total);
            })
    }, [store.id_tienda, page, limit, searchTerm, sortOrder])

    return (
        <ModuleLayout
            moduleInfo={moduleInfo}
        >
            <TableControls 
                onSearch={(value) => setSearchTerm(value)}
                onSort={(order) => setSortOrder(order)}
                useSearch={true}
                useSort={true}
                ExcelModule={'inventory'}
                ExcelName={'Inventario'}
                route={'inventory/getInventory'}
                onLimitChange={(newLimit) => setLimit(newLimit)}
            />
            <Table
            columns={columns}
            data={inventory}
            expandable
            renderExpandedRow={(row) => (
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 items-center">
                    <p><strong>Proveedor:</strong> {row.proveedor || "Sin proveedor"}</p>
                    <p><strong>Precio compra:</strong> {row.precio_compra} C$</p>
                    <p><strong>Precio venta:</strong> {row.precio_venta} C$ </p>
                    <p><strong>Stock mínimo:</strong> {row.stock_minimo}</p>
                    <p><strong>Porcentaje de ganancia:</strong> {row.porcentaje_ganancia}%</p>
                </div>
            )}
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