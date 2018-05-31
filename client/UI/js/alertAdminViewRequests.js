const getElementsByClassName = (modalName, index) => {
  return document.getElementsByClassName(modalName)[index].classList;
};

const getModal = (modalName, index1, index2, operation) => {
  if (operation === 'add') {
    getElementsByClassName(modalName, index1).add('displayNone');
    getElementsByClassName('modal', index2).add('displayNone');
  } else {
    getElementsByClassName(modalName, index1).remove('displayNone');
    getElementsByClassName('modal', index2).remove('displayNone');
  }
};

const remove = (modalName, index1 = 0, index2 = 0) => {
  getModal(modalName, index1, index2, 'remove');
};

const add = (modalName, index1 = 0, index2 = 0) => {
  getModal(modalName, index1, index2, 'add');
};

const  approveDetailBtn = (modalName = 'modal-Box') => {
  remove(modalName)
};

const del = () => {
  remove('modal-Box', 1);
};

const resolveBtnNon100 = () => {
  remove('modal-Box', 2);
};

const removeCancel = (modalName) => {
  document.getElementById(modalName).classList.add('displayNone');
  getElementsByClassName('modal', 0).add('displayNone');
};

const disapproveCancel = () => {
  removeCancel('disapproveModal');
};

const resolveCancel = () => {
  removeCancel('resolveModal');
};

const closeModal = () => {
  add('modal-Box');
};

const modalAction = (modalName, requestAction1, requestAction2, message) => {
  document.getElementById(modalName).classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
  alertAction(requestAction1, requestAction2, message);
}

const alertAction = (requestAction1, requestAction2, message) => {
  document.getElementById('alerts').classList.remove('displayNone');
  document.getElementById('alerts').classList.remove(requestAction1);
  document.getElementById('alerts').classList.add(requestAction2);
  document.getElementById('alertMessage').innerHTML = message;
}

const modalDelApprove = (
  modalName = 'approveModal', requestAction1 = 'requestDisapproved',
  requestAction2 = 'requestApproved',
  message = '<strong>Success!</strong> The request has been approved!'
) => {
  modalAction(modalName, requestAction1, requestAction2, message);
};

const modalDeldisapprove = (
  modalName = 'disapproveModal',
  requestAction1 = 'requestApproved',
  requestAction2 = 'requestDisapproved',
  message = 'The request has been disapproved!'
) => {
  modalAction(modalName, requestAction1, requestAction2, message);
};

const modalDelDelete = (
  modalName = 'deleteRequest',
  requestAction1 = 'requestApproved',
  requestAction2 = 'requestDisapproved',
  message = 'The request has been deleted!'
) => {
  modalAction(modalName, requestAction1, requestAction2, message);
};

const modalDelResolve = (
  modalName = 'resolveModal',
  requestAction1 = 'requestDisapproved',
  requestAction2 = 'requestApproved',
  message = 'The request has been resolved!'
) => {
  modalAction(modalName, requestAction1, requestAction2, message);
};

function loginSubmit (){
  const form =  document.getElementById('loginForm');
  fetch('/api/v1/auth/login/', {
    method: 'POST',
    headers: new Headers({
      authorization: localStorage.getItem('token'),
     'Content-Type': 'application/json'
   }),
    body: JSON.stringify({
      email: form.elements.email.value,
      password: form.elements.password.value
    })
  })
    .then(response => response.json()).then((loginResult) => {
      if (loginResult.status !== 200) {
        alertAction('requestApproved', 'requestDisapproved', loginResult.message);
      } else {
        localStorage.setItem('token', loginResult.token);
        window.location.replace('../UserViewRequests.html');
      }
    })
    .catch(err => err);
};
