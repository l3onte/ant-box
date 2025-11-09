import ModuleLayout from "../../components/layout-components/ModuleLayout";
import TableControls from "../../components/layout-components/table-components/TableControls";
import Pagination from "../../components/layout-components/table-components/Pagination";
import Table from "../../components/layout-components/Table.jsx";
import { useEffect, useState } from "react";
import API from "../../services/API.js";
import { useStore } from "../../services/storeContext.jsx";
import { Edit, Trash2 } from "lucide-react";
import FormCompras from "../../components/forms/FormCompras.jsx";
import Modal from "../../components/Modal.jsx";
import Swal from "sweetalert2";

export default function Compras() {
    const { store } = useStore();
    const [purchases, setPurchases] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [total, setTotal] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [isEditModalOpen, setEditModal] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    const moduleInfo = {
        title: 'Compras',
        route: 'Reportes / Compras',
        buttonName: 'Nueva Compra',
        buttonType: 'submit',
        buttonVariant: 'add'
    }

    const handleDelete = async (id_compra) => {
        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará la compra de forma permanente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (confirm.isConfirmed) {
            try {
                await API.delete(`/ant-box/purchases/deletePurchase/${id_compra}`);
                
                Swal.fire({
                    icon: "success",
                    title: "Eliminado",
                    text: "La compra se eliminó correctamente.",
                    timer: 1500,
                    showConfirmButton: false
                });

                setRefresh(prev => !prev);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error al eliminar",
                    text: error.response?.data?.message || "Error del servidor"
                });
            }
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id_compra' },
        { header: 'Fecha de Compra', accessor: 'fecha_compra' },
        { header: 'Proveedor', accessor: 'proveedor' },
        { header: 'Producto', accessor: 'producto' },
        { header: 'Cantidad', accessor: 'cantidad' },
        { 
            header: 'Precio de Compra', 
            accessor: 'precio_compra',
            Cell: (row) => (
                <div>
                    <span>{store.moneda === 'NIO' ? 'C$' : '$'}</span>
                    <span>{row.precio_compra}</span> 
                </div>
            )
        },
        { 
            header: 'Total', 
            accessor: 'total',
            Cell: (row) => (
                <div>
                    <span>{store.moneda === 'NIO' ? 'C$' : '$'}</span>
                    <span>{row.total}</span>
                </div>
            ) 
        },
        {
            header: '',
            accessor: 'actions',
            Cell: (row) => (
                <div className="flex gap-2">
                    <button
                        className="p-1 text-gray-700 rounded cursor-pointer hover:text-gray-500"
                        onClick={() => handleDelete(row.id_compra)}
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        className="p-1 text-gray-700 rounded cursor-pointer hover:text-gray-500"
                        onClick={() => {
                            setSelectedPurchase(row);
                            setEditModal(true);
                        }}
                    >
                        <Edit size={16} />
                    </button>
                </div>
            )
        }
    ];

    useEffect(() => {
        API.get(`/ant-box/purchases/getPurchases/${store.id_tienda}?page=${page}&limit=${limit}`)
            .then((response) => {
                setPurchases(response?.data?.rows);
                setTotal(response?.data?.total);
            })
            .catch(error => console.error(error)); 
    }, [store.id_tienda, page, refresh]);

    return (
        <ModuleLayout 
            moduleInfo={moduleInfo}
            modalContent={({ closeModal }) => (
                <FormCompras
                    onClose={closeModal}  
                    onSuccess={() => setRefresh(prev => !prev)}
                />
            )}    
        >
            <TableControls 
                useSearch={true} 
                useSort={true} 
                useFilter={true}
                ExcelModule={'purchases'}
                ExcelName={'Compras'}
            />
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

            {isEditModalOpen && (
                <Modal 
                    onClose={() => setEditModal(false)}
                    modalTitle={"Editar Compra"}
                >
                    <FormCompras
                        onClose={() => setEditModal(false)}  
                        onSuccess={() => {
                            setEditModal(false);
                            setRefresh(prev => !prev);
                        }}
                        purchaseData={selectedPurchase}
                        isEditing={true}
                    />
                </Modal>
            )}
        </ModuleLayout>
    )
}
