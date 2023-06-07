export class DragDrop {
  constructor() {
    this.tbody = '';
    this.trows = [];
    this.changeOrder = new Event('changeOrder');

    this._onDragOver = this._onDragOver.bind(this);
    this.init = this.init.bind(this);
  }

  _onDragOver(e) {
    e.preventDefault();

    const activeElement = this.tbody.querySelector('.active');
    const currentElement = e.target.closest('[data-table-row]');

    if (activeElement === currentElement) {return}

    const nextElement = (currentElement === activeElement.nextElementSibling) ?
        currentElement.nextElementSibling :
        currentElement;

    this.tbody.insertBefore(activeElement, nextElement);
  }

  // Отключает события если в таблице одна строка или нет ничего
  unInit() {
    this.trows.forEach(row => row.draggable = false);
    this.tbody.removeEventListener('dragover', this._onDragOver);
  }

  init() {
    try {
      this.tbody = document.querySelector('[data-table-body]');
      this.trows = Array.from(document.querySelectorAll('[data-table-row]'));
  
      if (!this.tbody || this.trows.length <= 1) {
        this.unInit();
        return;
      }
  
      this.trows.forEach(row => row.draggable = true);
  
      this.trows.forEach(row => {
        row.addEventListener('dragstart', ({target}) => target.classList.add('active'));
        row.addEventListener('dragend', ({target}) => target.classList.remove('active'));
        row.addEventListener('drop', () => this.tbody.dispatchEvent(this.changeOrder));
      });
  
      this.tbody.addEventListener('dragover', this._onDragOver);

    } catch (error) {
      console.log(error)
    }
  }
}
