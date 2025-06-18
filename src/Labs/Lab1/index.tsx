import './index.css';
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Lab1() {
  const [rating, setRating] = useState(4);
  const [dateOfBirth, setDateOfBirth] = useState("2000-01-21");

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
        <h5>My Favorite Recipe</h5>
        <ol id="wd-your-favorite-recipe">
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
        <h5>My Favorite Books</h5>
        <ul>
          <li>The Great Gatsby</li>
          <li>To Kill a Mockingbird</li>
          <li>1984</li>
        </ul>
        <h5>Programming Languages</h5>
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
          id="wd-starship"
          src="https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg"
          alt="Starship"
          width={400}
        />
        <br />
        <img
          id="wd-teslabot"
          src="/images/teslabot.jpg"
          alt="Tesla Bot"
          height={200}
        />
      </div>

      {/* Anchor Tags */}
      <div id="wd-anchor">
        <h4>Links</h4>
        <a href="https://google.com" target="_blank" rel="noreferrer">Google</a><br />
        <a id="wd-github" href="https://github.com/mahimalolla" target="_blank" rel="noreferrer">My GitHub</a>
      </div>

      {/* Forms */}
      <div id="wd-forms">
        <h4>HTML Forms</h4>
        <form>
          <h5>Text Fields</h5>
          <label htmlFor="wd-text-fields-username">Username:</label>
          <input id="wd-text-fields-username" type="text" placeholder="jdoe" /><br />
          
          <label htmlFor="wd-text-fields-password">Password:</label>
          <input id="wd-text-fields-password" type="password" value="123@#$asd" /><br />
          
          <label htmlFor="wd-text-fields-first-name">First Name:</label>
          <input id="wd-text-fields-first-name" type="text" title="John" /><br />
          
          <label htmlFor="wd-text-fields-last-name">Last Name:</label>
          <input id="wd-text-fields-last-name" type="text" placeholder="Doe" value="Wonderland" title="The last name" /><br />

          <h5>Text Area</h5>
          <label>Biography:</label><br />
          <textarea id="wd-textarea" cols={30} rows={10}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </textarea><br />

          <h5 id="wd-buttons">Buttons</h5>
          <button type="button" onClick={() => alert("Life is Good!")} id="wd-all-good">
            Hello World!
          </button><br />

          <h5>File Upload</h5>
          <input type="file" /><br />

          <h5 id="wd-radio-buttons">Radio Buttons</h5>
          <label>Favorite movie genre:</label><br />
          <input type="radio" name="radio-genre" id="wd-radio-comedy" />
          <label htmlFor="wd-radio-comedy">Comedy</label><br />
          <input type="radio" name="radio-genre" id="wd-radio-drama" />
          <label htmlFor="wd-radio-drama">Drama</label><br />
          <input type="radio" name="radio-genre" id="wd-radio-scifi" />
          <label htmlFor="wd-radio-scifi">SciFi</label><br />
          <input type="radio" name="radio-genre" id="wd-radio-fantasy" />
          <label htmlFor="wd-radio-fantasy">Fantasy</label><br />

          <h5 id="wd-checkboxes">Checkboxes</h5>
          <label>Favorite movie genres:</label><br />
          <input type="checkbox" name="check-genre" id="wd-chkbox-comedy" />
          <label htmlFor="wd-chkbox-comedy">Comedy</label><br />
          <input type="checkbox" name="check-genre" id="wd-chkbox-drama" />
          <label htmlFor="wd-chkbox-drama">Drama</label><br />
          <input type="checkbox" name="check-genre" id="wd-chkbox-scifi" />
          <label htmlFor="wd-chkbox-scifi">SciFi</label><br />
          <input type="checkbox" name="check-genre" id="wd-chkbox-fantasy" />
          <label htmlFor="wd-chkbox-fantasy">Fantasy</label><br />

          <h4 id="wd-dropdowns">Dropdowns</h4>
          <h5>Select One</h5>
          <label htmlFor="wd-select-one-genre">Favorite movie genre:</label><br />
          <select id="wd-select-one-genre">
            <option value="COMEDY">Comedy</option>
            <option value="DRAMA">Drama</option>
            <option selected value="SCIFI">Science Fiction</option>
            <option value="FANTASY">Fantasy</option>
          </select><br />

          <h5>Select Many</h5>
          <label htmlFor="wd-select-many-genre">Favorite movie genres:</label><br />
          <select multiple id="wd-select-many-genre">
            <option value="COMEDY" selected>Comedy</option>
            <option value="DRAMA">Drama</option>
            <option value="SCIFI" selected>Science Fiction</option>
            <option value="FANTASY">Fantasy</option>
          </select><br />

          <h4>Other HTML Field Types</h4>
          <label htmlFor="wd-text-fields-email">Email:</label>
          <input type="email" placeholder="jdoe@somewhere.com" id="wd-text-fields-email" /><br />
          
          <label htmlFor="wd-text-fields-salary-start">Starting Salary:</label>
          <input type="number" value="100000" placeholder="1000" id="wd-text-fields-salary-start" /><br />
          
          <label htmlFor="wd-text-fields-rating">Rating: {rating}/5</label>
          <input 
            type="range" 
            value={rating} 
            max="5" 
            min="1"
            id="wd-text-fields-rating"
            onChange={(e) => setRating(parseInt(e.target.value))}
          /><br />
          
          <label htmlFor="wd-text-fields-dob">Date of Birth:</label>
          <input 
            type="date" 
            value={dateOfBirth} 
            id="wd-text-fields-dob"
            onChange={(e) => setDateOfBirth(e.target.value)}
          /><br />

          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Navigation Links */}
      <hr />
      <h4>Navigation</h4>
      <ul>
        <li><Link to="/Labs/Lab1">Lab 1</Link></li>
        <li><Link to="/Labs/Lab2">Lab 2</Link></li>
        <li><Link to="/Labs/Lab3">Lab 3</Link></li>
        <li><Link to="/Labs/Lab4">Lab 4</Link></li>
        <li><Link to="/Labs/Lab5">Lab 5</Link></li>
        <li><Link to="/Kambaz/Account">Kambaz App</Link></li>
        <li><a href="https://github.com/mahimalolla" target="_blank" rel="noreferrer">GitHub Repository</a></li>
      </ul>
    </div>
  );
}
