import { useEffect, useState, useRef } from "react";
import { Trash2, Edit, Delete, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../../../services/API";
import Swal from "sweetalert2";

export default function ExpandedSaleDetails({ id_venta, fetchSaleDetails }) {
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef(null);

    useEffect(() => {
        const load = async () => {
        const data = await fetchSaleDetails(id_venta);
        setDetails(data);
        setLoading(false);
        };
        load();
    }, [id_venta]);

    if (loading) return <p className="text-gray-500 text-sm">Cargando detalles...</p>;
    
    if (details.length === 0)
        return <p className="text-gray-500 text-sm">Sin detalles para esta venta.</p>;

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
                title: '¿Eliminar venta completa?',
                text: 'Este es el último producto. Si lo eliminas, se eliminará también la venta.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                try {
                    API.delete(`/ant-box/sales/deleteSale/${id_venta}`);
        
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: 'La venta se ha eliminado correctamente.',
                        timer: 1500,
                        showConfirmButton: false
                    })
                } catch (error) {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo eliminar el producto de la venta.'
                    });
                }
            }

            return;
        }

        const result = await Swal.fire({
            title: '¿Eliminar producto de la venta?',
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
                await API.delete(`/ant-box/sales/deleteDetail/${id_detalle}`);

                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El producto se elimino de la venta correctamente.',
                    timer: 1500,
                    showConfirmButton: false 
                })

                setDetails(prev => prev.filter(detail => detail.id !== id_detalle));
                
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar el producto de la venta.'
                });
            }
        }

    }

    const handleDeleteSale = async (id_venta) => {
        const result = await Swal.fire({
            title: '¿Eliminar venta?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        })

        if (result.isConfirmed)
            try {
                await API.delete(`/ant-box/sales/deleteSale/${id_venta}`);

                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'La venta se elimino correctamente.',
                    timer: 1500,
                    showConfirmButton: false 
                })
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar la venta.'
                })
            }
    }

    return (
        <div className="relative flex items-center justify-center flex-col">
            <div className="relative w-full flex flex-col items-center justify-center mb-3">
                <h3 className="text-md font-semibold text-gray-700">Detalles de la venta</h3>
                <button onClick={() => handleDeleteSale(id_venta)} className="absolute right-0 top-0 flex items-center group cursor-pointer">
                    <span className="text-red-600 text-sm opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-2">
                        Eliminar venta
                    </span>
                    <Delete className="text-red-600 size-5 transform transition-all duration-300  group-hover:-translate-x-1.5"/>
                </button>
            </div>

            <div className="relative w-full max-w-6xl flex justify-center itmes-center"> 
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
                    {details.map((d) => (
                        <div
                            key={d.id}
                            className="shrink-0 w-100 snap-center border border-gray-300 bg-gray-50 rounded-md p-3 shadow-sm"
                            >
                            <div className="flex justify-end gap-2 mb-2">
                                <button onClick={() => handleDelete(d.id)}>
                                <Trash2 className="size-4 text-red-500 hover:text-gray-500 cursor-pointer transform transition duration-300" />
                                </button>
                            </div>

                            <div>
                                <p><strong>Producto:</strong> {d.P_Nombre}</p>
                                <p><strong>Descripción:</strong> {d.Descripcion}</p>
                                <p><strong>Cantidad:</strong> {d.Cantidad}</p>
                                <p><strong>Precio:</strong> {d.Precio_Unitario} C$</p>
                                <p><strong>Subtotal:</strong> {d.Total_Individual} C$</p>
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
