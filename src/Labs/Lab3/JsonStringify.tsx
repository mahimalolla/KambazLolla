export default function JsonStringify() {
  const user = {
    name: "Alice",
    age: 25,
    email: "alice@example.com"
  };

  return (
    <div>
      <h2>JSON.stringify</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}