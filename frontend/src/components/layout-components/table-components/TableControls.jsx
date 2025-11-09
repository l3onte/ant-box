import Search from "./Search"
import FilterButton from "./FilterButton"
import SortButton from "./SortButton"
import PaginationSelect from "./PaginationSelect"
import ExcelButton from "./ExcelButton"
import { useStore } from "../../../services/storeContext";

export default function TableControls({ onSearch, onSort, onDateRangeChange, useSearch = false, useSort = false, showProfit = false, useFilter = false ,gananciasTotales }) {
    const { store } = useStore();

    return (
        <div className="flex w-full justify-between">
            {useSearch && (
                <Search 
                    onSearch={onSearch}
                />
            )}

            {showProfit && (
                <div className="flex gap-2 items-center text-black ">
                    <span className="text-sm">Ganancias Totales:</span> 
                    <span className="text-md font-bold">
                        {store.moneda === 'NIO' ? 'C$' : '$'} {gananciasTotales}
                    </span>
                </div>
            )}

            <div className="flex gap-2">
                <PaginationSelect />

                {useFilter && (
                    <FilterButton 
                        onDateRangeChange={onDateRangeChange}
                    />
                )}

                {useSort && (
                    <SortButton onSort={onSort}/>
                )}

                <ExcelButton />
            </div>
        </div>
    )
}