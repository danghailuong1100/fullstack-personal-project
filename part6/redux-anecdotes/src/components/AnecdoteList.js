import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { addNotification } from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleClick(anecdote)}>vote</button>
      </div>
    </div>
  );
};

const AnecdoteList = () => {
  const dispatch = useDispatch();

  const anecdotes = useSelector((state) => {
    return [...state.anecdote]
      .filter((anecdote) =>
        anecdote.content.toLowerCase().includes(state.filter)
      )
      .sort((itemA, itemB) => {
        return itemB.votes - itemA.votes;
      });
  });

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote));
    dispatch(addNotification(`you voted '${anecdote.content}'`, 5));
  };

  return (
    <>
      {anecdotes.map((anecdote) => (
        <Anecdote key={anecdote.id} anecdote={anecdote} handleClick={vote} />
      ))}
    </>
  );
};

export default AnecdoteList;
