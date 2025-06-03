import './index.css';

export default function Lab1() {
  return (
    <div id="wd-lab1" className="container mt-5">
      <h1>Mahima Lolla</h1>
      <h3>Section: CS5610</h3>

      {/* Headings */}
      <div id="wd-heading-tag">
        <h2>Heading Tags</h2>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
      </div>

      {/* Paragraphs */}
      <div id="wd-p-tag">
        <h4>Paragraph Tags</h4>
        <p>This is the first paragraph.</p>
        <p>This is the second paragraph.</p>
      </div>

      {/* Ordered List */}
      <div id="wd-ol">
        <h4>Ordered List</h4>
        <ol>
          <li>Mix flour, sugar, and baking powder</li>
          <li>Add milk and eggs</li>
          <li>Stir until smooth</li>
          <li>Pour batter on griddle</li>
          <li>Flip when bubbles form</li>
          <li>Serve hot with syrup</li>
        </ol>
        <ol>
          <li>Wake up</li>
          <li>Brush teeth</li>
          <li>Make coffee</li>
          <li>Check emails</li>
        </ol>
      </div>

      {/* Unordered List */}
      <div id="wd-ul">
        <h4>Unordered List</h4>
        <ul>
          <li>The Great Gatsby</li>
          <li>To Kill a Mockingbird</li>
          <li>1984</li>
        </ul>
        <ul>
          <li>Python</li>
          <li>React</li>
          <li>Next.js</li>
        </ul>
      </div>

      {/* Table */}
      <div id="wd-table">
        <h4>Quiz Table</h4>
        <table style={{ border: "1px solid black" }}>
          <thead>
            <tr>
              <th>Quiz #</th>
              <th>Topic</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, i) => (
              <tr key={i}>
                <td>Quiz {i + 1}</td>
                <td>Topic {i + 1}</td>
                <td>{80 + i}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Images */}
      <div id="wd-images">
        <h4>Images</h4>
        <img
          src="https://www.animalhospitalofclemmons.com/files/AdobeStock290844781.jpeg"
          alt="Remote example"
          width={150}
        />
        <br />
        <img
          src="/images/local-image.jpg"
          alt="Local example"
          width={150}
        />
      </div>

      {/* Anchor Tags */}
      <div id="wd-anchor">
        <h4>Links</h4>
        <a href="https://google.com" target="_blank" rel="noreferrer">Google</a><br />
        <a href="https://github.com/mahimalolla" target="_blank" rel="noreferrer">My GitHub</a>
      </div>

      {/* Forms */}
      <div id="wd-forms">
        <h4>HTML Forms</h4>
        <form>
          <label>Username</label>
          <input type="text" name="username" className="form-control" /><br />

          <label>Bio</label>
          <textarea className="form-control" rows={3}></textarea><br />

          <label>Gender</label><br />
          <input type="radio" name="gender" value="male" /> Male<br />
          <input type="radio" name="gender" value="female" /> Female<br />

          <label>Skills</label><br />
          <input type="checkbox" /> HTML<br />
          <input type="checkbox" /> CSS<br />
          <input type="checkbox" /> JavaScript<br />

          <label>Country</label><br />
          <select>
            <option>USA</option>
            <option>India</option>
            <option>Germany</option>
          </select><br />

          <label>Favorite Tools</label><br />
          <select multiple>
            <option>VSCode</option>
            <option>WebStorm</option>
            <option>Sublime</option>
          </select><br />

          <label>Email</label>
          <input type="email" /><br />
          <label>Age</label>
          <input type="number" /><br />
          <label>Date</label>
          <input type="date" /><br />
          <label>Progress</label>
          <input type="range" /><br />

          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Navigation Links */}
      <hr />
      <h4>Navigation</h4>
      <ul>
        <li><a href="/Labs/Lab1">Lab 1</a></li>
        <li><a href="/Labs/Lab2">Lab 2</a></li>
        <li><a href="/Labs/Lab3">Lab 3</a></li>
        <li><a href="/Kambaz/Account">Kambaz App</a></li>
        <li><a href="https://github.com/mahimalolla" target="_blank" rel="noreferrer">GitHub Repository</a></li>
      </ul>
    </div>
  );
}
