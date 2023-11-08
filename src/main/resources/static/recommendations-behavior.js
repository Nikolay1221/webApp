var suggestionDivs = document.querySelectorAll(".search-suggestion");

// Добавить обработчики событий для наведения и ухода мыши
suggestionDivs.forEach(function (suggestionDiv) {
    suggestionDiv.addEventListener("mouseenter", function () {
        // Логика для активного состояния
        suggestionDiv.classList.add("active-suggestion");
    });

    suggestionDiv.addEventListener("mouseleave", function () {
        // Логика для неактивного состояния
        suggestionDiv.classList.remove("active-suggestion");
    });
});
