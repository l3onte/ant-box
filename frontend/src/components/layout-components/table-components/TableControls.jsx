import Search from "./Search"
import FilterButton from "./FilterButton"
import SortButton from "./SortButton"
import PaginationSelect from "./PaginationSelect"

export default function TableControls({ onSearch, onSort }) {
    return (
        <div className="flex w-full justify-between">
            <Search 
                onSearch={onSearch}
            />
            <div className="flex gap-2">
                <PaginationSelect />
                <FilterButton />
                <SortButton />
            </div>
        </div>
    )
}