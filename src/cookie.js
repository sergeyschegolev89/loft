/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('keyup', function() {
    loadCookies();
});

addButton.addEventListener('click', () => {
    document.cookie = `${addNameInput.value}=${addValueInput.value}`;
    // addNameInput.value = '';
    // addValueInput.value = '';
    loadCookies();  
});
listTable.addEventListener('click', (e) => {
    if (e.target.tagName=='BUTTON') {
        delCookie(e.target.previousSibling.previousSibling.innerHTML);
    }
});

function loadCookies() {
    let objCookies = getCookies();

    listTable.innerHTML = '';
    if (document.cookie.length==0) {

        return;
    }
    const fragment = document.createDocumentFragment();

    for (let key in objCookies) {
        if (isMatching(key, filterNameInput.value) || isMatching(objCookies[key], filterNameInput.value)) {
            const tr = document.createElement('TR');
            const tdname = document.createElement('TD');
            const tdvalue = document.createElement('TD');
            const delButton = document.createElement('BUTTON');

            tdname.textContent = key;           
            tdvalue.textContent = objCookies[key];            
            // delButton.addEventListener('click', () => delCookie(key));
            delButton.innerHTML = 'Удалить';           
            tr.appendChild(tdname);
            tr.appendChild(tdvalue);
            tr.appendChild(delButton);
            fragment.appendChild(tr);
        }
    }
    listTable.appendChild(fragment);
}

function delCookie(name) {
    var cookDate = new Date();

    cookDate.setTime(cookDate.getTime()-1);
    document.cookie = name += '=; expires=' + cookDate.toGMTString();
    loadCookies();
}
function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase())!=-1;
}
function getCookies() {
    return document.cookie.split('; ').reduce((prev, current) =>{
        const [name, value] = current.split('=');

        prev[name] = value;

        return prev;
    }, {});
}
loadCookies();