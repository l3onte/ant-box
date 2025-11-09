import ModuleLayout from "../../components/layout-components/ModuleLayout";
import TableControls from "../../components/layout-components/table-components/TableControls";
import Pagination from "../../components/layout-components/table-components/Pagination";
import Table from "../../components/layout-components/Table.jsx";
import { useState, useEffect } from "react";
import { useStore } from "../../services/storeContext.jsx";
import API from "../../services/API.js";
import { Trash2, Edit } from 'lucide-react'
import FormProductos from "../../components/forms/FormProductos.jsx";
import Modal from "../../components/Modal.jsx";

export default function Productos() {
    const { store } = useStore();

    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [total, setTotal] = useState(0);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [isEditModalOpen, setEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const moduleInfo = {
        title: 'Productos',
        route: 'Menu Principal / Productos'
    }

    {/*    
        const handleDelete = async (id_producto) => {
            const result = await Swal.fire({
                title: '¿Eliminar producto?',
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
                    await API.delete(`/ant-box/products/deleteProduct/${id_producto}`);
    
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: 'El producto ha sido eliminado correctamente.',
                        timer: 1500,
                        showConfirmButton: false
                    });
    
                    setProducts(prev => prev.filter(product => product.id_producto !== id_producto));
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
    */}

    const columns = [
        { header: 'id', accessor: 'id_producto' },
        { header: 'proveedor', accessor: 'proveedor' },
        { header: 'producto', accessor: 'nombre' },
        { header: 'descripcion', accessor: 'descripcion' },
        { 
            header: 'precio de compra', 
            accessor: 'precio_compra',
            Cell: (row) => (
                <div>
                    {row.precio_compra} 
                    <span>{store.moneda === 'NIO' ? 'C$' : '$'}</span>
                </div>
            )
        },
        { 
            header: '%. ganancia',
            accessor: 'porcentaje_ganancia',
            Cell: (row) => (
                <div>
                    {row.porcentaje_ganancia}%
                </div>
            )
        },
        { 
            header: 'precio venta',
            accessor: 'precio_venta',
            Cell: (row) => (
                <div>
                    {row.precio_venta}
                    <span>{store.moneda === 'NIO' ? 'C$' : '$'}</span>
                </div>
            )
        },
        {
            header: '',
            accessor: 'actions',
            Cell: (row) => (
                <div className="flex gap-2">
                    {/*                     
                        <button
                            className="p-1 text-gray-700 rounded cursor-pointer hover:text-gray-500"
                            onClick={() => handleDelete(row.id_producto)}
                        >
                            <Trash2 size={16} />
                        </button>
                    */}
                    <button
                        className="p-1 text-gray-700 rounded cursor-pointer hover:text-gray-500"
                        onClick={() => handleEdit(row)}
                    >
                        <Edit size={16} />
                    </button>
                </div>
            )
        }
    ]

    useEffect(() => {
        API.get(`/ant-box/products/getProducts/${store.id_tienda}?page=${page}&limit=${limit}&search=${search}`)
            .then((response) => {
                setProducts(response?.data?.rows);
                setTotal(response?.data?.total)
            })
            .catch(error => console.error(error));
    }, [store.id_tienda, page, limit, search, refresh]);

    
    const handleEdit = (product) => {
        setSelectedProduct(product);
        setEditModal(true);
    }

    return (
        <ModuleLayout 
            moduleInfo={moduleInfo}
            modalContent={({ closeModal }) => (
                <FormProductos 
                    onClose={closeModal}
                    onSuccess={() => setRefresh(prev => !prev)}
                />
            )}
        >
            <TableControls 
                useSearch={true}
                useSort={true}
                ExcelModule={'products'}
                ExcelName={'Productos'}
            />
            <Table 
                columns={columns}
                data={products}
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
                    modalTitle={"Editar Producto"}
                >
                    <FormProductos
                        onClose={() => setEditModal(false)}
                        onSuccess={() => {
                            setEditModal(false);
                            setRefresh(prev => !prev);
                        }}
                        productDataEdit={selectedProduct}
                        isEditing={isEditModalOpen}
                    />
                </Modal>
            )}
        </ModuleLayout>
    )
}