import { useState } from "react";

const AnecdoteAndVote = ({ quote, vote }) => {
  return (
    <div>
      <p>{quote}</p>
      <p>has {vote} votes</p>
    </div>
  );
};

const findHighestVoteIndex = (votes) => {
  let highestIndex = 0;
  votes.forEach((element, index) => {
    if (element >= votes[highestIndex]) {
      highestIndex = index;
    }
  });
  return highestIndex;
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients",
  ];

  const [votes, setVotes] = useState(anecdotes.map((_) => 0));

  const [selected, setSelected] = useState(0);

  const highestVoteIndex = findHighestVoteIndex(votes);
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <AnecdoteAndVote quote={anecdotes[selected]} vote={votes[selected]} />
      <button
        onClick={() => {
          const newVotes = [...votes];
          newVotes[selected] += 1;
          setVotes(newVotes);
        }}
      >
        vote
      </button>
      <button
        onClick={() => {
          const randomIndex = Math.floor(Math.random() * anecdotes.length);
          setSelected(randomIndex);
        }}
      >
        next anecdote
      </button>
      <h1>Anecdote with the most votes</h1>
      <AnecdoteAndVote quote={anecdotes[highestVoteIndex]} vote={votes[highestVoteIndex]} />
    </div>
  );
};

export default App;
