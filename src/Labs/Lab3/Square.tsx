export default function Square({ n }: { n: number }) {
  return (
    <div>
      <h2>Square Component</h2>
      <p>{n}² = {n * n}</p>
    </div>
  );
}