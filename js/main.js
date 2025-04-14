let currentLanguage = 'ru';

// Функція для зміни мови
function changeLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'TITLE') {
                element.textContent = translations[lang][key] + ' - Battlefield 2 Mod';
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Оновлення активного стану кнопок
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    // Зберігаємо вибрану мову
    localStorage.setItem('language', lang);
}

// Галерея зображень
const galleryImages = [
    {
        src: '/home/media/screen186.jpg',
        altKey: 'screenshot1'
    },
    {
        src: '/home/media/screen092.jpg',
        altKey: 'screenshot2'
    },
    {
        src: '/home/media/screen127.jpg',
        altKey: 'screenshot3'
    }
];

function initGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    if (!galleryContainer) return;

    // Очищаємо контейнер
    galleryContainer.innerHTML = '';
    
    // Додаємо зображення
    galleryImages.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = translations[currentLanguage][image.altKey] || 'Screenshot';
        
        galleryItem.appendChild(img);
        galleryContainer.appendChild(galleryItem);
    });
}

// Перевірка статусу сервера
async function checkServerStatus() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    const playersOnline = document.getElementById('players-online');
    const serverPing = document.getElementById('server-ping');
    const currentMap = document.getElementById('current-map');
    
    if (!statusDot || !statusText || !playersOnline) return;

    try {
        const response = await fetch('https://api.bflist.io/bf2/v1/servers/37.230.210.130:20567');
        const data = await response.json();
        
        // Сервер вважається онлайн, якщо отримали відповідь
        statusDot.classList.remove('offline');
        statusDot.classList.add('online');
        statusText.textContent = translations[currentLanguage].online;
        
        // Оновлюємо інформацію про гравців
        playersOnline.textContent = `${data.numPlayers}/${data.maxPlayers}`;
        
        // Оновлюємо інформацію про поточну карту
        if (currentMap) {
            currentMap.textContent = data.mapName;
        }
    } catch (error) {
        statusDot.classList.remove('online');
        statusDot.classList.add('offline');
        statusText.textContent = translations[currentLanguage].offline;
        playersOnline.textContent = '0/0';
        if (currentMap) {
            currentMap.textContent = '-';
        }
        console.error('Error checking server status:', error);
    }
}

