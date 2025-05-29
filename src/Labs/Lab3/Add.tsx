export default function Add({ a, b }: { a: number; b: number }) {
  return (
    <div>
      <h2>Add Component</h2>
      <p>{a} + {b} = {a + b}</p>
    </div>
  );
}
