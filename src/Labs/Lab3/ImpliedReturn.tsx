export default function ImpliedReturn() {
  const multiply = (a: number, b: number) => a * b;
  return (
    <div>
      <h2>Implied Return</h2>
      <p>multiply(4, 2) = {multiply(4, 2)}</p>
    </div>
  );
}
