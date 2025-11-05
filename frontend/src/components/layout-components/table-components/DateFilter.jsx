export default function DateFilter({ name, onClick }) {
    return (
        <button
            onClick={onClick}
            className="text-left text-black py-1 px-3 cursor-pointer rounded hover:bg-red-100"
        >
            {name}
        </button>
    )
}