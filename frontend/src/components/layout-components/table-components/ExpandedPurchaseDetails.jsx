import { useEffect, useState, useRef } from "react";
import { Trash2, Delete, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../../../services/API";
import Swal from "sweetalert2";
import { useStore } from "../../../services/storeContext";

export default function ExpandedPurchaseDetails({ id_compra, fetchPurchaseDetails }) {
    const { store } = useStore();
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            const data = await fetchPurchaseDetails(id_compra);
            setDetails(data);
            setLoading(false);
        };
        load();
    }, [id_compra]);

    if (loading) return <p className="text-gray-500 text-sm">Cargando detalles...</p>;
    
    if (details.length === 0)
        return <p className="text-gray-500 text-sm">Sin detalles para esta compra.</p>;

    const scroll = (direction) => {
        const container = carouselRef.current;
        if (!container) return;

        const scrollAmount = 300;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    }
    
    const handleDelete = async (id_detalle) => {
        if (details.length === 1) {
            const result = await Swal.fire({
                title: '¿Eliminar compra completa?',
                text: 'Este es el último producto. Si lo eliminas, se eliminará también la compra.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                try {
                    await API.delete(`/ant-box/purchases/deletePurchase/${id_compra}`);
        
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: 'La compra se ha eliminado correctamente.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    
                    // Recargar la página o actualizar el estado
                    window.location.reload();
                } catch (error) {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo eliminar el producto de la compra.'
                    });
                }
            }
            return;
        }

        const result = await Swal.fire({
            title: '¿Eliminar producto de la compra?',
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
                // Nota: Necesitarías crear un endpoint para eliminar detalles individuales de compras
                // Por ahora, eliminamos la compra completa si hay un solo producto
                // o implementamos lógica similar a ventas
                
                Swal.fire({
                    icon: 'info',
                    title: 'Funcionalidad en desarrollo',
                    text: 'La eliminación individual de productos de compras estará disponible pronto.',
                    timer: 2000,
                    showConfirmButton: false 
                });

                // Para implementación futura:
                // await API.delete(`/ant-box/purchases/deleteDetail/${id_detalle}`);
                // setDetails(prev => prev.filter(detail => detail.id_detalle_compra !== id_detalle));
                
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar el producto de la compra.'
                });
            }
        }
    }

    const handleDeletePurchase = async (id_compra) => {
        const result = await Swal.fire({
            title: '¿Eliminar compra?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        })

        if (result.isConfirmed) {
            try {
                await API.delete(`/ant-box/purchases/deletePurchase/${id_compra}`);

                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'La compra se eliminó correctamente.',
                    timer: 1500,
                    showConfirmButton: false 
                });
                
                // Recargar la página o actualizar el estado
                window.location.reload();
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar la compra.'
                });
            }
        }
    }

    return (
        <div className="relative flex items-center justify-center flex-col">
            <div className="relative w-full flex flex-col items-center justify-center mb-3">
                <h3 className="text-md font-semibold text-gray-700">Detalles de la compra</h3>
                <button onClick={() => handleDeletePurchase(id_compra)} className="absolute right-0 top-0 flex items-center group cursor-pointer">
                    <span className="text-red-600 text-sm opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-2">
                        Eliminar compra
                    </span>
                    <Delete className="text-red-600 size-5 transform transition-all duration-300  group-hover:-translate-x-1.5"/>
                </button>
            </div>

            <div className="relative w-full max-w-6xl flex justify-center items-center"> 
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-gray-100 transition cursor-pointer"
                >
                    <ChevronLeft className="size-5 text-gray-700"/>
                </button>

                <div
                    ref={carouselRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth px-12 scrollbar-hide snap-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {details.map((d, index) => (
                        <div
                            key={index}
                            className="shrink-0 w-80 snap-center border border-gray-300 bg-gray-50 rounded-md p-3 shadow-sm"
                        >
                            <div className="flex justify-end gap-2 mb-2">
                                <button onClick={() => handleDelete(d.id_detalle_compra)}>
                                    <Trash2 className="size-4 text-red-500 hover:text-gray-500 cursor-pointer transform transition duration-300" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <p><strong>Producto:</strong> {d.producto}</p>
                                <p><strong>Cantidad:</strong> {d.cantidad}</p>
                                <p><strong>Precio Compra:</strong> {store.moneda === 'NIO' ? 'C$' : '$'}{d.precio_compra}</p>
                                <p><strong>Subtotal:</strong> {store.moneda === 'NIO' ? 'C$' : '$'}{d.subtotal || (d.cantidad * d.precio_compra).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-gray-100 transition cursor-pointer"
                >
                    <ChevronRight className="size-5 text-gray-700"/>
                </button>
            </div>
        </div>
    );
}