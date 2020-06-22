'use strict';

const registerUserBtn = document.getElementById('register-user');
const usersList = document.getElementById('list');
const loginBtn = document.getElementById('login');
const username = document.getElementById('username');

let json = localStorage.getItem('usersData');
let usersData = JSON.parse(json) || [];

// генерация списка зарегистрированных пользователей
function render() {
  usersList.textContent = '';

  usersData.forEach(function(item) {
    const li = document.createElement('li');

    li.innerHTML = '<span>Имя: ' + item.firstName + ', фамилия: ' + item.lastName + ', зарегистрирован: ' + item.regDate + '</span>' +
                    '<button class="delete-user-button"><img src="img/delete-icon.svg" alt="delete"></button>';

    usersList.insertAdjacentElement('beforeend', li);

    // событие на кнопку "удалить пользователя"
    const deleteUserBtn = li.querySelector('.delete-user-button');
    deleteUserBtn.addEventListener('click', function() {
      let pos = usersData.indexOf(item);
      usersData.splice(pos, 1);
      render();
    });
  });

  json = JSON.stringify(usersData);
  localStorage.setItem('usersData', json);
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

  render();
});

// авторизация пользователя при клике на кнопку
loginBtn.addEventListener('click', function() {
  let loginName = prompt('Введите логин');
  let loginPassword = prompt('Введите пароль');
  let checkLoginName = false;
  let checkLoginPassword = false;
  let pos;

  /* проверка введенного логина с базой пользователей и если логин найден,
  то только после этого проверяет пароль*/
  usersData.forEach(function(item) {
    if (item.login === loginName) {
      checkLoginName = true;
      pos = usersData.indexOf(item);

      if (item.password === loginPassword) {
        checkLoginPassword = true;
      }
    }
  });

  if (checkLoginName && checkLoginPassword) {
    username.textContent = usersData[pos].firstName;
  } else if (!checkLoginName) {
    alert('Пользователь не найден');
    return;
  } else {
    alert('Неверный пароль');
    return;
  }
});

render();