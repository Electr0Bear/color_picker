import { ModalHandler } from "./modal-handler";

let modals;

const initModals = () => {
  modals = new ModalHandler();
  modals.init();
}

export {initModals, modals}
