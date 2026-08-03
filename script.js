// ===========================
// TAB SWITCHING
// ===========================
const navBtns = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    tabContents.forEach(tab => {
      tab.classList.remove('active');
      if (tab.id === `tab-${target}`) {
        tab.classList.add('active');
        document.getElementById('menu').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// ===========================
// CUSTOM SELECT LOGIC
// ===========================
const selectWrapper = document.querySelector('.custom-select-wrapper');
const selectTrigger = document.querySelector('.custom-select-trigger');
const selectText = document.querySelector('.custom-select-text');
const customOptions = document.querySelectorAll('.custom-option');

if (selectTrigger) {
  selectTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    selectWrapper.classList.toggle('open');
  });

  customOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.stopPropagation();
      selectText.innerText = this.innerText;
      customOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      selectWrapper.classList.remove('open');
    });
  });

  window.addEventListener('click', function(e) {
    if (!selectWrapper.contains(e.target)) {
      selectWrapper.classList.remove('open');
    }
  });
}

// ===========================
// ПЕРЕСЧЕТ ЦЕНЫ ТОВАРА
// ===========================
function updateCardPrice(card) {
  const activeSizeBtn = card.querySelector('.size-btn.active');
  const basePrice = activeSizeBtn 
    ? parseFloat(activeSizeBtn.dataset.price || 0) 
    : parseFloat(card.dataset.basePrice || 0);
  
  let addonsPrice = 0;
  card.querySelectorAll('.addon-btn.active').forEach(btn => {
    addonsPrice += parseFloat(btn.dataset.price || 0);
  });
  
  const totalPrice = (basePrice + addonsPrice).toFixed(2);
  
  const priceEl = card.querySelector('.card-price');
  if (priceEl) {
    priceEl.innerText = `${totalPrice} р.`;
  }

  const weightEl = card.querySelector('.card-weight');
  if (weightEl && activeSizeBtn && activeSizeBtn.dataset.weight) {
    weightEl.innerText = activeSizeBtn.dataset.weight;
  }
}

// ===========================
// КЛИКИ: РАЗМЕРЫ И ДОБАВКИ
// ===========================
document.addEventListener('click', e => {
  if (e.target.classList.contains('size-btn')) {
    const picker = e.target.closest('.size-picker');
    if (!picker) return;
    
    picker.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    
    const card = e.target.closest('.card');
    if (card) updateCardPrice(card);
  }
  
  if (e.target.classList.contains('addon-btn')) {
    e.target.classList.toggle('active');
    
    const card = e.target.closest('.card');
    if (card) updateCardPrice(card);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach(card => updateCardPrice(card));
});

// ===========================
// ORDER LOGIC (TELEGRAM)
// ===========================
document.addEventListener('click', e => {
  if (e.target.classList.contains('order-btn')) {
    const card = e.target.closest('.card');
    if (!card) return;

    const selectedOption = document.querySelector('.custom-option.selected');
    const telegramUser = selectedOption ? selectedOption.dataset.value : '';
    
    if (!telegramUser || telegramUser.includes('ТВОЙ_ЮЗЕРНЕЙМ')) {
      alert('Пожалуйста, укажите ваши юзернеймы в файле index.html (атрибут data-value в блоке <div class="custom-select-options">)');
    }

    const name = card.querySelector('.card-name')?.innerText.trim() || 'Без названия';
    const price = card.querySelector('.card-price')?.innerText.trim() || 'Не указана';

    let message = `Привет! Хочу заказать:
🌯 Блюдо: ${name}`;

    const activeSizeBtn = card.querySelector('.size-btn.active');
    const staticWeight = card.querySelector('.card-weight');

    if (activeSizeBtn) {
      message += `
📏 Размер: ${activeSizeBtn.innerText.trim()}`;
    } else if (staticWeight) {
      message += `
⚖️ Вес: ${staticWeight.innerText.trim()}`;
    }
    
    const activeAddons = card.querySelectorAll('.addon-btn.active');
    if (activeAddons.length > 0) {
      const addonsTexts = Array.from(activeAddons).map(b => b.innerText.split('(')[0].trim()).join(', ');
      message += `
🧀 Добавки: ${addonsTexts}`;
    }

    message += `
💵 Итоговая цена: ${price}`;
    
    const addressText = selectedOption ? selectedOption.innerText.replace('📍 ', '') : '';
    message += `
📍 Заберу по адресу: ${addressText}`;

    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/${telegramUser}?text=${encodedMessage}`;
    window.open(telegramUrl, '_blank');
  }
});

// ===========================
// HEADER SCROLL SHADOW
// ===========================
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.6)';
    header.style.borderBottomColor = 'transparent';
  } else {
    header.style.boxShadow = 'none';
    header.style.borderBottomColor = 'var(--border)';
  }
}, { passive: true });
