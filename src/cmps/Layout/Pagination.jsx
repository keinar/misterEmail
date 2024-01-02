export function Pagination({
  goToPreviousPage,
  currentPage,
  goToNextPage,
  mailsPerPage,
  mails,
}) {
  const totalPages = Math.ceil(mails.length / mailsPerPage);
  return (
    <div className="pagination">
      <button onClick={goToPreviousPage} disabled={currentPage === 1}>
        Previous
      </button>
      <span>Page {currentPage}</span>
      <button onClick={goToNextPage} disabled={currentPage >= totalPages}>
        Next
      </button>
    </div>
  );
}
