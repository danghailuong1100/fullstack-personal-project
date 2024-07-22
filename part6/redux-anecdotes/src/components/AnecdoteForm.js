import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { addNotification } from "../reducers/notificationReducer";

const AnecdoteForm = (props) => {
  const dispatch = useDispatch();

  const add = async (event) => {
    event.preventDefault();
    const content = event.target.content.value;
    event.target.content.value = "";
    dispatch(createAnecdote(content));
    dispatch(addNotification(`you added '${content}'`, 5));
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={add}>
        <div>
          <input name="content" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
