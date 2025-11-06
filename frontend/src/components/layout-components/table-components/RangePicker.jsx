import { useState } from "react";
import QuicklyFilter from "./QuicklyFilter";

export default function RangePicker({ onDateRangeChange }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        if (onDateRangeChange)
            onDateRangeChange(start, end);
    }

    return (
        <div className="absolute flex flex-col border rounded border-gray-200 right-0 mt-1 p-5 bg-white shadow-md">
            <div className="flex items-center gap-7 bg-white">
                <div className="flex flex-col gap-3">
                    <input 
                        value={startDate}
                        type="date" 
                        onChange={(e) => handleChange(e.target.value, endDate)}
                        className="border border-gray-200 p-2 rounded bg-gray-100/70 shadow-md placeholder-gray-500 px-4"
                    />
                    <div className="flex flex-col">
                        <QuicklyFilter 
                            name={'Hoy'}
                            onClick={() => {
                                const today = new Date().toISOString().split('T')[0];
                                handleChange(today, today);
                            }}    
                        />
                        <QuicklyFilter 
                            name={'Esta semana'} 
                            onClick={() => {
                                const today = new Date();
                                const first = new Date(today.setDate(today.getDate() - today.getDay() + 1));
                                const last = new Date(today.setDate(today.getDate() - today.getDay() + 7));
                                handleChange(first.toISOString().split('T')[0], last.toISOString().split('T')[0]);
                            }}
                        />
                    </div>
                </div>
                <span className="text-black">a</span>
                <div className="flex flex-col gap-3">
                    <input 
                        name="end" 
                        type="date"
                        onChange={(e) => handleChange(startDate, e.target.value)}
                        className="border border-gray-200 p-2 rounded bg-gray-100/70 shadow-md placeholder-gray-500 px-4"
                    />
                    <div className="flex flex-col">
                        <QuicklyFilter 
                            name={'Ayer'} 
                            onClick={() => {
                                const yesterday = new Date();
                                yesterday.setDate(yesterday.getDate() - 1);
                                const y = yesterday.toISOString().split('T')[0];
                                handleChange(y, y);
                            }}     
                        />
                        <QuicklyFilter 
                            name={'Este mes'} 
                            onClick={() => {
                                const now = new Date();
                                const first = new Date(now.getFullYear(), now.getMonth(), 1);
                                const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                                handleChange(first.toISOString().split('T')[0], last.toISOString().split('T')[0]);
                            }}    
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}