import { useState, useEffect } from "react";
import ModuleLayout from "../../components/layout-components/ModuleLayout";
import Table from '../../components/layout-components/Table';
import Pagination from "../../components/layout-components/table-components/Pagination";
import Search from "../../components/layout-components/table-components/Search";
import FilterButton from "../../components/layout-components/table-components/FilterButton";
import SortButton from "../../components/layout-components/table-components/SortButton";
import API from "../../services/API";
import { useStore } from "../../services/storeContext";
import { Edit } from 'lucide-react';

export default function Ventas() {
    const { store } = useStore();
    const [page, setPage] = useState(1);
    const [limit] = useState(3);
    const [total, setTotal] = useState(0);
    const [sale, setSale] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);

    const moduleInfo = {
        title: 'Ventas',
        route: 'Reportes / Ventas',
        buttonName: 'Nueva Venta',
        buttonType: 'submit',
        buttonVariant: 'add'
    }

    const columns = [
        { header: 'id', accessor: 'id_venta' },
        { header: 'fecha', accessor: 'Fecha' },
        { header: 'cliente', accessor: 'Cliente' },
        { header: 'producto', accessor: 'Producto' },
        { header: 'descripción', accessor: 'Descripcion' },
        { header: 'cantidad', accessor: 'Cantidad' }, 
        { 
            header: 'p/u', 
            accessor: 'Precio_Unitario',
            Cell: (row) => (
                <div className="flex gap-1">
                    <span>{row.Precio_Unitario}</span>
                    {store.moneda === 'NIO' ? 'C$' : '$'}
                </div>
            )
        },
        { 
            header: 'total', 
            accessor: 'Total', 
            Cell: (row) => (
                <div className="flex gap-1">
                    <span>{row.Total}</span> 
                    {store.moneda === 'NIO' ? 'C$' : '$'}
                </div>
            )
        },
        { 
            header: '',
            accessor: 'actions',
            Cell: (row) => (
                <div className="flex gap-2">
                    <button className="p-1 text-gray-700 rounded cursor-pointer hover:text-gray-500">
                        <Edit size={16} />
                    </button>
                </div>
            )
         }
    ]

    useEffect(() => {
        API.get(`/ant-box/sales/getSales/${store.id_tienda}?page=${page}&limit=${limit}`)
            .then((response) => {
                setSale(response?.data?.rows);
                setTotal(response?.data?.total);
            })
            .catch(error => console.error(error));
    }, [store.id_tienda, page, refresh])

    return (
        <ModuleLayout 
            moduleInfo={moduleInfo}
            
        >
            <div className="flex w-full justify-between">
                <Search />
                <div className="flex gap-2">
                    <FilterButton />
                    <SortButton />
                </div>
            </div>
            <Table columns={columns} data={sale}/>
            <Pagination 
                page={page} 
                limit={limit} 
                total={total} 
                onPageChange={(newPage) => setPage(newPage)}    
            />
        </ModuleLayout>
    )
}