import { useState, useEffect, useEffectEvent } from "react";
import ModuleLayout from "../../components/layout-components/ModuleLayout";
import Table from '../../components/layout-components/Table';
import Pagination from "../../components/layout-components/table-components/Pagination";
import TableControls from "../../components/layout-components/table-components/TableControls";
import API from "../../services/API";
import { useStore } from "../../services/storeContext";
import { ChevronDown } from 'lucide-react';
import FormVentas from "../../components/forms/FormVentas";
import ExpandedSaleDetails from "../../components/layout-components/table-components/ExpandedSaleDetails";

export default function Ventas() {
    const { store } = useStore();
    const [page, setPage] = useState(1);
    const [limit] = useState(4);
    const [total, setTotal] = useState(0);
    const [sale, setSale] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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
        { header: 'total de productos', accessor: 'Cantidad_de_Productos' },
        { 
            header: 'total', 
            accessor: 'Total_Venta', 
            Cell: (row) => (
                <div className="flex gap-1">
                    <span>{row.Total_Venta}</span> 
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
                        <ChevronDown size={16}/>
                    </button>
                </div>
            )
         }
    ]

    useEffect(() => {
        API.get(`/ant-box/sales/getSales/${store.id_tienda}?page=${page}&limit=${limit}&search=${searchTerm}&startDate=${startDate}&endDate=${endDate}`)
            .then((response) => {
                setSale(response?.data?.rows);
                setTotal(response?.data?.totalCount);
            })
            .catch(error => console.error(error));
    }, [store.id_tienda, page, refresh, searchTerm, startDate, endDate])

    const fetchSaleDetails = async (id_venta) => {
        try {
            const response = await API.get(`/ant-box/sales/getSaleDetails/${id_venta}`);
            return response?.data?.details || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    return (
        <ModuleLayout 
            moduleInfo={moduleInfo}
            modalContent={({ closeModal }) => (
                <FormVentas
                    onClose={closeModal}  
                    onSuccess={() => setRefresh(prev => !prev)}
                />
            )}
        >
            <TableControls 
                onSearch={(value) => setSearchTerm(value)}
                onDateRangeChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                }}
                useSearch={true}
                useSort={true}
                useFilter={true}
            />
            <Table 
                columns={columns} 
                data={sale}
                expandable
                renderExpandedRow={(row) => (
                    <ExpandedSaleDetails 
                        id_venta={row.id_venta}
                        fetchSaleDetails={fetchSaleDetails}
                    />
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