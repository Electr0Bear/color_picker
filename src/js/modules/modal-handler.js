export class ModalHandler {
  constructor() {
    this.modal = '';
    this.btns = [];
    this.formBtn = '';

    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this._onBtnClick = this._onBtnClick.bind(this);
    this._onEscClick = this._onEscClick.bind(this);
    this._onOverlayClick = this._onOverlayClick.bind(this);
    this.init = this.init.bind(this);
  }

  // Открытие модальных окон
  openModal(modal) {
    modal.classList.add('active');

    window.addEventListener('keydown', (e) => void this._onEscClick(e, modal));
    modal.addEventListener('click', (e) => void this._onOverlayClick(e, modal));
  }

  // Закрытие модальных окон
  closeModal(modal) {
    modal.classList.remove('active');

    window.removeEventListener('keydown', (e) => void this._onEscClick(e, modal));
    modal.removeEventListener('click', (e) => void this._onOverlayClick(e, modal));
  }

  // Закрытие по ESC
  _onEscClick(e, modal) {
    if (e.key === 'Escape') {
      this.closeModal(modal);
    }
  }

  // Закрытие по клику на оверлей
  _onOverlayClick(e, modal) {
    if (e.target === modal) {
      this.closeModal(modal);
    }
  }

  // Обработчик по клику на кнопку с data-modal. Находит модальное окно с аналогичным аттрибутом и открывает его
  _onBtnClick(e) {
    try {
      const modal = e.currentTarget.dataset.modalBtn;
      this.modal = document.querySelector(`[data-modal="${modal}"]`);
  
      if (!this.modal) {return}
      
      this.openModal(this.modal);

    } catch (error) {
      console.log(error)
    }
  }

  init() {
    this.btns = document.querySelectorAll('[data-modal-btn]');

    if (!this.btns.length) {return}

    this.btns.forEach(btn => btn.addEventListener('click', this._onBtnClick));
  }
}