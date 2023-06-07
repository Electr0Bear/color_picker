export class RowComponent extends HTMLElement {
  constructor() {
    super();

    this.colorSet = {};
  }

  _generateTemplate() {
    this.rowTemplate = `
      <div class="color-picker__table-cell">
        <div class="color-picker__table-color-example" style="background-color: ${this.colorSet.colorHex}"></div>
      </div>
      <div class="color-picker__table-cell">
        <p class="color-picker__table-text text">${this.colorSet.colorName}</p>
      </div>
      <div class="color-picker__table-cell">
        <p class="color-picker__table-text text">${this.colorSet.colorType}</p>
      </div>
      <div class="color-picker__table-cell">
        <p class="color-picker__table-text text">${this.colorSet.colorHex}</p>
      </div>
      <div class="color-picker__table-cell">
        <button class="btn btn--hover-blue" data-table-btn="change" type="button" aria-label="Редактировать">
          <svg width="20" height="20" aria-hidden="true">
            <use xlink:href="img/sprite.svg#icon-pen"></use>
          </svg> 
        </button>
      </div>
      <div class="color-picker__table-cell">
        <button class="btn btn--hover-sunset" data-table-btn="delete" type="button" aria-label="Удалить">
          <svg width="20" height="20" aria-hidden="true">
            <use xlink:href="img/sprite.svg#icon-bin"></use>
          </svg>
        </button>
      </div>`;

      return this.rowTemplate;
  }

  _getColorSetData() {
    this.colorSet = JSON.parse(this.getAttribute('color-set'));
  }

  _updateTemplate() {
    this.colorSet = JSON.parse(this.getAttribute('color-set'));
    this.innerHTML = this._generateTemplate();
  }

  connectedCallback() {
    this._getColorSetData();

    if (this.innerHTML !== '') {
      return;
    }

    this.insertAdjacentHTML('beforeEnd', this._generateTemplate());
    this.classList.add('color-picker__table-row', 'color-picker__table-grid-layout');
    this.setAttribute('data-table-row', `${this.colorSet.id}`);
    this.addEventListener('updateSet', this._updateTemplate);
  }
}