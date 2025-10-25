import Button from "../forms-components/Button"

export default function ModuleLayout({ moduleInfo }) {
    return (
        <div className="flex flex-col p-5 gap-5 h-full">
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
                    />
                </div>
            </div>
            <div className="flex justify-center items-center bg-gray-50 grow rounded shadow-sm text-gray-400">
                Empty
            </div>
        </div>
    )
}