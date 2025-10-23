import { useState } from "react"
import { EyeClosed, Eye } from "lucide-react"

export default function Input({ type, placeholder }) {
    const [isEyeOpen, setIsEyeOpen] = useState(false);

    const toggleEye = () => setIsEyeOpen(!isEyeOpen);
    const currentType = isEyeOpen ? "text" : "password";

    const baseStyle = "bg-gray-100/70 w-70 shadow-sm placeholder-gray-500 px-4 py-2 rounded transition";

    return (
        <div className="relative">
            {type === "text" ? (

                <input 
                    className={baseStyle}
                    type={type}
                    placeholder={placeholder} 
                />

            ) : (

                <>
                    <input 
                        className={baseStyle}
                        type={currentType}
                        placeholder={placeholder} 
                    />
                    
                    <div className="absolute right-2 top-2 cursor-pointer"> 
                        {isEyeOpen ? (
                            <Eye onClick={toggleEye}/>
                        ) : (
                            <EyeClosed onClick={toggleEye}/>
                        )}
                    </div>
                </>
                
            )}
        </div>
    )
}