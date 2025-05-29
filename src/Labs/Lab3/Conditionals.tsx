export default function Conditionals() {
  const loggedIn = true;
  let greeting;

  if (loggedIn) {
    greeting = <h2>Welcome back!</h2>;
  } else {
    greeting = <h2>Please log in.</h2>;
  }

  return (
    <div>
      <h2>Conditionals</h2>
      {greeting}
    </div>
  );
}
