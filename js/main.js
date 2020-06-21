'use strict';

const registerUserBtn = document.getElementById('register-user');
const usersList = document.getElementById('list');
let json = localStorage.getItem('usersData');

let usersData = JSON.parse(json) || [];

function render() {
  usersList.textContent = '';

  usersData.forEach(function(item) {
    const li = document.createElement('li');

    li.textContent = 'Имя: ' + item.firstName + ', фамилия: ' + item.lastName + ', зарегистрирован: ' + item.regDate;

    usersList.insertAdjacentElement('beforeend', li);
  });
}

// регистрация нового пользователя при клике на кнопку
registerUserBtn.addEventListener('click', function() {
  let newName;
  let newNameArr;
  let newLogin;
  let newPassword;

  // проверка, что введено 2 слова
  do {
  newName = prompt('Введите Имя и Фамилию через пробел').trim();
  newNameArr = newName.split(' ');
  }
  while (newNameArr.length !== 2);

  // проверка, что поле не пустое
  do {
    newLogin = prompt('Введите логин').trim();
  }
  while (newLogin === '');

  // проверка на совпадение логина с уже зарегистрированным
  function checkLogin() {
    usersData.forEach(function(item) {
      if (newLogin === item.login) {
        do {
          newLogin = prompt('Такой логин уже занят. Введите другой логин.').trim();
        }
        while (newLogin === '');

        checkLogin();
      }
    });
  }

  checkLogin();

  // проверка, что поле не пустое
  do {
    newPassword = prompt('Введите пароль').trim();
  }
  while (newPassword === '');

  // вычисление даты регистрации
  let now = new Date();
  let options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

  let newUser = {
    firstName: newNameArr[0],
    lastName: newNameArr[1],
    login: newLogin,
    password: newPassword,
    regDate: now.toLocaleString("ru", options)
  };

  usersData.push(newUser);

  json = JSON.stringify(usersData);
  localStorage.setItem('usersData', json);

  render();
});

render();