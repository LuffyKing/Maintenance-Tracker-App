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
     'Content-Type': 'application/json'
   }),
    body: JSON.stringify({
      email: form.elements.email.value,
      password: form.elements.password.value
    })
  })
    .then(response => ({jsonObj: response.json(), status: response.status })).then(({jsonObj, status}) => {
      if (status !== 200) {
        jsonObj.then(
          result => {
            alertAction('requestApproved', 'requestDisapproved', result.message);
          }
        );
      } else {
        jsonObj.then( result => {
          localStorage.setItem('token', result.token);
          window.location.replace('../UserViewRequests.html');
        });
      }
    })
    .catch(err => err);
};

function signupSubmit(){
  const form =  document.getElementById('signupForm');
  if (form.elements.password2.value !== form.elements.password.value) {
    return alertAction('requestApproved', 'requestDisapproved', 'Passwords do not match.');
  }
  fetch('/api/v1/auth/signup/', {
    method: 'POST',
    headers: new Headers({
     'Content-Type': 'application/json'
   }),
    body: JSON.stringify({
      email: form.elements.email.value,
      password: form.elements.password.value,
      firstName: form.elements.firstname.value,
      lastName: form.elements.lastname.value,
      jobTitle: form.elements.jobTitle.value,
      department: form.elements.Department.value,
      location: form.elements.location.value
    })
  })
    .then(response => ({jsonObj: response.json(), status: response.status })).then(({jsonObj, status}) => {
      if (status !== 201) {
        jsonObj.then(
          result => {
            alertAction('requestApproved', 'requestDisapproved', result.message);
          }
        );
      } else {
        jsonObj.then( result => {
          localStorage.setItem('token', result.token);
          window.location.replace('../UserViewRequests.html');
        });
      }
    })
    .catch(err => err);
};
function pagFunction(limit){
  let pagRow = document.getElementById('pagRowComp');
  for (let i = 2; i <= limit; i++) {
    if(!document.getElementById(`${i}`)){
      let el = document.createElement('div');
      el.innerHTML = `<a id=${i} onclick="insertRequestRow(${i})">${i}</a>`;
      pagRow.insertBefore(el.firstChild, pagRow.childNodes[ pagRow.childNodes.length-2]);
    }
  }
}
function insertRequestRow(page=1){
   if (page === 'previous') {
    page = Number(document.getElementsByClassName('active')[0].text) - 1;
    page = page >= 1 ? page : 1;
  }
  let table = document.getElementById('requestsTableComponent');
  table.innerHTML = '';
  fetch('/api/v1/users/requests/', {
    method: 'GET',
    headers: new Headers({
     'Content-Type': 'application/json',
     'authorization': localStorage.token
   })
  })
    .then(response => ({jsonObj: response.json(), status: response.status })).then(({jsonObj, status}) => {
      if (status !== 200) {
        jsonObj.then(
          result => {
            alertAction('requestApproved', 'requestDisapproved', result.message);
          }
        );
      } else {
        jsonObj.then( result => {
          document.getElementById('noOfRequestTotal').innerHTML = result.requests.length;
          if (page === 'next') {
            page = Number(document.getElementsByClassName('active')[0].text) + 1;
            page = page <= Math.ceil(result.requests.length/10) ? page : Math.ceil(result.requests.length/10);
          }
          pagFunction(Math.ceil(result.requests.length/10));
          let ans = [];
          result.requests.map( (request, index) => {
            if(index <= page*10-1 && index >= page*10-10 ){
              let el = document.createElement('div');
              el.innerHTML = `<div class="request-Row">
                <div class="request-Image-Container">
                  <img src="../media/images/brokenPrinter.jpeg" alt="${request.title}">
                </div>
                <div class="infoColumn1">
                  <p><b>Title:- </b> <span id="title">${request.title}</span></p>
                  <p><b>Type:- </b><span id="type">${request.type}</span></p>
                  <p><b>Status:- </b><span id="status">${request.status}</span></p>
                  <p><b>RequestId:- </b><span id="requestid">${request.id}</span></p>
                  <a href="/request/user/${request.id}" class="but">Find out more</a>
                  <a href="/request/user/edit/${request.id}" class="but">Edit</a>
                  <a onclick="approveDetailBtn()" class="but del">Delete</a>
                </div>
              </div>`;
              table.appendChild(el.firstChild);
              ans.push(index);
            }
          });
          if(document.getElementsByClassName('active')){
            document.getElementsByClassName('active')[0].classList.remove('active')
          }
          document.getElementById(`${page}`).classList.add('active');
          document.getElementById('noOfRequestOnPage').innerHTML = `${ans[0] + 1} - ${ans[ans.length - 1] + 1}`;
        });
      }
    })
    .catch(err => err);
}
