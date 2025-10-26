export default function Table({ columns, data }) {
    return (
        <table>
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th
                            key={col.accessor}
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((col) =>(
                            <td
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
    )
}