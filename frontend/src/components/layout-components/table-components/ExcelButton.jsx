import { FileSpreadsheet } from 'lucide-react';
import { useStore } from "../../../services/storeContext";
import API from '../../../services/API';
import Swal from 'sweetalert2';

export default function ExcelButton({ module, name }) {
    const { store } = useStore();

    const handleExport = async () => {
        try {
            const response = await API.get(`/ant-box/${module}/export/${store.id_tienda}`, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${name}_${new Date().toISOString().split('T')[0]}.xlsx`); // nombre dinámico
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            Swal.fire({
                icon: 'success',
                title: 'Excel generado correctamente!',
                showConfirmButton: false,
                timer: 2000
            });

        } catch (error) {
            console.error("Error al descargar Excel.", error);
            Swal.fire({
                title: 'Error al descargar Excel!',
                icon: 'error',
                text: error.message,
                timer: 2000
            })
        }
    }

    return (
        <button 
            onClick={handleExport}
            className='flex items-center gap-1 text-black border border-gray-300 bg-gray-50 px-4 rounded shadow-sm cursor-pointer hover:bg-white'
        >
            <FileSpreadsheet className='w-4'/>
            Generar Excel
        </button>
    )
}