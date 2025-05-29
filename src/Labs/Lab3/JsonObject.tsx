export default function JsonObject() {
  const house = {
    bedrooms: 4,
    bathrooms: 2.5,
    address: {
      street: "123 Main St",
      city: "Boston",
      state: "MA"
    }
  };

  console.log(house);

  return (
    <div>
      <h2>JSON Object (House)</h2>
      <pre>{JSON.stringify(house, null, 2)}</pre>
    </div>
  );
}