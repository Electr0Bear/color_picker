const { RowComponent } = require('./row-component');

export const initCustomComponents = () => {
  customElements.define('row-component', RowComponent);
}
