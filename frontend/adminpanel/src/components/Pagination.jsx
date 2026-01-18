import './Pagination.css'

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages - 1, start + maxVisible - 1)
    
    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }

  return (
    <div className="pagination">
      <button 
        className="page-btn"
        onClick={() => onPageChange(0)}
        disabled={currentPage === 0}
      >
        ««
      </button>
      <button 
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        «
      </button>
      
      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`page-btn ${page === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page + 1}
        </button>
      ))}
      
      <button 
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      >
        »
      </button>
      <button 
        className="page-btn"
        onClick={() => onPageChange(totalPages - 1)}
        disabled={currentPage >= totalPages - 1}
      >
        »»
      </button>
      
      <span className="page-info">
        Page {currentPage + 1} of {totalPages}
      </span>
    </div>
  )
}

export default Pagination
