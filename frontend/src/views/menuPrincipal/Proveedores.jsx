import { useEffect, useState } from "react"
import { useStore } from "../../services/storeContext";
import API from "../../services/API";
import ModuleLayout from "../../components/layout-components/ModuleLayout"
import Table from "../../components/layout-components/Table";
import TableControls from "../../components/layout-components/table-components/TableControls";
import Pagination from "../../components/layout-components/table-components/Pagination";
import FormProveedor from '../../components/forms/FormProveedor';
import { Edit } from "lucide-react";
import Modal from "../../components/Modal";

export default function Productos() {
    const { store } = useStore();
    const [suppliersData, setSuppliersData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(6);
    const [total, setTotal] = useState(0);
    const [isEditModalOpen, setEditModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const moduleInfo = {
        title: 'Proveedores',
        route: 'Menu Principal / Proveedores',
        buttonName: 'Nuevo Proveedor',
        buttonType: 'submit',
        buttonVariant: 'add'
    }

    useEffect(() => {
        API.get(`/ant-box/suppliers/getSuppliers/${store.id_tienda}?page=${page}&limit=${limit}&search=${searchTerm}`)
            .then((response) => {
                setSuppliersData(response.data.result);
                setTotal(response.data.total);
            })
            .catch(error => console.error(error.message));
    }, [store.id_tienda, page, refresh, searchTerm]);

    const handleEdit = (supplier) => {
        setSelectedSupplier(supplier);
        setEditModal(true);
    }

    const columns = [
        { header: 'id_proveedor', accessor: 'id_proveedor' },
        { header: 'nombre', accessor: 'nombre' },
        { header: 'direccion', accessor: 'direccion' },
        { header: 'telefono', accessor: 'telefono' },
        { header: 'email', accessor: 'email' },
        { 
            header: 'estado', 
            accessor: 'status', 
            Cell: (row) => (
                <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                        row.status === 'Activo'
                            ? `bg-green-100 text-green-700`
                            : `bg-red-100 text-red-700`
                    }`}
                >
                    {row.status}
                </span>
            )
        },
        {
            header: '',
            accessor: 'actions',
            Cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-1 text-gray-700 rounded cursor-pointer hover:text-gray-500"
                    >
                        <Edit size={16} />
                    </button>
                </div>
            )
        }
    ]



    return (
        <ModuleLayout 
            moduleInfo={moduleInfo}
            modalContent={({ closeModal }) => (
                <FormProveedor 
                    onClose={closeModal}
                    onSuccess={() => setRefresh(prev => !prev)}
                />
            )}
        >
            <TableControls 
                onSearch={(value) => setSearchTerm(value)}
            />
            <Table columns={columns} data={suppliersData}/>
            <Pagination 
                page={page} 
                limit={limit} 
                total={total}
                onPageChange={(newPage) => setPage(newPage)}     
            />

            {isEditModalOpen && (
                <Modal
                    onClose={() => setEditModal(false)}
                    modalTitle={"Editar Vendedor"}
                >
                    <FormProveedor
                        onClose={() => setEditModal(false)}
                        onSuccess={() => {
                            setEditModal(false);
                            setRefresh(prev => !prev);
                        }}
                        supplierDataEdit={selectedSupplier}
                        isEditing={isEditModalOpen}
                    />
                </Modal>
            )}
        </ModuleLayout>
    )
}