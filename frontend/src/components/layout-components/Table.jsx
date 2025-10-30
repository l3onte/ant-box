import { useState } from "react";
import { Fragment } from "react";

export default function Table({ columns, data, expandable = false, renderExpandedRow }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="w-full overflow-hidden rounded border border-gray-200 shadow-md">
      <table className="w-full border-collapse">
        <thead className="bg-red-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="text-left text-red-500/60 text-sm font-normal px-10 py-2"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-gray-50">
          {data.map((row, rowIndex) => (
            <Fragment key={rowIndex}>
              <tr
                className={`hover:bg-gray-100 transition duration-300 ${
                  expandable ? "cursor-pointer" : ""
                }`}
                onClick={() => expandable && toggleExpand(rowIndex)}
              >
                {columns.map((col) => (
                  <td
                    key={col.accessor}
                    className="text-left text-gray-700 px-10 py-2"
                  >
                    {col.Cell ? col.Cell(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>

              {expandable && expandedRow === rowIndex && renderExpandedRow && (
                <tr className="bg-white border-t border-gray-200">
                  <td colSpan={columns.length} className="p-4">
                    {renderExpandedRow(row)}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
