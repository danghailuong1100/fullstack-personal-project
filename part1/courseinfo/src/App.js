const Header = ({ name }) => {
  return <h1>{name}</h1>;
};

const Part = ({ content }) => {
  return (
    <p>
      {content.name} {content.exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <div>
      <Part content={parts[0]} />
      <Part content={parts[1]} />
      <Part content={parts[2]} />
    </div>
  );
};

const Total = ({ parts }) => {
  return (
    <p>
      Number of exercises{" "}
      {parts[0].exercises + parts[1].exercises + parts[2].exercises}
    </p>
  );
};

const App = () => {
  const course = {
    name: "Half Stack application development",

    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default App;
