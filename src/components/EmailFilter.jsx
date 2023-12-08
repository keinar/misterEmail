import { AlignJustify } from "lucide-react";
import { useEffect, useState } from "react";

export function EmailFilter({
  filterBy,
  onSetFilter,
  setShowNavBar,
  isMobile,
}) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);

  function handleChange(ev) {
    const { name: field, value } = ev.target;
    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }));
  }

  useEffect(() => {
    onSetFilter(filterByToEdit);
  }, [filterByToEdit]);

  function onShowNavbar() {
    setShowNavBar((prevShowNavBar) => (prevShowNavBar === 0 ? -400 : 0));
  }

  const { txt } = filterByToEdit;

  return (
    <form className="email-filter">
      <label htmlFor="search"></label>

      {isMobile && <AlignJustify onClick={onShowNavbar} />}
      <input
        onChange={handleChange}
        id="search"
        value={txt}
        name="txt"
        type="text"
        placeholder="Search"
      />
    </form>
  );
}
