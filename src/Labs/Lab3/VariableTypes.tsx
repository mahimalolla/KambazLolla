export default function VariableTypes() {
  const wholeNumber = 123;
  const decimalNumber = 234.345;
  const string1 = "hello";
  const string2 = 'world';

  return (
    <div>
      <h2>Variable Types</h2>
      <p>wholeNumber = {wholeNumber}</p>
      <p>decimalNumber = {decimalNumber}</p>
      <p>string1 = {string1}</p>
      <p>string2 = {string2}</p>
    </div>
  );
}