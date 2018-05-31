const getModal = (modalName, index1, index2, operation) => {
  if (operation === 'add') {
    document.getElementsByClassName(modalName)[index1].classList.add('displayNone');
    document.getElementsByClassName('modal')[index2].classList.add('displayNone');
  } else {
    document.getElementsByClassName(modalName)[index1].classList.remove('displayNone');
    document.getElementsByClassName('modal')[index2].classList.remove('displayNone');
  }
}

const remove = (modalName, index1 = 0, index2 = 0) => {
  getModal(modalName, index1, index2, 'remove');
};

const add = (modalName, index1 = 0, index2 = 0) => {
  getModal(modalName, index1, index2, 'add');
};

const approveDetailBtn = (modalName = 'modalBox') => {
  remove(modalName)
};

const del = () => {
  remove('modalBox', 1);
};

const resolveBtnNon100 = () => {
  remove('modalBox', 2);
};

const removeCancel = (modalName) => {
  document.getElementById(modalName).classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
};

const disapproveCancel = () => {
  removeCancel('disapproveModal');
};

const resolveCancel = () => {
  removeCancel('resolveModal');
};

const closeModal = () => {
  add('modalBox');
};

document.getElementById('alertClose').addEventListener(
  'click',
() => {
    document.getElementById('alerts').classList.toggle('displayNone');
}
);

const modalAction = (modalName, requestAction1, requestAction2, message) => {
  document.getElementById(modalName).classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
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
