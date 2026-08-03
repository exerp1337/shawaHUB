// ===========================
// ИНИЦИАЛИЗАЦИЯ
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initCustomSelect();
  initCardInteractions();
  initHeaderScroll();
  initOrderButtons();

  // Пересчёт цен при загрузке
  document.querySelectorAll('.card').forEach(card => updateCardPrice(card));
});

// ===========================
// TAB SWITCHING
// ===========================
function initTabs() {
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
          const menu = document.getElementById('menu');
          if (menu) menu.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  });
}

// ===========================
// CUSTOM SELECT LOGIC
// ===========================
function initCustomSelect() {
  const selectWrapper = document.querySelector('.custom-select-wrapper');
  if (!selectWrapper) return;

  const selectTrigger = selectWrapper.querySelector('.custom-select-trigger');
  const selectText = selectWrapper.querySelector('.custom-select-text');
  const customOptions = selectWrapper.querySelectorAll('.custom-option');

  selectTrigger.addEventListener('click', e => {
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

  document.addEventListener('click', e => {
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
    // Анимация изменения цены
    priceEl.classList.add('price-bump');
    priceEl.innerText = `${totalPrice} р.`;
    setTimeout(() => priceEl.classList.remove('price-bump'), 300);
  }

  const weightEl = card.querySelector('.card-weight');
  if (weightEl && activeSizeBtn?.dataset.weight) {
    weightEl.innerText = activeSizeBtn.dataset.weight;
  }
}

// ===========================
// КЛИКИ: РАЗМЕРЫ, ДОБАВКИ, ЗАКАЗ
// ===========================
function initCardInteractions() {
  document.addEventListener('click', e => {
    const target = e.target;

    // Переключение размера
    if (target.classList.contains('size-btn')) {
      const picker = target.closest('.size-picker');
      if (!picker) return;
      picker.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      target.classList.add('active');
      const card = target.closest('.card');
      if (card) updateCardPrice(card);
      return;
    }

    // Тогл добавки
    if (target.classList.contains('addon-btn')) {
      target.classList.toggle('active');
      const card = target.closest('.card');
      if (card) updateCardPrice(card);
    }
  });
}

// ===========================
// ORDER LOGIC (TELEGRAM)
// ===========================
function initOrderButtons() {
  document.addEventListener('click', e => {
    if (!e.target.classList.contains('order-btn')) return;

    const card = e.target.closest('.card');
    if (!card) return;

    const selectedOption = document.querySelector('.custom-option.selected');
    const telegramUser = selectedOption?.dataset.value || '';

    if (!telegramUser || telegramUser.includes('ТВОЙ_ЮЗЕРНЕЙМ')) {
      alert('Пожалуйста, укажите ваши юзернеймы в файле index.html (атрибут data-value в блоке .custom-select-options)');
      return;
    }

    const message = buildOrderMessage(card, selectedOption);

    // Анимация кнопки
    const btn = e.target;
    btn.classList.add('order-btn--sent');
    btn.innerText = '✓ Отправлено!';
    setTimeout(() => {
      btn.classList.remove('order-btn--sent');
      btn.innerText = 'Заказать';
    }, 2000);

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://t.me/${telegramUser}?text=${encodedMessage}`, '_blank');
  });
}

function buildOrderMessage(card, selectedOption) {
  const name = card.querySelector('.card-name')?.innerText.trim() || 'Без названия';
  const price = card.querySelector('.card-price')?.innerText.trim() || 'Не указана';
  const activeSizeBtn = card.querySelector('.size-btn.active');
  const staticWeight = card.querySelector('.card-weight');
  const activeAddons = card.querySelectorAll('.addon-btn.active');
  const addressText = selectedOption ? selectedOption.innerText.replace('📍 ', '') : '';

  let message = `Привет! Хочу заказать:\n🌯 Блюдо: ${name}`;

  if (activeSizeBtn) {
    message += `\n📏 Размер: ${activeSizeBtn.innerText.trim()}`;
  } else if (staticWeight) {
    message += `\n⚖️ Вес: ${staticWeight.innerText.trim()}`;
  }

  if (activeAddons.length > 0) {
    const addonsTexts = Array.from(activeAddons)
      .map(b => b.innerText.split('(')[0].trim())
      .join(', ');
    message += `\n🧀 Добавки: ${addonsTexts}`;
  }

  message += `\n💵 Итоговая цена: ${price}`;
  message += `\n📍 Заберу по адресу: ${addressText}`;

  return message;
}

// ===========================
// HEADER SCROLL SHADOW
// ===========================
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.6)';
      header.style.borderBottomColor = 'transparent';
    } else {
      header.style.boxShadow = 'none';
      header.style.borderBottomColor = 'var(--border)';
    }
  }, { passive: true });
}
