export default function QuicklyFilter({ name, onClick }) {
    return (
        <button 
            onClick={onClick}
            className="cursor-pointer hover:bg-red-100 transition transform duration-300 rounded py-2"
        >
            {name}
        </button>
    )
}