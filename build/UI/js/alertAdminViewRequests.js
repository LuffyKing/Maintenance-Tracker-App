'use strict';

var getElementsByClassName = function getElementsByClassName(modalName, index) {
  return document.getElementsByClassName(modalName)[index].classList;
};

var getModal = function getModal(modalName, index1, index2, operation) {
  if (operation === 'add') {
    getElementsByClassName(modalName, index1).add('displayNone');
    getElementsByClassName('modal', index2).add('displayNone');
  } else {
    getElementsByClassName(modalName, index1).remove('displayNone');
    getElementsByClassName('modal', index2).remove('displayNone');
  }
};

var remove = function remove(modalName) {
  var index1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var index2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  getModal(modalName, index1, index2, 'remove');
};

var add = function add(modalName) {
  var index1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var index2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  getModal(modalName, index1, index2, 'add');
};

var approveDetailBtn = function approveDetailBtn() {
  var modalName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'modal-Box';

  remove(modalName);
};

var del = function del() {
  remove('modal-Box', 1);
};

var resolveBtnNon100 = function resolveBtnNon100() {
  remove('modal-Box', 2);
};

var removeCancel = function removeCancel(modalName) {
  document.getElementById(modalName).classList.add('displayNone');
  getElementsByClassName('modal', 0).add('displayNone');
};

var disapproveCancel = function disapproveCancel() {
  removeCancel('disapproveModal');
};

var resolveCancel = function resolveCancel() {
  removeCancel('resolveModal');
};

var closeModal = function closeModal() {
  add('modal-Box');
};

var modalAction = function modalAction(modalName, requestAction1, requestAction2, message) {
  document.getElementById(modalName).classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
  alertAction(requestAction1, requestAction2, message);
};

var alertAction = function alertAction(requestAction1, requestAction2, message) {
  document.getElementById('alerts').classList.remove('displayNone');
  document.getElementById('alerts').classList.remove(requestAction1);
  document.getElementById('alerts').classList.add(requestAction2);
  document.getElementById('alertMessage').innerHTML = message;
};

var modalDelApprove = function modalDelApprove() {
  var modalName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'approveModal';
  var requestAction1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'requestDisapproved';
  var requestAction2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'requestApproved';
  var message = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '<strong>Success!</strong> The request has been approved!';

  modalAction(modalName, requestAction1, requestAction2, message);
};

var modalDeldisapprove = function modalDeldisapprove() {
  var modalName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'disapproveModal';
  var requestAction1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'requestApproved';
  var requestAction2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'requestDisapproved';
  var message = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'The request has been disapproved!';

  modalAction(modalName, requestAction1, requestAction2, message);
};

var modalDelDelete = function modalDelDelete() {
  var modalName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'deleteRequest';
  var requestAction1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'requestApproved';
  var requestAction2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'requestDisapproved';
  var message = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'The request has been deleted!';

  modalAction(modalName, requestAction1, requestAction2, message);
};

var modalDelResolve = function modalDelResolve() {
  var modalName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'resolveModal';
  var requestAction1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'requestDisapproved';
  var requestAction2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'requestApproved';
  var message = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'The request has been resolved!';

  modalAction(modalName, requestAction1, requestAction2, message);
};

function loginSubmit() {
  var form = document.getElementById('loginForm');
  fetch('/api/v1/auth/login/', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      email: form.elements.email.value,
      password: form.elements.password.value
    })
  }).then(function (response) {
    return response.json();
  }).then(function (loginResult) {
    if (loginResult.status !== 200) {
      alertAction('requestApproved', 'requestDisapproved', loginResult.message);
    } else {
      localStorage.setItem('token', loginResult.token);
      window.location.replace('../UserViewRequests.html');
    }
  }).catch(function (err) {
    return err;
  });
}
function signupSubmit() {
  var form = document.getElementById('signupForm');
  if (form.elements.password !== form.elements.password2) {
    alertAction('requestApproved', 'requestDisapproved', 'Passwords do not match!');
  } else {
    fetch('/api/v1/auth/signup/', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        email: form.elements.email.value,
        password: form.elements.password.value,
        firstName: form.elements.firstName.value,
        lastName: form.elements.lastName.value,
        department: form.elements.department.value,
        jobTitle: form.elements.jobTitle.value

      })
    }).then(function (response) {
      return response.json();
    }).then(function (signupResult) {
      if (signupResult.status !== 200) {
        alertAction('requestApproved', 'requestDisapproved', loginResult.message);
      } else {
        localStorage.setItem('token', signupResult.token);
        window.location.replace('../UserViewRequests.html');
      }
    }).catch(function (err) {
      return err;
    });
  }
}