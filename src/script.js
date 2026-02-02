// Обновление года в футере
document.getElementById('year').textContent = new Date().getFullYear();


// Анимация появления элементов при скролле
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // перестаем следить за элементом
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));


// Генерация падающих цветочков
const sakuraContainer = document.querySelector('.sakura');

function createFlower() {
    const flower = document.createElement('span');
    flower.style.left = Math.random() * 100 + 'vw';
    flower.style.animationDuration = 5 + Math.random() * 5 + 's';
    flower.style.opacity = Math.random();
    flower.style.transform = `scale(${0.5 + Math.random()})`;
    sakuraContainer.appendChild(flower);

    setTimeout(() => {
        flower.remove();
    }, 10000);
}

// Создаем новые цветочки каждые 500мс
setInterval(createFlower, 500);

// Обработка формы обратной связи
const form = document.getElementById("feedback-form");
const successMessage = document.getElementById("success-message");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = new FormData(form);
        const submitButton = form.querySelector("button[type='submit']");
        const originalText = submitButton.textContent;

        submitButton.disabled = true;
        submitButton.textContent = "Отправка...";

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { Accept: "application/json" },
            });

            if (response.ok) {
                form.reset();
                successMessage.style.display = "block";
                setTimeout(() => {
                    successMessage.style.display = "none";
                }, 4000);
            } else {
                alert("⚠️ Ошибка при отправке. Попробуйте позже.");
            }
        } catch (error) {
            alert("⚠️ Не удалось отправить сообщение. Проверьте интернет.");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// Projects Controls

// Получаем элементы
const searchInput = document.getElementById('project-search');
const filters = document.querySelectorAll('.filters input[type="checkbox"]');
const gridBtn = document.getElementById('grid-view');
const listBtn = document.getElementById('list-view');
const projectsList = document.querySelector('.projects__list');
const projects = Array.from(projectsList.children);

// Создаём сообщение, если нет результатов
let noResults = document.createElement('div');
noResults.className = 'no-results';
noResults.textContent = 'Нет проектов, соответствующих запросу.';
projectsList.parentNode.appendChild(noResults);
noResults.style.display = 'none';

// Функция обновления списка проектов
function updateProjects() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const activeFilters = Array.from(filters)
        .filter(f => f.checked)
        .map(f => f.value.toLowerCase());

    let visibleCount = 0;

    projects.forEach(project => {
        const title = project.querySelector('.project__title').textContent.toLowerCase();
        const desc = project.querySelector('.project__desc').textContent.toLowerCase();
        const roleText = project
            .querySelector('.project__role')
            .textContent.toLowerCase()
            .replace('роль:', '')
            .trim();

        // Проверка поиска
        const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);

        // Проверка фильтров с учётом частичных совпадений
        const matchesFilter =
            activeFilters.length === 0 ||
            activeFilters.some(f => roleText.includes(f));

        const isVisible = matchesSearch && matchesFilter;

        project.style.display = isVisible ? 'block' : 'none';
        if (isVisible) visibleCount++;
    });

    // Если ничего не найдено
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

// Обработчики ввода
searchInput.addEventListener('input', updateProjects);
filters.forEach(f => f.addEventListener('change', updateProjects));

// Переключение вида
gridBtn.addEventListener('click', () => {
    projectsList.classList.remove('list-view');
    projectsList.classList.add('grid-view');
    gridBtn.classList.add('active');
    gridBtn.setAttribute('aria-pressed', 'true');
    listBtn.classList.remove('active');
    listBtn.setAttribute('aria-pressed', 'false');
});

listBtn.addEventListener('click', () => {
    projectsList.classList.remove('grid-view');
    projectsList.classList.add('list-view');
    listBtn.classList.add('active');
    listBtn.setAttribute('aria-pressed', 'true');
    gridBtn.classList.remove('active');
    gridBtn.setAttribute('aria-pressed', 'false');
});

// Начальное состояние
projectsList.classList.add('grid-view');

