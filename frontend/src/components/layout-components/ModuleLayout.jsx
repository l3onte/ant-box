import { useState } from "react"
import Button from "../forms-components/Button"
import Input from "../forms-components/Input"
import Modal from "../Modal";

export default function ModuleLayout({ moduleInfo, children, modalContent }) {
    const [isAddModalOpen, setIsAddModal] = useState(false);

    return (
        <div className="relative flex flex-col p-5 gap-5 h-full">
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <span className="font-bold">{moduleInfo.title}</span>
                    <span className="text-gray-400 text-[13px]">{moduleInfo.route}</span>
                </div>
                <div>
                    <Button 
                        name={moduleInfo.buttonName}
                        type={moduleInfo.buttonType}
                        variant={moduleInfo.buttonVariant}
                        onClick={() => setIsAddModal(!isAddModalOpen)}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-3 justify-between items-center bg-gray-50 grow rounded shadow-sm text-gray-400 p-5">
                {children}
            </div>

            {isAddModalOpen && (
                <Modal 
                    onClose={() => setIsAddModal(false)} 
                    modalTitle={moduleInfo.buttonName}
                >
                    {modalContent({ closeModal: () => setIsAddModal(false) })}
                </Modal>
            )}
        </div>
    )
}