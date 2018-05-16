/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    let result = fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
        .then(function(response) {
            if (response.status !== 200) {  
                console.log('Looks like there was a problem. Status Code: ' + response.status); 

                return Promise.reject();  
            }
            loadingBlock.style.display = 'none';
            filterBlock.style.display = 'block';

            return response.json();
        })
        .then(function(cities) {
            cities.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0) ); 

            return cities;
        })

        .catch(function(ex) {
            loadingBlock.style.display = 'none';
            errorBlock.style.display = 'block';
            console.log('failed', ex)
        });

    return result;
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase())!=-1;
}

const errorBlock = document.createElement('div');

errorBlock.textContent = 'Не удалось загрузить города';
errorBlock.style.display = 'none';
homeworkContainer.appendChild(errorBlock);
errorBlock.appendChild(document.createElement('br'));
const reloadButton = document.createElement('button');

reloadButton.textContent = 'Повторить';
errorBlock.appendChild(reloadButton);
reloadButton.addEventListener('click', function() {
    loadTowns();
    loadingBlock.style.display = 'block';
    errorBlock.style.display = 'none';
});

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

const result = loadTowns();

function createCity(city) {
    const div = document.createElement('div');

    div.textContent = city.name;

    return div;
}
result.then(function(citiesList) {
    filterInput.addEventListener('keyup', function() {  
        const fragment = document.createDocumentFragment();

        filterResult.innerHTML = '';
        if (filterInput.value) {
            citiesList.forEach((city) => {
                if (isMatching(city.name, filterInput.value)) {
                    fragment.appendChild(createCity(city));                  
                }
            });           
        }
        filterResult.appendChild(fragment);
    });
});

export {
    loadTowns,
    isMatching
};
