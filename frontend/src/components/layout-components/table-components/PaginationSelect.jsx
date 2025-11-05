export default function PaginationSelect() {
    return (
        <label className="flex gap-1 items-center">
            <span className="text-sm">Cant. Paginas</span>
            <select className="flex items-center gap-1 text-black border border-gray-300 bg-gray-50 px-1 rounded shadow-sm cursor-pointer hover:bg-white">  
                <option value="">1</option>
            </select>
        </label>
    )
}