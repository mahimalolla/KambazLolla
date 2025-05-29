function Welcome({ name }: { name: string }) {
  return <h3>Welcome, {name}!</h3>;
}

export default function DestructingParams() {
  return (
    <div>
      <h2>Destructuring Parameters</h2>
      <Welcome name="Mahima" />
    </div>
  );
}
