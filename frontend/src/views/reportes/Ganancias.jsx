import ModuleLayout from "../../components/layout-components/ModuleLayout";
import TableControls from "../../components/layout-components/table-components/TableControls";
import Pagination from "../../components/layout-components/table-components/Pagination";
import Table from "../../components/layout-components/Table";
import { useStore } from "../../services/storeContext";
import { useState, useEffect } from "react";
import API from "../../services/API.js";

export default function Ganancias() {
    const { store } = useStore();
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [totalProfit, setTotalProfit] = useState({});

    const moduleInfo = {
        title: 'Ganancias',
        route: 'Reportes / Ganancias'
    }

    const columns = [
        { header: 'fecha', accessor: 'fecha' },
        { 
            header: 'ventas', 
            accessor: 'total_ventas', 
            Cell: (row) => (
                <div>
                    <span>{store.moneda === 'NIO' ? 'C$' : '$'}</span>
                    <span> {row.total_ventas}</span>
                </div>
            )
        },
        { 
            header: 'costos', 
            accessor: 'total_costos', 
            Cell: (row) => (
                <div>
                    <span>{store.moneda === 'NIO' ? 'C$' : '$'}</span>
                    <span> {row.total_costos}</span>
                </div>
            )
        },
        { 
            header: 'ganancia del día', 
            accessor: 'ganancia_total',
            Cell: (row) => (
                <div>
                    <span>{store.moneda === 'NIO' ? 'C$' : '$'}</span>
                    <span> {row.ganancia_total}</span>
                </div>
            )
        }
    ]

    useEffect(() => {
        API.get(`/ant-box/profits/getProfits/${store.id_tienda}?page=${page}&limit=${limit}`)
            .then((response) => {
                setData(response?.data?.rows);
                setTotal(response?.data?.total);
            })
            .catch(error => console.error('Error fetching profits data:', error));
    }, [store.id_tienda, page]);

    useEffect(() => {
        API.get(`/ant-box/profits/getTotal/${store.id_tienda}`)
            .then((response) => {
                setTotalProfit(response?.data);
            })
            .catch(error => console.error('Error fetching total profits:', error));
    }, [store.id_tienda])

    return (
        <ModuleLayout 
            moduleInfo={moduleInfo}        
        >
            <TableControls 
                showProfit={true}
                gananciasTotales={totalProfit.ganancia_total}
                useFilter={true}
                ExcelModule={'profits'}
                ExcelName={'Ganancias'}
            />
            <Table 
                columns={columns}
                data={data}
            />
            <Pagination 
                page={page}
                limit={limit}
                total={total}
                onPageChange={(newPage) => setPage(newPage)}
            />
        </ModuleLayout>
    )
}