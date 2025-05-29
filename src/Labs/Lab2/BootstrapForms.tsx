import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

const BootstrapForms = () => (
  <div className="mt-5">
    <h2>Bootstrap Forms</h2>
    
    {/* Responsive Forms Section */}
    <h3>Responsive forms</h3>
    <Form className="mb-5">
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="Email" />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Radios</Form.Label>
        <div>
          <Form.Check 
            type="radio" 
            label="first radio" 
            name="radioGroup" 
            id="radio1" 
            defaultChecked 
          />
          <Form.Check 
            type="radio" 
            label="second radio" 
            name="radioGroup" 
            id="radio2" 
          />
          <Form.Check 
            type="radio" 
            label="third radio" 
            name="radioGroup" 
            id="radio3" 
          />
        </div>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Check type="checkbox" label="Remember me" />
      </Form.Group>
      
      <Button variant="primary" type="submit">Sign in</Button>
    </Form>

    {/* Addons Section */}
    <h3>Addons</h3>
    <div className="mb-4">
      <InputGroup className="mb-3">
        <InputGroup.Text>$</InputGroup.Text>
        <Form.Control type="number" placeholder="0.00" />
      </InputGroup>
      
      <InputGroup className="mb-3">
        <Form.Control type="number" placeholder="0.00" />
        <InputGroup.Text>$</InputGroup.Text>
      </InputGroup>
    </div>

    {/* Original Bootstrap Forms */}
    <h3>Original Form Examples</h3>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Comments</Form.Label>
        <Form.Control as="textarea" rows={3} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Example select</Form.Label>
        <Form.Select>
          <option>Option 1</option>
          <option>Option 2</option>
        </Form.Select>
      </Form.Group>
      <Form.Check type="switch" label="Enable feature" className="mb-3" />
      <Form.Label>Range</Form.Label>
      <Form.Range />
      <Form.Check type="radio" label="Agree" name="radio" className="mb-3" />
      <Button variant="primary" type="submit">Submit</Button>
    </Form>
  </div>
);

export default BootstrapForms;