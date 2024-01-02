import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({
  currentPage,
  setCurrentPage,
  mailsPerPage,
  mails,
}) {
  const totalPages = Math.ceil(mails.length / mailsPerPage);

  function goToNextPage() {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }

  function goToPreviousPage() {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }

  return (
    <div className="pagination">
      <div
        className={`pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={goToPreviousPage}
      >
        <ChevronLeft size={14} />
      </div>

      <div
        className={`pagination-arrow ${
          currentPage >= totalPages ? 'disabled' : ''
        }`}
        onClick={goToNextPage}
      >
        <ChevronRight size={14} />
      </div>
    </div>
  );
}
