const getElementsByClassName = (modalName, index) =>
document.getElementsByClassName(modalName)[index].classList;

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

const approveDetailBtn = (modalName = 'modal-Box', requestId, requestTitle) => {
  remove(modalName);
  localStorage.setItem('requestId', requestId);
  localStorage.setItem('requestTitle', requestTitle);
};

const deleteDetailBtn = (modalName = 'modal-Box', requestId, requestTitle) => {
  remove(modalName);
  localStorage.setItem('requestId', requestId);
  localStorage.setItem('requestTitle', requestTitle);
};

const del = (modalName = 'modal-Box', requestId, requestTitle) => {
  remove(modalName, 1);
  localStorage.setItem('requestId', requestId);
  localStorage.setItem('requestTitle', requestTitle);
};

const resolveBtnNon100 = (modalName = 'modal-Box', requestId, requestTitle) => {
  remove(modalName, 2);
  localStorage.setItem('requestId', requestId);
  localStorage.setItem('requestTitle', requestTitle);
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

const routeToMyRequest = () => {
  fetch('/verify', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      authorization: localStorage.token
    }
  }).then(response => ({ status: response.status, jsonObj: response.json() }))
    .then(({ status, jsonObj }) => {
      if (status !== 200) {
        window.location.replace(`${window.location.origin}/SigninPage.html`);
      } else {
        jsonObj.then((result) => {
          if (result.profile === 'User') {
            window.location.replace(`${window.location.origin}/UserViewRequests.html`);
          } else {
            window.location.replace(`${window.location.origin}/requests`);
          }
        });
      }
    });
};

const logout = () => {
  localStorage.setItem('token', '');
};
