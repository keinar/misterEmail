import { useEffect, useState } from "react";

export function EmailFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);

  function handleChange(ev) {
    const { name: field, value } = ev.target;
    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }));
  }

  useEffect(() => {
    onSetFilter(filterByToEdit);
  }, [filterByToEdit]);

  const { txt } = filterByToEdit;

  // console.log(filterByToEdit);

  return (
    <form className="email-filter">
      <label htmlFor="search"></label>

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
