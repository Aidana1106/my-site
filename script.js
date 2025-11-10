let currentPage = 1;
const totalPages = 3;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updatePageIndicator();
    
    // Добавляем анимацию для первой страницы
    setTimeout(() => {
        const title = document.querySelector('.title');
        if (title) {
            title.classList.add('animate');
        }
    }, 100);
});

// Переход на следующую страницу
function nextPage() {
    if (currentPage < totalPages) {
        // Скрываем текущую страницу с анимацией
        const currentPageElement = document.getElementById(`page${currentPage}`);
        currentPageElement.style.animation = 'fadeOut 0.4s ease-out';
        
        setTimeout(() => {
            currentPageElement.classList.remove('active');
            currentPageElement.style.animation = '';
            
            // Показываем следующую страницу
            currentPage++;
            const nextPageElement = document.getElementById(`page${currentPage}`);
            nextPageElement.classList.add('active');
            
            // Добавляем анимацию появления элементов
            const elements = nextPageElement.querySelectorAll('h2, .message, .gallery-intro, .gallery-grid, .btn-next');
            elements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    el.style.transition = 'all 0.6s ease-out';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
            
            updatePageIndicator();
            
            // Прокрутка вверх для мобильных устройств
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 400);
    }
}

// Переход на предыдущую страницу (опционально, можно добавить кнопку "Назад")
function prevPage() {
    if (currentPage > 1) {
        const currentPageElement = document.getElementById(`page${currentPage}`);
        currentPageElement.classList.remove('active');
        
        currentPage--;
        const prevPageElement = document.getElementById(`page${currentPage}`);
        prevPageElement.classList.add('active');
        
        updatePageIndicator();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Обновление индикатора страницы
function updatePageIndicator() {
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
}

// Перезапуск поздравления
function restart() {
    // Скрываем текущую страницу
    const currentPageElement = document.getElementById(`page${currentPage}`);
    currentPageElement.classList.remove('active');
    
    // Сбрасываем на первую страницу
    currentPage = 1;
    const firstPageElement = document.getElementById('page1');
    firstPageElement.classList.add('active');
    
    // Сбрасываем позицию кнопки "Нет"
    const btnNo = document.getElementById('btnNo');
    if (btnNo) {
        btnNo.style.position = 'relative';
        btnNo.style.left = 'auto';
        btnNo.style.top = 'auto';
    }
    
    updatePageIndicator();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Поддержка свайпов на мобильных устройствах
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50; // Минимальное расстояние для свайпа
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // Свайп влево - следующая страница
        if (currentPage < totalPages) {
            nextPage();
        }
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        // Свайп вправо - предыдущая страница
        if (currentPage > 1) {
            prevPage();
        }
    }
}

// Добавляем поддержку клавиатуры для навигации
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (currentPage < totalPages) {
            nextPage();
        }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (currentPage > 1) {
            prevPage();
        }
    }
});

// Обработка кнопки "Да"
function handleYesClick() {
    nextPage();
}

// Обработка кнопки "Нет"
function handleNoClick() {
    // Кнопка убегает, но если все же нажали - тоже переходим
    nextPage();
}

// Функция убегания кнопки от мышки
let lastMoveTime = 0;
const moveCooldown = 100; // Минимальная задержка между перемещениями (мс)

function moveButton(e) {
    const btn = document.getElementById('btnNo');
    if (!btn || !btn.closest('.page.active')) return;
    
    const now = Date.now();
    if (now - lastMoveTime < moveCooldown) return;
    lastMoveTime = now;
    
    const container = btn.closest('.content');
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    
    // Позиция центра кнопки
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    
    // Позиция мыши
    const mouseX = e ? e.clientX : btnCenterX;
    const mouseY = e ? e.clientY : btnCenterY;
    
    // Вектор от мыши к кнопке
    const dx = btnCenterX - mouseX;
    const dy = btnCenterY - mouseY;
    
    // Расстояние
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Если мышь близко к кнопке, убегаем
    if (distance < 120 && distance > 0) {
        // Нормализуем вектор и умножаем на расстояние убегания
        const escapeDistance = 180;
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        
        // Новая позиция (убегаем в противоположную сторону от мыши)
        let newX = btnCenterX + normalizedDx * escapeDistance - containerRect.left;
        let newY = btnCenterY + normalizedDy * escapeDistance - containerRect.top;
        
        // Ограничиваем в пределах контейнера
        const maxX = containerRect.width - btn.offsetWidth - 20;
        const maxY = containerRect.height - btn.offsetHeight - 20;
        
        newX = Math.max(20, Math.min(newX, maxX));
        newY = Math.max(20, Math.min(newY, maxY));
        
        // Анимированное перемещение
        btn.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        btn.style.position = 'absolute';
        btn.style.left = newX + 'px';
        btn.style.top = newY + 'px';
    } else if (distance > 200) {
        // Если мышь далеко, возвращаем кнопку в исходное положение
        btn.style.transition = 'all 0.6s ease-out';
        btn.style.position = 'relative';
        btn.style.left = 'auto';
        btn.style.top = 'auto';
    }
}

// Отслеживаем движение мыши и убегаем при приближении
document.addEventListener('mousemove', function(e) {
    const btn = document.getElementById('btnNo');
    if (!btn || !btn.closest('.page.active')) return;
    
    moveButton(e);
});

