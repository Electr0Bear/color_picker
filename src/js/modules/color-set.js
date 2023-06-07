import { picker } from "./init-color-picker";
import { dragDrop } from "./init-drag-drop";
import { modals } from "./init-modals";

export class ColorSet {
  constructor() {
    this.modal = '';
    this.form = '';
    this.colorSets = [];
    this.colorSetData = {
      id: '',
      colorName: '',
      colorType: '',
      colorHex: '',
    };

    this.tbody = '';
    this.saveSetsBtn = '';
    this.deleteSetsBtn = '';
    this.addColorBtn = '';
    this.formBtn = '';

    this.onFormAddColor = this.onFormAddColor.bind(this);
    this.onFormChangeColor = this.onFormChangeColor.bind(this);
    this.addColorSet = this.addColorSet.bind(this);
    this.changeColorSet = this.changeColorSet.bind(this);
    this.saveColorSets = this.saveColorSets.bind(this);
    this.deleteColorSet = this.deleteColorSet.bind(this);
    this.loadColorSets = this.loadColorSets.bind(this);
    this.onOrderChange = this.onOrderChange.bind(this);
    this.onAddColorClick = this.onAddColorClick.bind(this);
    this.onDeleteColorClick = this.onDeleteColorClick.bind(this);
    this.onChangeColorClick = this.onChangeColorClick.bind(this);
    this.init = this.init.bind(this);
  }

  // Добавление нового цвета в таблицу
  onFormAddColor(e) {
    const formData = new FormData(this.form);

    this.colorSetData = {
      id: Date.now(),
      colorName: formData.get("color-name"),
      colorType: formData.get("color-type"),
      colorHex: this.form.querySelector('.picker_editor input').value,
    }

    modals.closeModal(this.modal);
    this.addColorSet(this.colorSetData);
    this.colorSets.push(this.colorSetData);
    this.form.reset();
  }

  // Изменение существующей сроки в таблице
  onFormChangeColor(e) {
    const formData = new FormData(this.form);

    const set = this.colorSets.find(set => set.id.toString() === this.colorSetData.id);
    const index = this.colorSets.indexOf(set);

    this.colorSets[index].colorName = formData.get("color-name");
    this.colorSets[index].colorType = formData.get("color-type");
    this.colorSets[index].colorHex = this.form.querySelector('.picker_editor input').value;

    this.changeColorSet(this.colorSets[index])
    modals.closeModal(this.modal);
    this.form.reset();
  }

  // Добавляет новую строку
  addColorSet(colorSet) {
    const trow = document.createElement('row-component');
    trow.setAttribute('color-set', `${JSON.stringify(colorSet)}`);
    this.tbody.appendChild(trow);

    dragDrop.init();
  }

  // Изменяет сушествующую строку
  changeColorSet(colorSet) {
    this.tbody.querySelector(`[data-table-row="${colorSet.id}"]`).setAttribute('color-set', `${JSON.stringify(colorSet)}`);
    this.tbody.querySelector(`[data-table-row="${colorSet.id}"]`).dispatchEvent(new Event('updateSet'));
  }

  // Сохраняет набор цветов в localStorage
  saveColorSets() {
    localStorage.setItem('colorSets', JSON.stringify(this.colorSets));
  }

  // Загружает набор цветов из localStorage
  loadColorSets() {
    this.colorSets = localStorage.getItem('colorSets') ? JSON.parse(localStorage.getItem('colorSets')) : [];

    if (this.colorSets.length) {
      this.colorSets.forEach(set => this.addColorSet(set));
    }
  }

  // Удаляет наборы из localStorage и очищает таблицу
  deleteColorSet() {
    localStorage.removeItem("colorSets");
    this.tbody.innerHTML = '';

    if (this.tbody.querySelectorAll('[data-table-row]').length <= 1) {
      dragDrop.unInit();
    }
  }

  // Отслеживает изменение порядка строк в таблице и пересобирает порядок в локальном файле с данными
  onOrderChange() {
    const trows = this.tbody.querySelectorAll('[data-table-row]');
    let orderedColorSets = [];
    trows.forEach(row => {
      const element = this.colorSets.find(set => row.dataset.tableRow === set.id.toString());
      const eltIsDuplicate = orderedColorSets.find(elt => elt.id === element.id);
      if (!eltIsDuplicate) {
        orderedColorSets.push(element);
      }
    });

    this.colorSets = orderedColorSets;
  }

  // По клику на сабмит кнопку в модальном окне запускает кастомные события на добавление новой строки или на изменение существующей
  onFormBtnClick(e) {
    e.preventDefault();

    if (e.target.dataset.formBtn === 'add') {
      this.form.dispatchEvent(new Event('addColor'));
    }
    if (e.target.dataset.formBtn === 'change') {
      this.form.dispatchEvent(new Event('changeColor'));
    }
  }

  // Колбек по клику на кнопку Добавить цвета
  onAddColorClick() {
    this.formBtn.dataset.formBtn = 'add';
    this.formBtn.innerText = 'Добавить';

    picker.setColor('#fff');
  }

  // Удаляет одну строку из таблицы
  onDeleteColorClick({target}) {
    if (!target.closest('[data-table-btn="delete"]')) {return}

    const trow = target.closest('[data-table-row]');
    this.tbody.removeChild(trow);

    const el = this.colorSets.find(set => trow.dataset.colorSet === set.id.toString());
    this.colorSets.splice(this.colorSets.indexOf(el), 1);

    if (this.tbody.querySelectorAll('[data-table-row]').length <= 1) {
      dragDrop.unInit();
    }
  }

  // Колбек по клику на кнопу редактировать
  onChangeColorClick({target}) {
    if (!target.closest('[data-table-btn="change"]')) {return}

    modals.openModal(this.modal);
    this.formBtn.dataset.formBtn = 'change';
    this.formBtn.innerText = 'Изменить';

    const id = target.closest('[data-table-row]').dataset.tableRow;
    const set = this.colorSets.find(set => set.id.toString() === id);

    this.form.querySelector('[data-color-name]').value = set.colorName;
    this.form.querySelector('[data-color-type]').value = set.colorType;

    picker.setColor(set.colorHex);

    this.colorSetData = {
      id: id,
      colorName: set.colorName,
      colorType: set.colorType,
      colorHex: set.colorHex,
    }
  }

  init() {
    try {
      this.tbody = document.querySelector('[data-table-body]');
      this.modal = document.querySelector('[data-modal="color-picker"]');
      this.addColorBtn = document.querySelector('[data-modal-btn="color-picker"]');
      this.form = this.modal.querySelector('form');
      this.formBtn = this.form.querySelector('[data-form-btn]');
      this.saveSetsBtn = document.querySelector('[data-color-sets="save"]');
      this.deleteSetsBtn = document.querySelector('[data-color-sets="delete"]');
      
      this.loadColorSets();

      this.addColorBtn.addEventListener('click', this.onAddColorClick);
      this.formBtn.addEventListener('click', this.onFormBtnClick);
      this.form.addEventListener('addColor', this.onFormAddColor);
      this.form.addEventListener('changeColor', this.onFormChangeColor);
      this.saveSetsBtn.addEventListener('click', this.saveColorSets);
      this.deleteSetsBtn.addEventListener('click', this.deleteColorSet);
      this.tbody.addEventListener('changeOrder', this.onOrderChange);
      this.tbody.addEventListener('click', this.onDeleteColorClick);
      this.tbody.addEventListener('click', this.onChangeColorClick);

    } catch (error) {
      console.log(error)
    }
  }
}
