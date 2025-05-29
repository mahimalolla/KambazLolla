import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import ReactIcons from "./ReactIcons";
import Float from "./Float";
import Flex from "./Flex";
import GridLayout from "./GridLayout";
import BootstrapTables from './BootstrapTables';
import BootstrapLists from './BootstrapLists';
import BootstrapForms from './BootstrapForms';
import BootstrapNavigation from './BootstrapNavigation';
import Margins from "./Margins";
import Position from "./Positions";
import AbsolutePosition from "./AbsolutePosition";
import FixedPosition from "./FixedPositions";
import Zindex from "./Zindex";

export default function Lab2() {
  return (
    <div id="wd-lab2">
      <h2>Lab 2 - Cascading Style Sheets</h2>

      {/* 2.1.2 – Style attribute */}
      <h3>Styling with the STYLE attribute</h3>
      <p id="wd-style-attribute-paragraph">
        Style attribute allows configuring look and feel right on the element.
        Although it's very convenient, it is considered bad practice.
      </p>

      {/* 2.1.3 – ID Selectors */}
      <div id="wd-css-id-selectors">
        <h3>ID Selectors</h3>
        <p id="wd-id-selector-1">
          This paragraph uses ID selector 1 with white text on red background.
        </p>
        <p id="wd-id-selector-2">
          This paragraph uses ID selector 2 with black text on yellow background.
        </p>
      </div>

      {/* 2.1.4 – Class Selectors */}
      <div id="wd-css-class-selectors">
        <h3>Class Selectors</h3>
        <p className="wd-class-selector">
          This paragraph uses a class selector.
        </p>
        <h4 className="wd-class-selector">
          This heading also uses the same class selector.
        </h4>
      </div>

      {/* 2.1.5 – Document Structure */}
      <div id="wd-css-structure-selectors">
        <h3>Document Structure Selectors</h3>
        <div id="wd-structure-div">
          This is a red DIV with white text and a
          <span> yellow span with blue text inside it</span>.
        </div>
      </div>

      {/* 2.1.6 – Foreground Colors */}
      <div id="wd-css-foreground-colors">
        <h3>Foreground Colors</h3>
        <h4 id="wd-foreground-blue-heading">
          This heading uses blue as the foreground color.
        </h4>
        <p id="wd-foreground-red-text">
          This paragraph uses red as the foreground color.
        </p>
        <p id="wd-foreground-green-text">
          This paragraph uses green as the foreground color.
        </p>
      </div>

      {/* 2.1.7 – Background Colors */}
      <div id="wd-css-background-colors">
        <h3>Background Colors</h3>
        <h4 id="wd-background-blue-heading">
          This heading has white text on a blue background.
        </h4>
        <p id="wd-background-red-paragraph">
          This paragraph has black text on a red background.
        </p>
        <p>
          This is a paragraph with a
          <span id="wd-background-green-span"> green span on white text </span>
          inside it.
        </p>
      </div>

      {/* 2.1.8 – Borders */}
      <div id="wd-css-borders">
        <h3>Borders</h3>
        <p id="wd-border-fat-red">
          This paragraph has a fat red solid border.
        </p>
        <p id="wd-border-thin-blue-dashed">
          This paragraph has a thin blue dashed border.
        </p>
      </div>

      {/* 2.1.9 – Margins and Padding */}
      <div id="wd-css-margins-padding">
        <h3>Margins and Padding</h3>
        <p id="wd-margin-red-yellow">
          Fat red border with yellow background and big padding above and left.
        </p>
        <p id="wd-margin-blue-yellow">
          Fat blue border with yellow background and big padding at bottom.
        </p>
        <p id="wd-margin-yellow-blue">
          Fat yellow border with blue background and big padding all around.
        </p>
        <p id="wd-margin-red-yellow-bottom">
          Fat red border with yellow background and margin at bottom.
        </p>
        <p id="wd-margin-blue-yellow-centered">
          Fat blue border with yellow background and centered using auto margins.
        </p>
        <p id="wd-margin-yellow-blue-all">
          Fat yellow border with blue background and big margin all around.
        </p>
      </div>

      {/* 2.1.10–13 – Corners */}
      <div id="wd-css-corners">
        <h3>Corners</h3>
        <div id="wd-corner-top-left-right">
          Rounded top left and top right corners.
        </div>
        <div id="wd-corner-bottom-left-right">
          Rounded bottom left and bottom right corners.
        </div>
        <div id="wd-corner-all">
          Rounded corners on all sides.
        </div>
        <div id="wd-corner-all-except-top-right">
          Rounded corners except top right.
        </div>
      </div>

      {/* CSS Positioning Examples */}
      <Margins />
      <Position />
      <AbsolutePosition />
      <FixedPosition />
      <Zindex />

      {/* 2.2 – React Icons */}
      <ReactIcons />

      {/* 2.1.17 – Floating Content */}
      <Float />

      {/* 2.1.18 – Grid Layout with custom CSS */}
      <GridLayout />

      {/* 2.1.19 – Flexbox Layout */}
      <Flex />

      {/* 2.3 – Bootstrap Grid */}
      <div className="container mt-5">
        <h2>Bootstrap</h2>
        <h3>Grid system</h3>
        
        {/* Two halves */}
        <div className="row mb-3">
          <div className="col-6 bg-danger text-white p-3 text-center">
            <strong>Left half</strong>
          </div>
          <div className="col-6 bg-primary text-white p-3 text-center">
            <strong>Right half</strong>
          </div>
        </div>

        {/* One third and two thirds */}
        <div className="row mb-3">
          <div className="col-4 bg-warning text-dark p-3 text-center">
            <strong>One thirds</strong>
          </div>
          <div className="col-8 bg-success text-white p-3 text-center">
            <strong>Two thirds</strong>
          </div>
        </div>

        {/* Three column layout */}
        <div className="row mb-3">
          <div className="col-2 bg-dark text-white p-3 text-center">
            <strong>Sidebar</strong>
          </div>
          <div className="col-8 bg-secondary text-white p-3 text-center">
            <strong>Main content</strong>
          </div>
          <div className="col-2 bg-info text-dark p-3 text-center">
            <strong>Sidebar</strong>
          </div>
        </div>

        {/* Original responsive grid examples */}
        <h4 className="mt-5">Responsive Examples</h4>
        <div className="row text-center">
          <div className="col-md-6 col-12 border p-2">Left (col-md-6 col-12)</div>
          <div className="col-md-6 col-12 border p-2">Right (col-md-6 col-12)</div>
        </div>

        <div className="row text-center mt-3">
          <div className="col-lg-8 col-12 border p-2">Main (col-lg-8 col-12)</div>
          <div className="col-lg-4 col-12 border p-2">Sidebar (col-lg-4 col-12)</div>
        </div>

        <div className="row text-center mt-3">
          <div className="col-sm-4 col-12 border p-2">1/3 (col-sm-4)</div>
          <div className="col-sm-4 col-12 border p-2">1/3 (col-sm-4)</div>
          <div className="col-sm-4 col-12 border p-2">1/3 (col-sm-4)</div>
        </div>

        <h3 className="mt-5">12 Column Responsive Grid</h3>
        <div className="row text-center">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="col-1 border bg-light p-2">
              {i + 1}
            </div>
          ))}
        </div>

        <h3 className="mt-5">Responsive grid system</h3>
        
        {/* All 12 columns in one row */}
        <div className="row mb-3">
          <div className="col-1 bg-warning text-center p-2">1</div>
          <div className="col-1 bg-primary text-white text-center p-2">2</div>
          <div className="col-1 bg-success text-white text-center p-2">3</div>
          <div className="col-1 bg-danger text-white text-center p-2">4</div>
          <div className="col-1 bg-warning text-center p-2">5</div>
          <div className="col-1 bg-primary text-white text-center p-2">6</div>
          <div className="col-1 bg-danger text-white text-center p-2">7</div>
          <div className="col-1 bg-warning text-center p-2">8</div>
          <div className="col-1 bg-success text-white text-center p-2">9</div>
          <div className="col-1 bg-warning text-center p-2">10</div>
          <div className="col-1 bg-danger text-white text-center p-2">11</div>
          <div className="col-1 bg-success text-white text-center p-2">12</div>
        </div>

        {/* 6-6 split */}
        <div className="row mb-3">
          <div className="col-1 bg-warning text-center p-2">1</div>
          <div className="col-1 bg-primary text-white text-center p-2">2</div>
          <div className="col-1 bg-danger text-white text-center p-2">3</div>
          <div className="col-1 bg-success text-white text-center p-2">4</div>
          <div className="col-1 bg-warning text-center p-2">5</div>
          <div className="col-1 bg-primary text-white text-center p-2">6</div>
          <div className="col-1 bg-danger text-white text-center p-2">7</div>
          <div className="col-1 bg-success text-white text-center p-2">8</div>
          <div className="col-1 bg-warning text-center p-2">9</div>
          <div className="col-1 bg-primary text-white text-center p-2">10</div>
          <div className="col-1 bg-danger text-white text-center p-2">11</div>
          <div className="col-1 bg-success text-white text-center p-2">12</div>
        </div>

        {/* 4-4-4 split */}
        <div className="row mb-3">
          <div className="col-4 bg-warning text-center p-3">
            <div className="row">
              <div className="col-3 p-1">1</div>
              <div className="col-3 p-1">5</div>
              <div className="col-3 p-1">9</div>
            </div>
          </div>
          <div className="col-4 bg-primary text-white text-center p-3">
            <div className="row">
              <div className="col-3 p-1">2</div>
              <div className="col-3 p-1">6</div>
              <div className="col-3 p-1">10</div>
            </div>
          </div>
          <div className="col-4 bg-success text-white text-center p-3">
            <div className="row">
              <div className="col-4 p-1">3</div>
              <div className="col-4 p-1">4</div>
              <div className="col-4 p-1">7</div>
              <div className="col-4 p-1">8</div>
              <div className="col-4 p-1">11</div>
              <div className="col-4 p-1">12</div>
            </div>
          </div>
        </div>

        {/* 3-3-3-3 split */}
        <div className="row mb-3">
          <div className="col-3 bg-warning text-center p-3">
            <div>1</div>
            <div>5</div>
            <div>9</div>
          </div>
          <div className="col-3 bg-primary text-white text-center p-3">
            <div>2</div>
            <div>6</div>
            <div>10</div>
          </div>
          <div className="col-3 bg-danger text-white text-center p-3">
            <div>3</div>
            <div>7</div>
            <div>11</div>
          </div>
          <div className="col-3 bg-success text-white text-center p-3">
            <div>4</div>
            <div>8</div>
            <div>12</div>
          </div>
        </div>

        {/* 6-6 split with alternating colors */}
        <div className="row mb-3">
          <div className="col-6 text-center p-3">
            <div className="row">
              <div className="col-2 bg-warning p-2">1</div>
              <div className="col-2 bg-danger text-white p-2">3</div>
              <div className="col-2 bg-warning p-2">5</div>
              <div className="col-2 bg-danger text-white p-2">7</div>
              <div className="col-2 bg-warning p-2">9</div>
              <div className="col-2 bg-danger text-white p-2">11</div>
            </div>
          </div>
          <div className="col-6 text-center p-3">
            <div className="row">
              <div className="col-2 bg-primary text-white p-2">2</div>
              <div className="col-2 bg-success text-white p-2">4</div>
              <div className="col-2 bg-primary text-white p-2">6</div>
              <div className="col-2 bg-success text-white p-2">8</div>
              <div className="col-2 bg-primary text-white p-2">10</div>
              <div className="col-2 bg-success text-white p-2">12</div>
            </div>
          </div>
        </div>

        {/* Full width stacked */}
        <div className="row mb-3">
          <div className="col-12 bg-warning text-center p-2 mb-1">1</div>
          <div className="col-12 bg-primary text-white text-center p-2 mb-1">2</div>
          <div className="col-12 bg-danger text-white text-center p-2 mb-1">3</div>
          <div className="col-12 bg-success text-white text-center p-2 mb-1">4</div>
          <div className="col-12 bg-warning text-center p-2 mb-1">5</div>
          <div className="col-12 bg-primary text-white text-center p-2">6</div>
        </div>

        <h3 className="mt-5">Responsive Breakpoints</h3>
        <div className="position-absolute top-0 start-0 bg-dark text-white px-2 py-1" style={{zIndex: 999}}>
          <span className="d-block d-sm-none">XS</span>
          <span className="d-none d-sm-block d-md-none">SM</span>
          <span className="d-none d-md-block d-lg-none">MD</span>
          <span className="d-none d-lg-block d-xl-none">LG</span>
          <span className="d-none d-xl-block">XL+</span>
        </div>
      </div>

      {/* 2.3.1 – Bootstrap Tables */}
      <BootstrapTables />

      {/* 2.3.2 – Bootstrap Lists */}
      <BootstrapLists />

      {/* 2.3.3 – Bootstrap Forms */}
      <BootstrapForms />

      {/* 2.3.4 – Bootstrap Navigation */}
      <BootstrapNavigation />

      {/* 2.3.5 – Bootstrap Cards */}
      <div className="container mt-5">
        <h2>Cards</h2>
        <div className="card" style={{ width: "18rem", marginBottom: "20px" }}>
          <img 
            className="card-img-top" 
            src="https://picsum.photos/300/200?random=1" 
            alt="Stacking Starship"
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title">Stacking Starship</h5>
            <p className="card-text">
              Stacking the most powerful rocket in history. Mars or bust!
            </p>
            <a href="#" className="btn btn-primary">Boldly Go</a>
          </div>
        </div>
        
        {/* Backup card with solid background if image fails */}
        <div className="card" style={{ width: "18rem", backgroundColor: "#f8f9fa", border: "2px solid #007bff" }}>
          <div className="card-header bg-primary text-white">
            <strong>Starship Image</strong>
          </div>
          <div className="card-body">
            <h5 className="card-title">Stacking Starship</h5>
            <p className="card-text">
              Stacking the most powerful rocket in history. Mars or bust!
            </p>
            <a href="#" className="btn btn-primary">Boldly Go</a>
          </div>
        </div>
      </div>
    </div>
  );
}