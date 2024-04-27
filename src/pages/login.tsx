import { FC, useState } from 'react';

const Login: FC = () => {
  const [counter, setCounter] = useState(0);

  return (
    <>
      <h1>Login Page</h1>
      <h3>{counter}</h3>
      <button onClick={() => setCounter(counter + 1)}>
        Increment the counter!
      </button>
    </>
  );
};

export default Login;
