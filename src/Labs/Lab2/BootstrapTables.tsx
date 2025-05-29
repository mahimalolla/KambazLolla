export default function BootstrapTables() {
  return (
    <div id="wd-bootstrap-tables" className="mt-5">
      <h3>Bootstrap Tables</h3>
      
      {/* Colored Quiz Table */}
      <h4>Colored Table</h4>
      <table className="table">
        <thead className="table-dark">
          <tr>
            <th>Quiz</th>
            <th>Topic</th>
            <th>Date</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr className="table-warning">
            <td>Q1</td>
            <td>HTML</td>
            <td>2/3/21</td>
            <td>85</td>
          </tr>
          <tr className="table-danger">
            <td>Q2</td>
            <td>CSS</td>
            <td>2/10/21</td>
            <td>90</td>
          </tr>
          <tr className="table-primary">
            <td>Q3</td>
            <td>JavaScript</td>
            <td>2/17/21</td>
            <td>90</td>
          </tr>
          <tr className="table-success">
            <td>Average</td>
            <td></td>
            <td></td>
            <td>90</td>
          </tr>
        </tbody>
      </table>
      
      <h4>Basic Table</h4>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>John</td>
            <td>Doe</td>
            <td>john@example.com</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jane</td>
            <td>Smith</td>
            <td>jane@example.com</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Bob</td>
            <td>Johnson</td>
            <td>bob@example.com</td>
          </tr>
        </tbody>
      </table>

      <h4>Striped Table</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Laptop</td>
            <td>$999</td>
            <td>15</td>
            <td>Electronics</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>$599</td>
            <td>25</td>
            <td>Electronics</td>
          </tr>
          <tr>
            <td>Desk</td>
            <td>$299</td>
            <td>8</td>
            <td>Furniture</td>
          </tr>
          <tr>
            <td>Chair</td>
            <td>$199</td>
            <td>12</td>
            <td>Furniture</td>
          </tr>
        </tbody>
      </table>

      <h4>Bordered & Hover Table</h4>
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Course</th>
            <th>Credits</th>
            <th>Grade</th>
            <th>Semester</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Web Development</td>
            <td>4</td>
            <td>A</td>
            <td>Fall 2024</td>
          </tr>
          <tr>
            <td>Database Systems</td>
            <td>3</td>
            <td>B+</td>
            <td>Fall 2024</td>
          </tr>
          <tr>
            <td>Computer Networks</td>
            <td>3</td>
            <td>A-</td>
            <td>Spring 2024</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}