import { useState } from "react"

export default function SwitchButton() {
    const [on, setOn] = useState(false);

    const handleDarkMode = () => setOn(!on);

    return (
        <div
            onClick={handleDarkMode} 
            className="w-10 h-6 flex items-center rounded-full p-1 cursor-pointer bg-gray-400"
        >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${on ? 'translate-x-4' : ''}`} />
        </div>        
    )
}