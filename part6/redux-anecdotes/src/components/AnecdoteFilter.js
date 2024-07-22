import { useDispatch } from "react-redux";
import { changeFilter } from "../reducers/filterReducer";

const AnecdoteFilter = (props) => {
  const dispatch = useDispatch();

  const handleUpdateFilter = (event) => {
    event.preventDefault();
    dispatch(changeFilter(event.target.value));
  };

  return (
    <div>
      <div>
        filter <input name="filter" onChange={handleUpdateFilter} />
      </div>
    </div>
  );
};

export default AnecdoteFilter;
