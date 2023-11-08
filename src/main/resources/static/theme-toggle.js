const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Загружаем состояние темы и переключателя из localStorage
let currentTheme = localStorage.getItem("theme") || "light-theme";
let isDarkTheme = currentTheme === "dark-theme";

// Применяем текущую тему и состояние переключателя
body.classList.add(currentTheme);
themeToggle.checked = isDarkTheme;

themeToggle.addEventListener("change", function () {
    // Переключение между темами
    if (isDarkTheme) {
        body.classList.remove("dark-theme");
        body.classList.add("light-theme");
        currentTheme = "light-theme";
    } else {
        body.classList.remove("light-theme");
        body.classList.add("dark-theme");
        currentTheme = "dark-theme";
    }

    // Сохраняем текущую тему в localStorage
    localStorage.setItem("theme", currentTheme);

    isDarkTheme = !isDarkTheme;
});
