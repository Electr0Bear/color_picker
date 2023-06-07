
import { initCustomComponents } from './components/components';
import { initColorPicker } from './modules/init-color-picker';
import { initColorSets } from './modules/init-color-sets';
import { initDragDrop } from './modules/init-drag-drop';
import { initModals } from './modules/init-modals';

window.addEventListener('DOMContentLoaded', () => {

  initCustomComponents();

  window.addEventListener('load', () => {
    initDragDrop();
    initModals();
    initColorPicker();
    initColorSets();
  });
});
