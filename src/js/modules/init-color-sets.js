import { ColorSet } from "./color-set";

let colorSetHandler;

const initColorSets = () => {
  colorSetHandler = new ColorSet;
  colorSetHandler.init();
}

export {initColorSets, colorSetHandler}