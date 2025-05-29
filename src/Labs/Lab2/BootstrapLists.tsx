import ListGroup from "react-bootstrap/ListGroup";

const BootstrapLists = () => (
  <div className="mt-5">
    <h2>Bootstrap Lists</h2>
    
    {/* Favorite Movies List */}
    <h3>Favorite movies</h3>
    <ListGroup className="mb-4">
      <ListGroup.Item variant="primary">Aliens</ListGroup.Item>
      <ListGroup.Item>Terminator</ListGroup.Item>
      <ListGroup.Item>Blade Runner</ListGroup.Item>
      <ListGroup.Item>Lord of the Ring</ListGroup.Item>
      <ListGroup.Item>Star Wars</ListGroup.Item>
    </ListGroup>

    {/* Original List */}
    <h3>Sample List</h3>
    <ListGroup>
      <ListGroup.Item>First item</ListGroup.Item>
      <ListGroup.Item>Second item</ListGroup.Item>
      <ListGroup.Item active>Active item</ListGroup.Item>
      <ListGroup.Item disabled>Disabled item</ListGroup.Item>
    </ListGroup>
  </div>
);

export default BootstrapLists;