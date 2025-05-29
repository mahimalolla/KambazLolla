export default function SpreadOperator() {
  const original = [1, 2, 3];
  const copy = [...original, 4, 5];

  return (
    <div>
      <h2>Spread Operator</h2>
      <p>{copy.join(", ")}</p>
    </div>
  );
}