import { useEffect, useState } from "react";
import { Trash2, Edit } from "lucide-react";

export default function ExpandedSaleDetails({ id_venta, fetchSaleDetails }) {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="grid grid-cols-4 gap-4">
      {details.map((d, index) => (
        <div key={index} className="flex flex-col gap-1 shadow-sm border border-gray-300 bg-gray-50 rounded p-2">
            <div className="flex justify-end gap-2">
                <Trash2 className="size-4 hover:text-gray-500 cursor-pointer transform transition duration-300"/>
                <Edit className="size-4 hover:text-gray-500 cursor-pointer transform transition duration-300"/>
            </div>

            <div>
                <p><strong>Producto:</strong> {d.P_Nombre}</p>
                <p><strong>Descripción:</strong> {d.Descripcion} </p>
                <p><strong>Cantidad:</strong> {d.Cantidad}</p>
                <p><strong>Precio:</strong> {d.Precio_Unitario} C$</p>
                <p><strong>Subtotal:</strong> {d.Total_Individual} C$</p>
            </div>

        </div>
      ))}
    </div>
  );
}
