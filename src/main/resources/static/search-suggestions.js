var searchInput = document.querySelector("input[name='searchText']");
var searchSuggestions = document.getElementById("search-suggestions");

// Используем Map для хранения результатов поиска
var suggestionsMap = new Map();

searchInput.addEventListener("keyup", function () {
    var searchText = searchInput.value;

    if (searchText.trim() === "") {
        searchSuggestions.innerHTML = "";
        searchSuggestions.style.display = "none";
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/searchSuggestions", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var results = JSON.parse(xhr.responseText);
                updateSearchSuggestions(results);
            }
        };
        xhr.send(JSON.stringify(searchText));
    }
});

function updateSearchSuggestions(results) {
    searchSuggestions.innerHTML = "";
    suggestionsMap.clear(); // Очищаем Map перед обновлением

    if (results.length === 0) {
        searchSuggestions.style.display = "none";
    } else {
        searchSuggestions.style.display = "block";
        results.forEach(function (result) {
            var suggestionText = result.title.toLowerCase(); // Преобразование в маленькие буквы

            // Обновляем Map или создаем новую запись
            if (suggestionsMap.has(suggestionText)) {
                suggestionsMap.set(suggestionText, suggestionsMap.get(suggestionText) + 1);
            } else {
                suggestionsMap.set(suggestionText, 1);
            }
        });

        // Сортируем результаты по количеству объявлений (по убыванию)
        var sortedResults = Array.from(suggestionsMap.entries()).sort(function (a, b) {
            return b[1] - a[1];
        });

        // Выводим результаты в отсортированном порядке
        sortedResults.forEach(function (entry) {
            var suggestionText = entry[0];
            var count = entry[1];

            var suggestionDiv = document.createElement("div");
            suggestionDiv.classList.add("search-suggestion");
            suggestionDiv.textContent = suggestionText + " (" + count + ")";

            suggestionDiv.addEventListener("click", function () {
                searchInput.value = suggestionText;
                searchSuggestions.innerHTML = "";
                performSearch(suggestionText); // Выполняем поиск с текстом подсказки
            });

            searchSuggestions.appendChild(suggestionDiv);
        });
    }
}



function performSearch(searchText) {
    // Отправка AJAX-запроса на сервер для выполнения поиска
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/search", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var searchResults = JSON.parse(xhr.responseText);
            updateSearchResults(searchResults); // Обновление результатов поиска
        }
    };
    xhr.send(JSON.stringify(searchText));
}
