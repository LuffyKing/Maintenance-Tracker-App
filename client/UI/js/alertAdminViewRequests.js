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
  function pagFunction(limit, func="insertRequestRow"){
    let pagRow = document.getElementById('pagRowComp');
    for (let i = 2; i <= limit; i++) {
      if(!document.getElementById(`${i}`)){
        let el = document.createElement('div');
        el.innerHTML = `<a id=${i} onclick="${func}(${i}, route='/api/v1/requests/', func='insertRequestRow', profile='Admin')">${i}</a>`;
        pagRow.insertBefore(el.firstChild, pagRow.childNodes[ pagRow.childNodes.length-2]);
      }
    }
  }
  function insertRequestRow(page=1, route='/api/v1/users/requests/', func="insertRequestRow", profile="User"){
     if (page === 'previous') {
      page = Number(document.getElementsByClassName('active')[0].text) - 1;
      page = page >= 1 ? page : 1;
    }
    let table = document.getElementById('requestsTableComponent');
    table.innerHTML = '';
    fetch(route, {
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
            pagFunction(Math.ceil(result.requests.length/10), func);
            let ans = [];
            result.requests.map( (request, index) => {
              if(index <= page*10-1 && index >= page*10-10 ){
                let el = document.createElement('div');
                if (profile === 'User'){
                    el.innerHTML = `<div class="request-Row">
                  <div class="request-Image-Container">
                    <img src="../media/images/brokenPrinter.jpeg" alt="${request.title}">
                  </div>
                  <div class="infoColumn1">
                    <p><b>Title:- </b> <span id="title">${request.title}</span></p>
                    <p><b>Type:- </b><span id="type">${request.type}</span></p>
                    <p><b>Status:- </b><span id="status">${request.status}</span></p>
                    <p><b>RequestId:- </b><span id="requestid">${request.id}</span></p>
                    <a href="/requests/${request.id}" class="but">Find out more</a>
                    <a href="/requests/edit/${request.id}" class="but">Edit</a>
                    <a onclick="approveDetailBtn()" class="but del">Delete</a>
                  </div>
                </div>`;
                } else if (profile === 'Admin') {
                    let req;
                    req = '<a onclick="resolveBtnNon100()" class="but detail-board__resolve-button--Non100">Resolve</a>';
                    if(request.status === 'Not Approved/Rejected'){
                      req = '<a class="but disabled detail-board__resolve-button--Non100">Resolve</a>';
                    }

                    el.innerHTML = `<div class="request-Row">
                  <div class="request-Image-Container">
                    <img src="../media/images/brokenPrinter.jpeg" alt="${request.title}">
                  </div>
                  <div class="infoColumn1">
                    <p><b>Title:- </b> <span id="title">${request.title}</span></p>
                    <p><b>Type:- </b><span id="type">${request.type}</span></p>
                    <p><b>Status:- </b><span id="status">${request.status}</span></p>
                    <p><b>RequestId:- </b><span id="requestid">${request.id}</span></p>
                    <a href="/requests/admin/${request.id}" class="but">Find out more</a>
                    <a onclick="approveDetailBtn()" class="but detail-Board__approve-Button">Approve</a>
                    <a onclick="del()" class="but del">Disapprove</a>
                    ${req}
                  </div>
                </div>`;
                }
                table.appendChild(el.firstChild);
                ans.push(index);
              }
            });
            if(document.getElementsByClassName('active')){
              document.getElementsByClassName('active')[0].classList.remove('active');
            }
            document.getElementById(`${page}`).classList.add('active');
            document.getElementById('noOfRequestOnPage').innerHTML = `${ans[0] + 1} - ${ans[ans.length - 1] + 1}`;
          });
        }
      })
      .catch(err => err);
  }
  function getRequestDetails(){
    fetch(`/api/v1/users/requests/${window.location.pathname.split('/')[2]}`, {
      method: 'GET',
      headers: new Headers({
       'Content-Type': 'application/json',
       'authorization': localStorage.token
     })
   }).then(response => ({jsonObj: response.json(), status: response.status })).then(({jsonObj, status}) => {
     if(status !== 200){
       jsonObj.then( result => {
         const main = document.getElementsByTagName("main")[0];
         let center = document.createElement('center')
         let el = document.createElement('h1');
         let errorHeader = document.createElement('h1');
         errorHeader.id = 'statusCodeMessage';
         errorHeader.innerHTML = `${status}`;
         main.innerHTML ='';
         el.innerHTML = `${result.message}`;
         center.appendChild(errorHeader);
         center.appendChild(el);
         main.appendChild(center);
         main.classList.remove('displayNone')
       })
     } else{
        jsonObj.then( result => {
          document.getElementById('title').innerHTML = `${result.request.title}`;
          document.getElementById('description').innerHTML = `${result.request.description}`;
          document.getElementById('requestId').innerHTML = `${result.request.id}`;
          document.getElementById('type').innerHTML = `${result.request.type}`;
          document.getElementById('status').innerHTML = `${result.request.status}`;
          document.getElementById('lastEdited').innerHTML = `${result.request.last_edited.split('T')[0].split('-').reverse().join('/')}`;
          document.getElementById('dateSubmitted').innerHTML = `${result.request.date_submitted.split('T')[0].split('-').reverse().join('/')}`;
          document.getElementById('requestLocation').innerHTML = `${result.request.location}`;
          const editButton = document.getElementsByClassName('detail-Board__edit-Button')[0];
          const deleteButton = document.getElementsByClassName('detail-Board__delete-button')[0];
          if(result.request.status !== 'Not Approved/Rejected'){
              editButton.removeAttribute('href');
              editButton.classList.add('disabled');
              deleteButton.removeAttribute('onclick');
              deleteButton.classList.add('disabled');
              document.getElementsByTagName("main")[0].classList.remove('displayNone')
          } else{
          editButton.href = `/requests/edit/${result.request.id}`;
          document.getElementsByTagName("main")[0].classList.remove('displayNone')
        }
        })
     }
   })
  }
  function createRequestSubmit(){
    const form =  document.getElementById('createRequestForm');
    fetch('/api/v1/users/requests', {
      method: 'POST',
      headers: new Headers({
       'Content-Type': 'application/json',
       'authorization': localStorage.token
     }),
      body: JSON.stringify({
        title: form.elements.title.value,
        type: form.elements.type.value,
        location: form.elements.requestLocation.value,
        description: form.elements.description.value
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
            window.location.replace(`${window.location.origin}/requests/${result.request.id}`);
          });
        }
      })
      .catch(err => err);
  };
  function getEditDetails(){
      const form =  document.getElementById('editRequestForm');
      fetch(`/api/v1/users/requests/${window.location.pathname.split('/')[3]}`, {
        method: 'GET',
        headers: new Headers({
         'Content-Type': 'application/json',
         'authorization': localStorage.token
       })
     }).then(response => ({jsonObj: response.json(), status: response.status })).then(({jsonObj, status}) => {
       const main = document.getElementsByTagName("main")[0];
       if(status !== 200){
         jsonObj.then( result => {
           let center = document.createElement('center')
           let el = document.createElement('h1');
           let errorHeader = document.createElement('h1');
           errorHeader.id = 'statusCodeMessage';
           errorHeader.innerHTML = `${status}`;
           main.innerHTML ='';
           el.innerHTML = `${result.message}`;
           center.appendChild(errorHeader);
           center.appendChild(el);
           main.appendChild(center);
           main.classList.remove('displayNone')
         })
       } else {
          jsonObj.then( result => {
              if(result.request.status !== 'Not Approved/Rejected'){
                  let center = document.createElement('center')
                  let el = document.createElement('h1');
                  let errorHeader = document.createElement('h1');
                  errorHeader.id = 'statusCodeMessage';
                  errorHeader.innerHTML = 'You do not have an editable request with that id ';
                  main.innerHTML ='';
                  el.innerHTML = `${result.message}`;
                  center.appendChild(errorHeader);
                  center.appendChild(el);
                  main.appendChild(center);
                  main.classList.remove('displayNone');
              } else{
                form.elements.title.value = result.request.title;
                form.elements.type.value = result.request.type;
                form.elements.requestLocation.value = result.request.location;
                form.elements.description.value = result.request.description;
                main.classList.remove('displayNone');
              }
            })
       }
     })
    }
  function editRequestSubmit(){
    const form =  document.getElementById('editRequestForm');
    fetch(`/api/v1/users/requests/${window.location.pathname.split('/')[3]}`, {
      method: 'PUT',
      headers: new Headers({
       'Content-Type': 'application/json',
       'authorization': localStorage.token
     }),
      body: JSON.stringify({
        title: form.elements.title.value,
        type: form.elements.type.value,
        location: form.elements.requestLocation.value,
        description: form.elements.description.value
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
            console.log(result);
            window.location.replace(`${window.location.origin}/requests/${result.updatedRequest.id}`);
          });
        }
      })
      .catch(err => err);
  };
