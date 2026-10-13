document.addEventListener('DOMContentLoaded', () => {
    const ageModal = document.getElementById('age-verification');
    const mainContent = document.getElementById('main-content');
    const ageForm = document.getElementById('age-form');
    const birthDateInput = document.getElementById('birth-date');
    const errorMsg = document.getElementById('age-error-msg');
    const btnLeave = document.getElementById('age-leave');

    // Кнопка отправки формы даты рождения
    if (ageForm) {
        ageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputDate = new Date(birthDateInput.value);
            if (isNaN(inputDate.getTime())) return; // Если дата введена некорректно

            // Вычисляем текущую дату (на дворе 2026 год)
            const today = new Date();
            
            // Вычисляем точный возраст
            let age = today.getFullYear() - inputDate.getFullYear();
            const monthDiff = today.getMonth() - inputDate.getMonth();
            const dayDiff = today.getDate() - inputDate.getDate();

            // Корректируем возраст, если день рождения в текущем году еще не наступил
            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                age--;
            }

            // Строгая проверка на 18 лет (год рождения должен быть 2008 или раньше)
            if (age >= 18) {
                errorMsg.classList.remove('error-text-visible');
                if (ageModal) ageModal.style.display = 'none';
                if (mainContent) mainContent.classList.remove('content-hidden');
                sessionStorage.setItem('ageVerified', 'true');
            } else {
                // Если пользователю нет 18, выводим мигающее предупреждение
                errorMsg.classList.add('error-text-visible');
            }
        });
    }

    // Кнопка "Покинуть сайт"
    if (btnLeave) {
        btnLeave.addEventListener('click', () => {
            window.location.href = "https://google.com";
        });
    }

    // Проверка сохраненной сессии (чтобы окно не всплывало при обновлении страницы)
    if (sessionStorage.getItem('ageVerified') === 'true') {
        if (ageModal) ageModal.style.display = 'none';
        if (mainContent) mainContent.classList.remove('content-hidden');
    }

    // ЛОГИКА ОТКРЫТИЯ И ЗАКРЫТИЯ ЛИСТОВ С ТОВАРАМИ
    const categoryCards = document.querySelectorAll('.category-card');
    const backButtons = document.querySelectorAll('.btn-back');
    const sheets = document.querySelectorAll('.products-sheet');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const categoryType = card.getAttribute('data-category');
            const targetSheet = document.getElementById(`sheet-${categoryType}`);
            if (targetSheet) {
                targetSheet.classList.add('sheet-open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const openSheet = btn.closest('.products-sheet');
            if (openSheet) {
                openSheet.classList.remove('sheet-open');
                document.body.style.overflow = '';
            }
        });
    });

    sheets.forEach(sheet => {
        sheet.addEventListener('click', (e) => {
            if (e.target === sheet) {
                sheet.classList.remove('sheet-open');
                document.body.style.overflow = '';
            }
        });
    });

    // ==========================================
    // РЕЖИМ КОНСТРУКТОРА С АВТОСМЕНОЙ ЦВЕТА СТАТУСА
    // ==========================================
    function loadProductsDynamic() {
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                Object.keys(data).forEach(category => {
                    const sheet = document.getElementById(`sheet-${category}`);
                    if (!sheet) return;
                    
                    const grid = sheet.querySelector('.products-grid');
                    if (!grid) return;

                    grid.innerHTML = '';

                    data[category].forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'product-card';
                        
                        const isAvailable = item.status && item.status.toLowerCase() === 'в наличии';
                        const statusColor = isAvailable ? '#00ffaa' : '#ff0000';
                        const btnText = isAvailable ? 'УЗНАТЬ ЦЕНУ →' : 'ПОД ЗАКАЗ →';

                        const msgText = isAvailable 
                            ? `Привет! Подскажите, пожалуйста, цену на товар: ${item.name}`
                            : `Привет! Можно ли заказать подсистему/жидкость: ${item.name}?`;
                        const encodedText = encodeURIComponent(msgText);
                        const tgOrderUrl = `https://t.me{encodedText}`;

                        card.innerHTML = `
                            <div class="product-badge">${item.badge || 'TOP'}</div>
                            <h4>${item.name}</h4>
                            <p class="prod-desc">${item.desc}</p>
                            <div class="prod-footer">
                                <div class="prod-price" style="font-size: 14px; color: ${statusColor}; text-shadow: none; text-transform: uppercase;">
                                    ${item.status || 'В НАЛИЧИИ'}
                                </div>
                                <a href="${tgOrderUrl}" target="_blank" class="btn-order-tg" style="border-color: ${statusColor}; color: ${statusColor};">
                                    ${btnText}
                                </a>
                            </div>
                        `;
                        grid.appendChild(card);
                    });
                });
            })
            .catch(error => console.error('Ошибка сборки карточек:', error));
    }

    loadProductsDynamic();

    // ==========================================
    // НАДЕЖНЫЙ ПЛАВНЫЙ СКРОЛЛ ДЛЯ КНОПКИ КАТАЛОГА
    // ==========================================
    const btnAction = document.querySelector('.btn-action');
    if (btnAction) {
        btnAction.addEventListener('click', (e) => {
            e.preventDefault();
            const targetID = btnAction.getAttribute('href');
            const targetSection = document.querySelector(targetID);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});
