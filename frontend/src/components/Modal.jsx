import Button from "./forms-components/Button"

export default function Modal({ modalTitle , children, onClose }) {
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
            <div className="bg-white rounded shadow-md p-6 w-[400px] relative">
                <button
                    className="hover:text-red-700 cursor-pointer"
                    onClick={onClose}
                >
                    ✕
                </button>

                <div className="flex flex-col gap-5 items-center">
                    <span className="text-2xl">{modalTitle}</span>
                    {children}
                </div>
            </div>
        </div>
    )
}