export default function Table({ columns, data }) {
    return (
        <div className="w-full overflow-hidden rounded border border-gray-200 shadow-md">
            <table className="w-full border-collapse">
                <thead className="bg-red-50">
                    <tr>
                        {columns.map((col) => (
                            <th
                                className="text-left text-red-500/60 text-sm font-normal px-10 py-2"
                                key={col.accessor}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="bg-gray-50">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-100 transform transition duration-300 cursor-pointer">
                            {columns.map((col) =>(
                                <td
                                    className="text-left text-gray-700 px-10 py-2"
                                    key={col.accessor}
                                    style={col.style || {}}
                                >
                                    {col.Cell ? col.Cell(row) : row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}