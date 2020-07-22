'use strict';

const input = document.getElementById('select-cities');
const dropdown = document.querySelector('.dropdown');
const listDefault = document.querySelector('.dropdown-lists__list--default');
const listDefaultContent = listDefault.querySelector('.dropdown-lists__col');
const listSelect = document.querySelector('.dropdown-lists__list--select');
const listSelectContent = listSelect.querySelector('.dropdown-lists__col');

let appData;

// получаем данные из json и сохраняем в appData
function getData(url) {
  return fetch(url, {
    method: 'GET',
  });
}

function checkLanguage(data) {
  let language = navigator.language || navigator.userLanguage;
  language = language.substr(0, 2).toUpperCase();
  if (!data[language]) language = 'EN';
  appData = data[language].slice();
}

getData('./db_cities.json')
  .then(response => {
    if (response.status !== 200) {
      throw new Error('status network is not 200');
    }
    const data = response.json();
    return data;
  })
  .then(checkLanguage)
  .catch(error => {
    console.error(error);
  });

// анимация выпадающего списка
function dropdownOpenAnimate(clientHeight) {
  let coin = 0;
  requestAnimationFrame(function dropdownAnim() {
    dropdown.style.height = coin + 'px';
    if (coin < clientHeight) {
      coin += 25;
      requestAnimationFrame(dropdownAnim);
    } else {
      dropdown.style.height = '';
    }
  });
}

// получение списка dropdown-lists__list--default
function renderListDefault() {
  if (!listDefaultContent.textContent.trim()) { // если список пустой, то он создается из appData
    appData.forEach(item => {
      const {country, count, cities} = item;
      const countryBlock = document.createElement('div');
      countryBlock.className = 'dropdown-lists__countryBlock';
      countryBlock.insertAdjacentHTML('afterbegin', `
        <div class="dropdown-lists__total-line">
          <div class="dropdown-lists__country">${country}</div>
          <div class="dropdown-lists__count">${count}</div>
        </div>
      `);

      function compareNumbers(a, b) {
        return b.count - a.count;
      }
      cities.sort(compareNumbers);
      for (let i = 0; i < 3; i++) {
        countryBlock.insertAdjacentHTML('beforeend', `
          <div class="dropdown-lists__line">
            <div class="dropdown-lists__city">${cities[i].name}</div>
            <div class="dropdown-lists__count">${cities[i].count}</div>
          </div>
        `);
      }

      listDefaultContent.append(countryBlock);
    });
    dropdownOpenAnimate(listDefault.clientHeight);
  }
}

// получение списка dropdown-lists__list--select
function listDefaultFunc(event) {
  const target = event.target;
  
  if (target.closest('.dropdown-lists__total-line')) {
    appData.forEach(item => {
      const {country, count, cities} = item;
      
      if (country === target.textContent) {
        listSelectContent.textContent = '';
        const countryBlock = document.createElement('div');
        countryBlock.className = 'dropdown-lists__countryBlock';
        countryBlock.insertAdjacentHTML('afterbegin', `
          <div class="dropdown-lists__total-line">
            <div class="dropdown-lists__country">${country}</div>
            <div class="dropdown-lists__count">${count}</div>
          </div>
        `);

        cities.forEach(elem => {
          countryBlock.insertAdjacentHTML('beforeend', `
            <div class="dropdown-lists__line">
              <div class="dropdown-lists__city">${elem.name}</div>
              <div class="dropdown-lists__count">${elem.count}</div>
            </div>
          `);
        });
        listSelectContent.append(countryBlock);
      }
    });
    listDefault.style.display = 'none';
    listSelect.style.display = 'block';
    dropdownOpenAnimate(listSelect.clientHeight);
  }
}

// функция клика на listSelect
function listSelectFunc(event) {
  const target = event.target;

  if (target.closest('.dropdown-lists__total-line')) {
    listDefault.style.display = '';
    listSelect.style.display = '';
    dropdownOpenAnimate(listDefault.clientHeight);
  }
}

input.addEventListener('click', renderListDefault);
listDefault.addEventListener('click', listDefaultFunc);
listSelect.addEventListener('click', listSelectFunc);