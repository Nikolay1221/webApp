document.getElementById("search-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    var searchText = document.querySelector("input[name='searchText']").value;

    try {
        var response = await fetch("/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(searchText),
        });

        if (response.ok) {
            var results = await response.json();
            updateSearchResults(results);

            // Вызов функции для анализа цен
            analyzePrices(results);

            // Создание графика цен
            createPriceChart(results);
        } else {
            console.error("Ошибка при выполнении запроса.");
        }
    } catch (error) {
        console.error("Ошибка: " + error);
    }
});

function updateSearchResults(results) {
    var resultsContainer = document.getElementById("search-results");
    resultsContainer.innerHTML = "";

    if (results.length === 0) {
        resultsContainer.innerHTML = "Нет результатов для отображения.";
    } else {
        results.forEach(function (result) {
            var resultDiv = document.createElement("div");
            resultDiv.classList.add("search-result");

            resultDiv.innerHTML = `
        <h2>${result.title}</h2>
        <p>${result.description}</p>
        <p>Цена: ${result.price}</p>
        <p><a href="${result.url}">Ссылка</a></p>
      `;

            resultsContainer.appendChild(resultDiv);
        });
    }
}

function analyzePrices(results) {
    if (results.length === 0) {
        var priceAnalysisContainer = document.getElementById("price-analysis");
        priceAnalysisContainer.innerHTML = "Нет результатов для анализа.";
        return;
    }

    var prices = results.map(function (result) {
        return parseFloat(result.price);
    });

    // Сортируем цены в порядке возрастания
    prices.sort(function(a, b) {
        return a - b;
    });

    // Функция для вычисления процентной разницы между двумя значениями
    function calculatePercentageDifference(value1, value2) {
        return Math.abs((value1 - value2) / ((value1 + value2) / 2)) * 100;
    }

    // Находим ближайшие значения с разницей в пределах 20%
    var closestPrices = [];
    for (var i = 0; i < prices.length; i++) {
        for (var j = i + 1; j < prices.length; j++) {
            var price1 = prices[i];
            var price2 = prices[j];

            // Проверка на одинаковые цены
            if (price1 === price2) {
                continue;
            }

            var percentageDifference = calculatePercentageDifference(price1, price2);

            if (percentageDifference <= 20) {
                closestPrices.push(price1, price2);
            }
        }
    }

    // Создаем пустой массив для объявлений с минимальной ценой
    var adsWithMinPrice = [];
    // Вычисляем среднюю, минимальную и максимальную цены для ближайших значений
    var minPrice = Math.min(...closestPrices);
    var maxPrice = Math.max(...closestPrices);
    var total = closestPrices.reduce(function (accumulator, currentPrice) {
        return accumulator + currentPrice;
    }, 0);
    var averagePrice = total / closestPrices.length;

    // Получите название устройства из первого результата
    var deviceName = results[0].title;

    // Создаем HTML-код для результатов анализа
    var priceAnalysisHTML = `
         <div>
    <h3>Устройство</h3>
    <p id="device-name">${deviceName}</p>
  </div>
  <div>
    <h3>Средняя цена для ближайших значений с разницей в пределах 20%</h3>
    <p id="average-closest-prices">${averagePrice}</p>
  </div>
  <div>
    <h3>Минимальная цена среди ближайших значений</h3>
    <p id="min-closest-price">${minPrice}</p>
  </div>
  <div>
    <h3>Максимальная цена среди ближайших значений</h3>
    <p id="max-closest-price">${maxPrice}</p>
  </div>
    `;

    // Вставляем результаты анализа в контейнер "price-analysis"
    var priceAnalysisContainer = document.getElementById("price-analysis");
    priceAnalysisContainer.innerHTML = priceAnalysisHTML;

    // Создаем копию исходных результатов
    var filteredResults = results.slice(0);

// Фильтруем объявления с минимальной ценой
    var adsWithMinPrice = [];
    filteredResults.forEach(function (result) {
        var price = parseFloat(result.price);
        if (price === minPrice) {
            adsWithMinPrice.push(result);
        }
    });

// Сортируем объявления по цене в порядке возрастания
    filteredResults.sort(function(a, b) {
        return parseFloat(a.price) - parseFloat(b.price);
    });

// Ищем индекс объявления с минимальной ценой в отсортированном массиве
    var minPriceIndex = filteredResults.findIndex(function(result) {
        return parseFloat(result.price) === minPrice;
    });


// Получаем следующие 3 объявления с более высокой ценой
    var adsWithHigherPrice = filteredResults.slice(minPriceIndex + 1, minPriceIndex + 4);

// Создаем HTML-код для объявлений с минимальной ценой
    var adsWithMinPriceHTML = '<h3>Объявления с минимальной ценой:</h3>';
    adsWithMinPrice.forEach(function (result) {
        adsWithMinPriceHTML += `
    <div class="analyzed-result">
        <h4>${result.title}</h4>
        <p>${result.description}</p>
        <p>Цена: ${result.price}</p>
        <p><a href="${result.url}">Ссылка</a></p>
    </div>
    `;
    });

    // Создаем HTML-код для объявлений с более высокой ценой
    var adsWithHigherPriceHTML = '<h3>Объявления с более высокой ценой:</h3>';
    adsWithHigherPrice.forEach(function (result) {
        adsWithHigherPriceHTML += `
    <div class="analyzed-result">
        <h4>${result.title}</h4>
        <p>${result.description}</p>
        <p>Цена: ${result.price}</p>
        <p><a href="${result.url}">Ссылка</a></p>
    </div>
    `;
    });


// Вставляем результаты анализа объявлений в контейнер "analyzed-results"
    var analyzedResultsContainer = document.getElementById("analyzed-results");
    analyzedResultsContainer.innerHTML = adsWithMinPriceHTML + adsWithHigherPriceHTML;
}





function createPriceChart(results) {
    var chartLabels = results.map(function (result) {
        return result.title;
    });
    var chartData = results.map(function (result) {
        return parseFloat(result.price);
    });

    var ctx = document.getElementById("price-chart").getContext("2d");

    if (window.priceChart) {
        // Если график уже существует, уничтожим его, прежде чем создавать новый.
        window.priceChart.destroy();
    }

    window.priceChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: "Цена",
                    data: chartData,
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                    fill: false,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

