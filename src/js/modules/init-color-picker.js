import Picker from 'vanilla-picker';

let picker;

const initColorPicker = () => {
  const el = document.querySelector('[data-color-picker]');
  const rgbOutput = document.querySelector('[data-color-rgb="rgb"]');
  const rgbInput = document.querySelector('[data-color-rgb="input"]');
  const rInput = document.querySelector('[data-color-rgb="rInput"]');
  const bInput = document.querySelector('[data-color-rgb="gInput"]');
  const gInput = document.querySelector('[data-color-rgb="bInput"]');
  
  // Иницализация пикера
  picker = new Picker({
    parent: el,
    popup: false,
    color: '#fff',
    alpha: false,
  });


  // Слушает события на ввод в RGB инпут, переводит их в массив со строками и скармливает строку с RGB пикеру
  rgbInput.addEventListener('input', (e) => {
    let j = true;

    if (e.target.value > 255) {
      e.target.value = '255';
    }

    const inputs = Array.from(rgbInput.querySelectorAll('[data-color-rgb]'));
    let rgbArr = inputs.map(input => input.value);

    inputs.forEach(input => input.addEventListener('focusout', () => {
      if (e.target.value === '') {
        e.target.value = '0';
        rgbArr.splice(rgbArr.indexOf(''), 1, '0');
        console.log(rgbArr)
        picker.setColor(`rgb(${rgbArr.join(',')})`);
        j = false
      }
    }));

    const inputIsEmpty = rgbArr.some(item => item === '');

    if (inputIsEmpty || !j) {
      return;
    }

    picker.setColor(`rgb(${rgbArr.join(',')})`);
  });


  // Слушатель по скрытой строке, куда выводится цвет в RGB от пикера и затем передаются уже разбитые RGB строки в видимые инпуты
  rgbOutput.addEventListener('change', (e) => {

    const rgb = e.target.value.slice(4).slice(0, -1);
    const rgbArr = rgb.split(',');
    rInput.value = rgbArr[0];
    gInput.value = rgbArr[1];
    bInput.value = rgbArr[2];
  })

  // Слушатель на изменение в пикере, запускает кастомный ивент
  picker.onChange = (color) => {
    rgbOutput.value = color.rgbString;
    rgbOutput.dispatchEvent(new Event('change'));
  }
}

export {initColorPicker, picker}