export default function TemplateLiterals() {
  const name = "Mahima";
  const greeting = `Hello, ${name}!`;

  return (
    <div>
      <h2>Template Literals</h2>
      <p>{greeting}</p>
    </div>
  );
}