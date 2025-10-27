import { ListFilter } from "lucide-react"

export default function FilterButton() {
    return (
        <button className="flex border gap-1 text-black border-gray-300 bg-gray-50 px-4 rounded shadow-sm cursor-pointer hover:bg-white">
            <ListFilter className="w-3"/>
            Filter
        </button>
    )
}