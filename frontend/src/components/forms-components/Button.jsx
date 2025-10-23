export default function Button({ name, type }) {

    const buttonTypes = {
        login: "bg-sky-400 text-white text-xl font-bold hover:bg-sky-300 transition transform duration-300",
        signup: "bg-red-400 text-white text-xl font-bold hover:bg-red-300 transition transform duration-300"
    }
    
    return (
        <button className={`cursor-pointer p-2 rounded shadow-md ${buttonTypes[type]}`}>
            {name}
        </button>
    )
}