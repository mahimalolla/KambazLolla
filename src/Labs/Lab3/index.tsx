import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import Conditionals from "./Conditionals";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutput from "./ConditionalOutput";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddRemoveToFromArray from "./AddRemoveToFromArray";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import JsonStringify from "./JsonStringify";
import JsonObject from "./JsonObject";
import RenderingArray from "./RenderingArray";
import SpreadOperator from "./SpreadOperator";
import Destructing from "./Destructing";
import DestructingParams from "./DestructingParams";
import Add from "./Add";
import Square from "./Square";
import Highlight from "./Highlight";
import Classes from "./Classes";
import Styles from "./Styles";
import PathParameters from "./PathParameters";
import AddPathParameters from "./AddPathParameters";

export default function Lab3() {
  console.log("Hello World from Lab3!");
  return (
    <div className="container mt-3">
      <h1>Lab 3 – JavaScript and React</h1>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <Conditionals />
      <TernaryOperator />
      <ConditionalOutput />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
      <ArrayIndexAndLength />
      <AddRemoveToFromArray />
      <ForLoops />
      <MapFunction />
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <JsonStringify />
      <JsonObject />
      <RenderingArray />
      <SpreadOperator />
      <Destructing />
      <DestructingParams />
      <Add a={3} b={5} />
      <Square n={4} />
     <Highlight bg="lightblue" fg="darkblue">
  Hello, Mahima!
</Highlight>
      <Classes />
      <Styles />
      <PathParameters />
      <AddPathParameters />
    </div>
  );
}
