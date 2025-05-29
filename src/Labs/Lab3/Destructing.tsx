export default function Destructing() {
  const person = { name: "Alice", age: 25 };
  const { name, age } = person;

  return (
    <div>
      <h2>Destructuring</h2>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
}