document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const themeBtn = document.getElementById("theme-toggle");
    const langBtn = document.getElementById("lang-toggle");

    const savedTheme = localStorage.getItem("theme") || "light";
    const savedLang = localStorage.getItem("lang") || "ru";

    html.setAttribute("data-theme", savedTheme);
    updateThemeButton(savedTheme);

    setLanguage(savedLang);
    updateLangButton(savedLang);

    themeBtn.addEventListener("click", () => {
        const current = html.getAttribute("data-theme");
        const next = current === "light" ? "dark" : "light";
        html.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        updateThemeButton(next);
    });

    langBtn.addEventListener("click", () => {
        const current = localStorage.getItem("lang") || "ru";
        const next = current === "ru" ? "en" : "ru";
        setLanguage(next);
        localStorage.setItem("lang", next);
        updateLangButton(next);
    });

    function updateThemeButton(theme) {
        themeBtn.setAttribute("aria-pressed", theme === "dark");
        themeBtn.textContent = theme === "dark" ? "🌙 Dark" : "🌞 Light";
    }

    function updateLangButton(lang) {
        langBtn.setAttribute("aria-pressed", lang === "en");
        langBtn.textContent = lang === "en" ? "EN" : "RU";
    }

    function setLanguage(lang) {
        const translations = {
            ru: {
                "hero-name": "Юкина Вероника",
                "hero-role": "Frontend-разработчик",
                "hero-contact": "Связаться со мной",
                "about-title": "Обо мне",
                "about-text":
                    "Я студентка 2-го курса Высшей школы экономики, обучаюсь по направлению «Дизайн и разработка информационных продуктов». Сейчас я только начинаю свой путь в этой сфере, но очень мотивирована учиться новому и развивать свои навыки.",
                "skills-title": "Навыки",
                "education-title": "Образование",
                "school-item": "2012 – 2024: Школа №1245, Москва",
                "university-item": "2024 – … : Высшая школа экономики, направление «Дизайн и разработка информационных продуктов»",
                "projects-title": "Проекты",
                "project1-role": "Роль: Frontend",
                "project1-desc": "Учебный проект - сайт-портфолио с адаптивной версткой и анимациями.",
                "project2-role": "Роль: UX / Frontend",
                "project2-desc": "Прототип сервиса в Figma.",
                "view-project": "Смотреть проект",
                "no-results": "Нет проектов, соответствующих запросу.",
                "contacts-title": "Контакты",
                "form-name": "Имя",
                "form-email": "Email",
                "form-message": "Сообщение",
                "form-submit": "Отправить",
                "form-success": "Сообщение успешно отправлено!",
                "ux-title": "UX-анализ",
                "ux-button": "📄 UX-анализ (PDF)",
                "search-placeholder": "Поиск по проектам...",
                "view-grid": "Карточки",
                "view-list": "Список",
                "footer-name": "Юкина Вероника"
            },
            en: {
                "hero-name": "Veronika Yukina",
                "hero-role": "Frontend Developer",
                "hero-contact": "Contact Me",
                "about-title": "About Me",
                "about-text":
                    "I am a 2nd-year student at the Higher School of Economics, studying Design and Development of Information Products. I am just starting my journey in this field but highly motivated to learn and grow.",
                "skills-title": "Skills",
                "education-title": "Education",
                "school-item": "2012 – 2024: School No. 1245, Moscow",
                "university-item": "2024 – … : Higher School of Economics, program 'Design and Development of Information Products'",
                "projects-title": "Projects",
                "project1-role": "Role: Frontend",
                "project1-desc": "A study project — portfolio website with adaptive layout and animations.",
                "project2-role": "Role: UX / Frontend",
                "project2-desc": "A service prototype in Figma.",
                "view-project": "View Project",
                "no-results": "No matching projects found.",
                "contacts-title": "Contacts",
                "form-name": "Name",
                "form-email": "Email",
                "form-message": "Message",
                "form-submit": "Send",
                "form-success": "Message sent successfully!",
                "ux-title": "UX Analysis",
                "ux-button": "📄 UX Analysis (PDF)",
                "search-placeholder": "Search projects...",
                "view-grid": "Grid",
                "view-list": "List",
                "footer-name": "Yukina Veronika"
            },
        };

        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.getAttribute("data-i18n");
            el.textContent = translations[lang][key];
        });


        document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
            const key = el.getAttribute("data-i18n-placeholder");
            el.setAttribute("placeholder", translations[lang][key]);
        });
    }
});


window.addEventListener("scroll", () => {
    const progressBar = document.getElementById("progress-bar");
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
});

