import { DragDrop } from "./drag-drop";

let dragDrop;

const initDragDrop = () => {
  dragDrop = new DragDrop();
  dragDrop.init();
}

export {initDragDrop, dragDrop};
