
export default function TernaryOperator() {
  const isLoggedIn = false;

  return (
    <div>
      <h2>Ternary Operator</h2>
      <p>{isLoggedIn ? "Welcome!" : "Please sign in."}</p>
    </div>
  );
}
