import { useState, useEffect } from "react";
import { useStore } from "../../../services/storeContext";
import API from "../../../services/API.js";

export default function PaginationSelect({ route, onChange }) {
    const { store } = useStore();
    const [cantFilas, setCantFilas] = useState(0);
    const [selectedLimit, setSelecteLimit] = useState(5);

    useEffect(() => {
        API.get(`/ant-box/${route}/${store.id_tienda}`)
            .then((response) => setCantFilas(response?.data?.total || 0))
            .catch(error => console.error(error));
    }, [store.id_tienda, route]);

    const handleChange = (e) => {
        const newLimit = parseInt(e.target.value);
        setSelecteLimit(newLimit);
        if (onChange) onChange(newLimit);
    }

    return (
        <label className="flex gap-1 items-center">
            <span className="text-sm">Cant. Filas</span>
            <select 
                value={selectedLimit}
                onChange={handleChange}
                className="flex items-center gap-1 text-black border border-gray-300 bg-gray-50 px-1 rounded shadow-sm cursor-pointer hover:bg-white"
            >  
                {[5, 10, 20, 50, 100].map((num) => (
                    <option key={num} value={num}>
                        {num}
                    </option>
                ))}
            </select>
        </label>
    )
}