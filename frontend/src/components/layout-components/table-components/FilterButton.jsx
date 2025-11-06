import { ListFilter } from "lucide-react"
import { useState } from "react"
import RangePicker from "./RangePicker";

export default function FilterButton({ onDateRangeChange }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button 
                onClick={() => setOpen(!open)}
                className="flex border gap-1 text-black border-gray-300 bg-gray-50 px-4 rounded shadow-sm cursor-pointer hover:bg-white">
                <ListFilter className="w-3"/>
                Filter
            </button>

            {open && (
                <RangePicker onDateRangeChange={onDateRangeChange}/>
            )}
        </div>
    )
}