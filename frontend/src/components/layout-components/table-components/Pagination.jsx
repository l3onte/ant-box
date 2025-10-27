export default function Pagination({ page = 1, limit, total, onPageChange }) {
    const totalPage = Math.ceil(total / limit);
    
    return (
        <div className="flex items-center gap-2">
            <button 
                className="bg-gray-200 px-3 py-1 rounded text-sm cursor-pointer hover:bg-gray-100 transform transition duration-300"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
            >
                Anterior
            </button>

            <span className="text-[10px] text-gray-400">
                Pagina {page} de {totalPage || 1}
            </span>

            <button 
                className="bg-gray-200 px-3 py-1 rounded text-sm cursor-pointer hover:bg-gray-100 transform transition duration-300"
                disabled={page >= totalPage}
                onClick={() => onPageChange(page + 1)}
            >
                Siguiente
            </button>
        </div>
    )
}