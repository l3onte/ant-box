import { useEffect, useState } from "react"
import { useStore } from "../../services/storeContext"
import API from '../../services/API.js'
import ModuleLayout from "../../components/layout-components/ModuleLayout"
import Table from "../../components/layout-components/Table.jsx"
import { Trash2, Edit } from 'lucide-react'
import Pagination from "../../components/layout-components/table-components/Pagination.jsx"
import TableControls from "../../components/layout-components/table-components/TableControls.jsx"
import Swal from 'sweetalert2'
import FormVendedor from "../../components/forms/FormVendedor.jsx"
import Modal from "../../components/Modal.jsx"

export default function Vendedores() {
    const moduleInfo = {
        title: 'Vendedores',
        route: 'Menu Principal / Vendedores',
        buttonName: 'Nuevo Vendedor',
        buttonType: 'submit',
        buttonVariant: 'add'
    }

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [sellersData, setSellersData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isEditModalOpen, setEditModal] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar vendedor?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await API.delete(`/ant-box/sellers/deleteSeller/${id}`);

                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El vendedor ha sido eliminado correctamente.',
                    timer: 1500,
                    showConfirmButton: false
                });

                setSellersData(prev => prev.filter(seller => seller.id !== id));
                setTotal(total - 1);
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar el vendedor.'
                });
            }
        }
    }

    const handleEdit = (seller) => {
        setSelectedSeller(seller);
        setEditModal(true);
    }

    const columns = [
        { header: 'id', accessor: 'id' },
        { header: 'Vendedor', accessor: 'Vendedor' },
        { header: 'Username', accessor: 'Username' },
        { header: 'Correo', accessor: 'Correo' },
        { header: 'Rol', accessor: 'Rol' },
        {
            header: '',
            accessor: 'actions',
            Cell: (row) => (
                <div className="flex gap-2">
                    <button
                        className="p-1 text-gray-700 rounded cursor-pointer hover:text-gray-500"
                        onClick={() => handleDelete(row.id)}
                    >
                        <Trash2 size={16} />
                    </button>
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

    const { store } = useStore();

    useEffect(() => {
        API.get(`/ant-box/sellers/getSellers/${store.id_tienda}?page=${page}&limit=${limit}&search=${searchTerm}`)
            .then((response) => {
                setSellersData(response.data.rows);
                setTotal(response.data.total);
            })
            .catch(error => console.error(error));
    }, [store.id_tienda, page, limit, refresh, searchTerm])

    return (
        <ModuleLayout 
            moduleInfo={moduleInfo}
            modalContent={({ closeModal }) => (
                <FormVendedor 
                    onClose={closeModal}  
                    onSuccess={() => setRefresh(prev => !prev)}
                />
            )}
        >
            <TableControls 
                onSearch={(value) => setSearchTerm(value)}
                useSearch={true}
                useSort={true}
                ExcelModule={'sellers'}
                ExcelName={'Vendedores'}
                route={'sellers/getSellers'}
                onLimitChange={(newLimit) => setLimit(newLimit)}
            />
            <Table 
                columns={columns} 
                data={sellersData} 
            />
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
                    <FormVendedor 
                        onClose={() => setEditModal(false)}
                        onSuccess={() => {
                            setEditModal(false);
                            setRefresh(prev => !prev);
                        }}
                        sellerData={selectedSeller}
                        isEditing={true}
                    />
                </Modal>
            )}
        </ModuleLayout>
    )
}