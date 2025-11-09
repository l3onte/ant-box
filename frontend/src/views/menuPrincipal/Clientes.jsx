import ModuleLayout from "../../components/layout-components/ModuleLayout"
import Table from "../../components/layout-components/Table"
import Pagination from "../../components/layout-components/table-components/Pagination"
import TableControls from "../../components/layout-components/table-components/TableControls"
import { useStore } from "../../services/storeContext"
import { useState, useEffect } from "react"
import API from "../../services/API"
import { Edit } from "lucide-react"
import Modal from "../../components/Modal" 
import FormClientes from "../../components/forms/FormClientes"

export default function Clientes() {
    const moduleInfo = {
        title: 'Clientes',
        route: 'Menu Principal / Clientes',
    }

    const { store } = useStore();
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [customers, setCustomers] = useState([]);
    const [refresh, setRefresh] = useState(false);    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSerchTerm] = useState('');

    const columns = [
        { header: 'id', accessor: 'id_cliente' },
        { header: 'cliente', accessor: 'nombre' },
        { header: 'dirección', accessor: 'direccion' },
        { header: 'telefono', accessor: 'telefono' },
        { header: 'correo', accessor: 'email' },
        {  
            header: '',
            accessor: 'actions',
            Cell: (row) => (
                <button 
                    onClick={() => handleEdit(row)}
                    className="text-gray-700 rounded cursor-pointer hover:text-gray-500"
                >
                    <Edit size={16} />
                </button>
            )
        }
    ]

    useEffect(() => {
        API.get(`/ant-box/customers/getCustomers/${store.id_tienda}?page=${page}&limit=${limit}&search=${searchTerm}`)
            .then((response) => {
                setCustomers(response?.data?.rows);
                setTotal(response?.data?.total);
            })
            .catch(error => console.error(error));
    }, [store.id_tienda, page, refresh, searchTerm]);

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setIsEditModalOpen(true);
    }

    return (
        <ModuleLayout 
            moduleInfo={moduleInfo}
        >
            <TableControls 
                onSearch={(value) => setSerchTerm(value)}
                useSearch={true}
                useSort={true}
                ExcelModule={'customers'}
                ExcelName={'Clientes'}
            />
            <Table 
                columns={columns}
                data={customers}
            />
            <Pagination 
                page={page}
                limit={limit}
                total={total}
                onPageChange={(newPage) => setPage(newPage)}
            />

            
            {isEditModalOpen && (
                <Modal
                    onClose={() => setIsEditModalOpen(false)}
                    modalTitle={"Editar Vendedor"}
                >
                    <FormClientes 
                        onClose={() => setIsEditModalOpen(false)}
                        onSuccess={() => {
                            setIsEditModalOpen(false);
                            setRefresh(prev => !prev);
                        }}
                        customerData={selectedCustomer}
                    />
                </Modal>
            )}
        </ModuleLayout>
    )
    
}