// Плавна прокрутка для навігації
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// Функція для завантаження файлів
function handleDownload(type) {
    const downloads = {
        launcher: {
            url: '/home/downloads/RW3_Launcher.exe',
            name: 'RW3_Launcher.exe'
        },
        full: {
            url: '/home/downloads/RW3_Full.zip',
            name: 'RW3_Full.zip'
        }
    };

    const download = downloads[type];
    if (!download) return;

    // Створюємо тимчасове посилання для завантаження
    const link = document.createElement('a');
    link.href = download.url;
    link.download = download.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    // Перевіряємо збережену мову
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
        changeLanguage(savedLanguage);
    } else {
        changeLanguage('ru'); // Мова за замовчуванням
    }

    // Додаємо обробники подій для кнопок перемикання мови
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (translations[lang]) {
                changeLanguage(lang);
            }
        });
    });

    // Ініціалізуємо інші функції
    initGallery();
    checkServerStatus();
    
    // Оновлення статусу сервера кожні 5 хвилин
    setInterval(checkServerStatus, 300000);

    // Додаємо обробники для кнопок завантаження
    document.querySelectorAll('.download-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const type = option.getAttribute('data-type');
            handleDownload(type);
        });
    });

    // Оновлена реалізація галереї
    const galleryContainer = document.querySelector('.gallery-container');
    if (!galleryContainer) return;

    const screenshots = [
        'screen186.jpg', 'screen092.jpg', 'screen127.jpg', 'screen041.jpg',
        'screen040.jpg', 'screen184.jpg', 'screen164.jpg', 'screen012.jpg',
        'screen024.jpg', 'screen026.jpg', 'screen032.jpg', 'screen079.jpg',
        'screen113.jpg', 'screen142.jpg', 'screen042.jpg', 'screen054.jpg'
    ];

    // Очищаємо контейнер
    galleryContainer.innerHTML = '';

    screenshots.forEach(screenshot => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = `/home/media/${screenshot}`;
        img.alt = 'Real War 3 Screenshot';
        img.loading = 'lazy';
        
        galleryItem.appendChild(img);
        galleryContainer.appendChild(galleryItem);
        
        // Додаємо обробник для повноекранного перегляду
        galleryItem.addEventListener('click', () => {
            const fullscreenContainer = document.createElement('div');
            fullscreenContainer.className = 'fullscreen-gallery';
            
            const fullImg = document.createElement('img');
            fullImg.src = img.src;
            fullImg.alt = img.alt;
            
            fullscreenContainer.appendChild(fullImg);
            document.body.appendChild(fullscreenContainer);
            
            fullscreenContainer.addEventListener('click', () => {
                fullscreenContainer.remove();
            });
        });
    });

    // Add click handlers for error items
    document.querySelectorAll('.error-item').forEach(item => {
        item.addEventListener('click', () => {
            // Close all other items
            document.querySelectorAll('.error-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('expanded')) {
                    otherItem.classList.remove('expanded');
                }
            });
            // Toggle current item
            item.classList.toggle('expanded');
        });
    });

    // Download modals
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadModal = document.getElementById('downloadModal');
    const launcherModal = document.getElementById('launcherModal');
    const fullVersionModal = document.getElementById('fullVersionModal');
    const launcherBtn = document.getElementById('launcherBtn');
    const fullVersionBtn = document.getElementById('fullVersionBtn');
    const proceedLauncherBtn = document.getElementById('proceedLauncherBtn');
    const proceedFullVersionBtn = document.getElementById('proceedFullVersionBtn');
    const confirmLauncherBtn = document.getElementById('confirmLauncherBtn');
    const confirmFullVersionBtn = document.getElementById('confirmFullVersionBtn');

    // URLs for downloads (Google Drive links)
    const launcherUrl = 'https://drive.google.com/file/d/1Is2Sn74fjr50ybb0ieoX8P9yIpE1LWLC/view?usp=sharing';
    const fullVersionUrl = 'https://drive.google.com/drive/folders/1VQrQQyfAvUEyaseRcxL0cC56gc3i0Wuf?usp=sharing';

    // Close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            downloadModal.style.display = 'none';
            launcherModal.style.display = 'none';
            fullVersionModal.style.display = 'none';
        });
    });

    // Click outside to close
    window.addEventListener('click', (e) => {
        if (e.target === downloadModal) downloadModal.style.display = 'none';
        if (e.target === launcherModal) launcherModal.style.display = 'none';
        if (e.target === fullVersionModal) fullVersionModal.style.display = 'none';
    });

    // Show main download modal
    downloadBtn.addEventListener('click', () => {
        downloadModal.style.display = 'block';
    });

    // Show launcher instructions
    launcherBtn.addEventListener('click', (e) => {
        e.preventDefault();
        downloadModal.style.display = 'none';
        launcherModal.style.display = 'block';
        proceedLauncherBtn.style.display = 'none';
        confirmLauncherBtn.style.display = 'block';
    });

    // Show full version instructions
    fullVersionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        downloadModal.style.display = 'none';
        fullVersionModal.style.display = 'block';
        proceedFullVersionBtn.style.display = 'none';
        confirmFullVersionBtn.style.display = 'block';
    });

    // Confirm launcher instructions read
    confirmLauncherBtn.addEventListener('click', () => {
        confirmLauncherBtn.style.display = 'none';
        proceedLauncherBtn.style.display = 'block';
    });

    // Confirm full version instructions read
    confirmFullVersionBtn.addEventListener('click', () => {
        confirmFullVersionBtn.style.display = 'none';
        proceedFullVersionBtn.style.display = 'block';
    });

    // Proceed to launcher download
    proceedLauncherBtn.addEventListener('click', () => {
        window.open(launcherUrl, '_blank');
        launcherModal.style.display = 'none';
    });

    // Proceed to full version download
    proceedFullVersionBtn.addEventListener('click', () => {
        window.open(fullVersionUrl, '_blank');
        fullVersionModal.style.display = 'none';
    });

    // Prevent modal from closing when clicking inside modal content
    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}); 