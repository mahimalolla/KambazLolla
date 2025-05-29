export default function ConditionalOutput() {
  const loggedIn = true;
  const greeting = loggedIn ? <h2>Welcome user!</h2> : <h2>Please sign in</h2>;

  return (
    <div>
      <h2>Conditional Output</h2>
      {greeting}
    </div>
  );
}