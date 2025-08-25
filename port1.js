// 要素の取得
const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.btn');
const historyList = document.getElementById('history-list');

// 入力・演算状態の管理
let currentInput = '';
let operator = '';
let previousInput = '';
let justCalculated = false;

// クリア
function clear() {
  currentInput = '';
  operator = '';
  previousInput = '';
  display.value = '0';
}

// バックスペース
function backspace() {
  currentInput = currentInput.slice(0, -1);
  display.value = currentInput || '0';
}

// 数字・小数点入力
function handleNumber(num) {
  const MAX_DIGITS = 12;

  if (justCalculated) {
    currentInput = '';
    justCalculated = false;
  }

  if (num === '.' && currentInput.includes('.')) return;
  if (currentInput.replace('.', '').length >= MAX_DIGITS) return;

  if (num === '.' && (currentInput === '' || currentInput === '0')) {
    currentInput = '0.';
  } else if (currentInput === '0' && num !== '.') {
    currentInput = num;
  } else {
    currentInput += num;
  }

  display.value = currentInput;
}

// 演算子入力
function handleOperator(op) {
  if (justCalculated) {
    previousInput = currentInput;
    currentInput = '';
    justCalculated = false;
  }

  if (currentInput === '' && previousInput === '') return;
  if (currentInput === '' && previousInput !== '') {
    operator = op;
    return;
  }

  if (previousInput !== '') calculate();

  operator = op;
  previousInput = currentInput;
  currentInput = '';
}

// 計算
function calculate() {
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  if (isNaN(prev) || isNaN(current)) return;

  let result = 0;
  let expression = `${previousInput} ${operator} ${currentInput}`;

  switch (operator) {
    case '+': result = prev + current; break;
    case '-': result = prev - current; break;
    case '*': result = prev * current; break;
    case '/':
      if (current === 0) {
        display.value = 'Error';
        currentInput = '';
        operator = '';
        previousInput = '';
        return;
      }
      result = prev / current;
      break;
    default: return;
  }

  result = parseFloat(result.toFixed(10));
  addToHistory(expression, result);

  currentInput = result.toString();
  operator = '';
  previousInput = '';
  display.value = currentInput;

  justCalculated = true;
}

// 履歴追加
function addToHistory(expression, result) {
  const li = document.createElement('li');
  li.textContent = `${expression} = ${result}`;
  historyList.prepend(li);

  if (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}

// ボタンクリックイベント
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    if (button.classList.contains('btn-clear')) clear();
    else if (button.classList.contains('btn-backspace')) backspace();
    else if (button.classList.contains('btn-operator')) handleOperator(value);
    else if (button.classList.contains('btn-equal')) calculate();
    else handleNumber(value);
  });
});

// キーボード入力
document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (!isNaN(key) || key === '.') handleNumber(key);
  else if (['+', '-', '*', '/'].includes(key)) handleOperator(key);
  else if (key === 'Enter' || key === '=') {
    event.preventDefault();
    calculate();
  } else if (key === 'Backspace') backspace();
  else if (key === 'Escape') clear();
});
