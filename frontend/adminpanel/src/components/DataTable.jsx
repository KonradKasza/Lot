import './DataTable.css'

function DataTable({ columns, data, loading, onRowClick }) {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <span>Loading data...</span>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <span>📭</span>
        <p>No data available</p>
      </div>
    )
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr 
              key={row.id || index} 
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'clickable' : ''}
            >
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
