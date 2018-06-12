const getElementsByClassName = (modalName, index) =>
document.getElementsByClassName(modalName)[index].classList;

const pagconst = (limit, func = 'insertRequestRow', profile = 'User', route = '/api/v1/users/requests/') => {
  const pagRow = document.getElementById('pagRowComp');
  for (let i = 2; i <= pagRow.childElementCount; i++) {
    if (document.getElementById(`${i}`) && i > limit) {
      document.getElementById(`${i}`).parentNode.removeChild(document.getElementById(`${i}`));
    }
  }
  for (let i = 2; i <= limit; i++) {
    if (!document.getElementById(`${i}`)) {
      const divElement = document.createElement('div');
      divElement.innerHTML = `<a id=${i} onclick="${func}(${i}, route='${route}', func='insertRequestRow', profile='${profile}')">${i}</a>`;
      pagRow.insertBefore(divElement.firstChild, pagRow.childNodes[pagRow.childNodes.length - 2]);
    }
  }
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

const modalDelApprove = (
  modalName = 'approveModal', requestAction1 = 'requestDisapproved',
  requestAction2 = 'requestApproved'
) => {
  const approvalReason = document.getElementById('approvalReason');
  fetch(`/api/v1/requests/${localStorage.requestId}/approve`, {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: localStorage.token
    }),
    body: JSON.stringify({
      reason: approvalReason.value,
    })
  }).then(response => ({ jsonObj: response.json(), status: response.status })).then(({ jsonObj, status }) => {
    if (status !== 200) {
      jsonObj.then((result) => {
        modalAction(modalName, requestAction2, requestAction1, result.message);
      });
    } else {
      jsonObj.then(() => {
        if (document.getElementsByClassName('active').length > 0) {
          document.getElementsByClassName('active')[0].click();
          modalAction(modalName, requestAction1, requestAction2, `<strong>Success!</strong> Request ${localStorage.requestTitle} - ${localStorage.requestId} has been approved!`);
        } else{
          window.location.reload(true);
          document.addEventListener('onload', () => {
            modalAction(modalName, requestAction1, requestAction2, `<strong>Success!</strong> Request  ${localStorage.requestTitle} - ${localStorage.requestId} has been approved!`);
          });
        }
      });
    }
  }).catch(err => err);
};

const modalDeldisapprove = (
  modalName = 'disapproveModal', requestAction1 = 'requestDisapproved',
  requestAction2 = 'requestApproved'
) => {
  const disapprovalReason = document.getElementById('disapprovalReason');
  fetch(`/api/v1/requests/${localStorage.requestId}/disapprove`, {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: localStorage.token
    }),
    body: JSON.stringify({
      reason: disapprovalReason.value,
    })
  }).then(response => ({ jsonObj: response.json(), status: response.status })).then(({ jsonObj, status }) => {
    if (status !== 200) {
      jsonObj.then((result) => {
        modalAction(modalName, requestAction2, requestAction1, result.message);
      });
    } else {
      jsonObj.then(() => {
        if (document.getElementsByClassName('active').length > 0) {
          document.getElementsByClassName('active')[0].click();
          modalAction(modalName, requestAction1, requestAction2, `<strong>Success!</strong> Request ${localStorage.requestTitle} - ${localStorage.requestId} has been disapproved!`);
        } else {
          window.location.reload(true);
          document.addEventListener('onload', () => {
            modalAction(modalName, requestAction1, requestAction2, `<strong>Success!</strong> Request  ${localStorage.requestTitle} - ${localStorage.requestId} has been disapproved!`);
          });
        }
      });
    }
  }).catch(err => err);
};

const modalDelDelete = (
  modalName = 'deleteRequest', requestAction1 = 'requestDisapproved',
  requestAction2 = 'requestApproved'
) => {
  fetch(`/api/v1/users/requests/${localStorage.requestId}`, {
    method: 'DELETE',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: localStorage.token
    })
  }).then(response => ({ jsonObj: response.json(), status: response.status })).then(({ jsonObj, status }) => {
    if (status !== 200) {
      jsonObj.then((result) => {
        modalAction(modalName, requestAction2, requestAction1, result.message);
      });
    } else {
      jsonObj.then((result) => {
        if (document.getElementsByClassName('active').length > 0) {
          const route = localStorage.profile === 'User' ? '/api/v1/users/requests/' : '/api/v1/requests/';
          const current = document.getElementsByClassName('active')[0].text;
          pagconst(Math.ceil((Number(document.getElementById('noOfRequestTotal').innerHTML) - 1) / 10), 'insertRequestRow', localStorage.profile, route)
          if (document.getElementsByClassName('active')[0]) {
            document.getElementsByClassName('active')[0].click()
          } else {

            const toBeActive = document.getElementById(`${Number(current) - 1 >= 1 ? Number(current) - 1 : 1}`);
            toBeActive.classList.add('active');
            toBeActive.click();
          }
          modalAction(modalName, requestAction1, requestAction2, `<strong>Success!</strong> Request ${localStorage.requestTitle} - ${localStorage.requestId} has been deleted!`);
          if (typeof result.cloudinary.publicId === 'string') {
            const formData = new FormData();
            formData.append('public_id', `${result.cloudinary.publicId}`);
            formData.append('api_key', `${result.cloudinary.apiKey}`);
            formData.append('timestamp', `${result.cloudinary.timestamp}`);
            formData.append('signature', `${result.cloudinary.signature}`);
            fetch(`${result.cloudinary.cloudinaryUrl}/destroy`,
              {
                method: 'POST',
                body: formData
              }
            )
          }
        } else {
          window.location.replace(`${window.location.origin}/UserViewRequests.html`);
          document.addEventListener('onload', () => {
            modalAction(modalName, requestAction1, requestAction2, `<strong>Success!</strong> Request  ${localStorage.requestTitle} - ${localStorage.requestId} has been deleted!`);
          });
        }
      });
    }
  }).catch(err => err);
};

const logout = () => {
  localStorage.setItem('token', '');
}

const modalDelResolve = (
  modalName = 'resolveModal', requestAction1 = 'requestDisapproved',
  requestAction2 = 'requestApproved'
) => {
  const resolveReason = document.getElementById('resolveReason');
  fetch(`/api/v1/requests/${localStorage.requestId}/resolve`, {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: localStorage.token
    }),
    body: JSON.stringify({
      reason: resolveReason.value,
    })
  }).then(response => ({ jsonObj: response.json(), status: response.status })).then(({ jsonObj, status }) => {
    if (status !== 200) {
      jsonObj.then((result) => {
        modalAction(modalName, requestAction2, requestAction1, result.message);
      });
    } else {
      jsonObj.then((result) => {
        if (document.getElementsByClassName('active').length > 0) {
          document.getElementsByClassName('active')[0].click();
          modalAction(modalName, requestAction1, requestAction2, `<strong>Success!</strong> Request ${localStorage.requestTitle} - ${localStorage.requestId} has been resolved!`);
        } else {
          window.location.reload(true);
          document.addEventListener('onload', () => {
            modalAction(modalName, requestAction1, requestAction2, `<strong>Success!</strong> Request  ${localStorage.requestTitle} - ${localStorage.requestId} has been resolved!`);
          });
        }
      });
    }
  }).catch(err => err);
};

const loginSubmit = () => {
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
    .then(response => ({ jsonObj: response.json(), status: response.status })).then(({ jsonObj, status }) => {
      if (status !== 200) {
        jsonObj.then((result) => {
          alertAction('requestApproved', 'requestDisapproved', result.message);
        });
      } else {
        jsonObj.then((result) => {
          localStorage.setItem('token', result.token);
          localStorage.setItem('profile', result.user.profile)
          if (result.user.profile === 'User') {
            window.location.replace(`${window.location.origin}/UserViewRequests.html`);
          } else {
            window.location.replace(`${window.location.origin}/requests`);
          }
        });
      }
    })
    .catch(err => err);
};

const signupSubmit = () => {
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
    .then(response => ({ jsonObj: response.json(), status: response.status })).then(({ jsonObj, status }) => {
      if (status !== 201) {
        jsonObj.then((result) => {
          alertAction('requestApproved', 'requestDisapproved', result.message);
        });
      } else {
        jsonObj.then((result) => {
          localStorage.setItem('token', result.token);
          localStorage.setItem('profile', result.user.profile)
          window.location.replace('../UserViewRequests.html');
        });
      }
    })
    .catch(err => err);
};
const insertRequestRow = (page = 1, route = '/api/v1/users/requests/', func = 'insertRequestRow', profile = localStorage.profile) => {
  if (page === 'previous') {
    page = Number(document.getElementsByClassName('active')[0].text) - 1;
    page = page >= 1 ? page : 1;
  }
  const table = document.getElementById('requestsTableComponent');
  table.innerHTML = '';
  fetch(route, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: localStorage.token
    })
  })
    .then(response => ({ jsonObj: response.json(), status: response.status })).then(({ jsonObj, status }) => {
      if (status !== 200) {
        jsonObj.then((result) => {
          alertAction('requestApproved', 'requestDisapproved', result.message);
        });
      } else {
        jsonObj.then((result) => {
          result.requests = result.requests ? result.requests : [];
          document.getElementById('noOfRequestTotal').innerHTML = result.requests.length;
          if (page === 'next') {
            page = Number(document.getElementsByClassName('active')[0].text) + 1;
            page = page <= Math.ceil(result.requests.length / 10) ? page : Math.ceil(result.requests.length / 10);
          }
          pagconst(Math.ceil(result.requests.length / 10), func, profile, route);
          let ans = [];
          if (result.requests.length === 0) {
            const divElement = document.createElement('div');
            divElement.innerHTML = `<div class="request-Row">
              <div class="infoColumn1">
                <center><p id="requestMessage">NO REQUESTS FOUND!</p> </center>
              </div>
            </div>`;
            table.appendChild(divElement.firstChild);
            document.getElementById('pagRowComp').classList.add('displayNone');
          } else {
            result.requests.map((request, index) => {
              const editButton = request.status === 'Not Approved/Rejected' ? `<a href="/requests/edit/${request.id}" class="but">Edit</a>` : '<a class="but disabled">Edit</a>';
              const deleteButton = request.status === 'Not Approved/Rejected' ? `<a onclick="deleteDetailBtn('modal-Box', '${request.id}', '${request.title.replace("'", "\\'").replace('"', "\\'")}')" class="but del">Delete</a>` :
                '<a class="but disabled del">Delete</a>';
              if (index <= (page * 10) - 1 && index >= (page * 10) - 10) {
                const divElement = document.createElement('div');
                if (profile === 'User') {
                  divElement.innerHTML = `<div class="request-Row">
                <div class="request-Image-Container">
                  <img src="${request.image_url || '../media/images/brokenPrinter.jpeg'}" alt="${request.title}">
                </div>
                <div class="infoColumn1">
                  <p><b>Title:- </b> <span id="title">${request.title}</span></p>
                  <p><b>Type:- </b><span id="type">${request.type}</span></p>
                  <p><b>Status:- </b><span id="status">${request.status}</span></p>
                  <p><b>RequestId:- </b><span id="requestid">${request.id}</span></p>
                  <a href="/requests/${request.id}" class="but">Find out more</a>
                  ${editButton}
                  ${deleteButton}
                </div>
              </div>`;
                } else if (profile === 'Admin') {
                  let resolveButton;
                  let approveButton;
                  let disapproveButton;
                  resolveButton = `<a onclick="resolveBtnNon100('modal-Box', '${request.id}', '${request.title}')" class="but detail-board__resolve-button--Non100">Resolve</a>`;
                  approveButton = '<a class="but disabled detail-Board__approve-Button">Approve</a>';
                  disapproveButton = '<a class="but del disabled">Disapprove</a>';
                  if (request.status === 'Not Approved/Rejected') {
                    resolveButton = '<a class="but disabled detail-board__resolve-button--Non100">Resolve</a>';
                    approveButton = `<a onclick="approveDetailBtn('modal-Box', '${request.id}', '${request.title}')" class="but detail-Board__approve-Button">Approve</a>`;
                    disapproveButton = `<a onclick="del('modal-Box', '${request.id}', '${request.title}')" class="but del">Disapprove</a>`;
                  } else if (request.status !== 'Approved') {
                    resolveButton = '<a class="but disabled detail-board__resolve-button--Non100">Resolve</a>';
                  }
                  divElement.innerHTML = `<div class="request-Row">
                <div class="request-Image-Container">
                  <img src="../media/images/brokenPrinter.jpeg" alt="${request.title}">
                </div>
                <div class="infoColumn1">
                  <p><b>Title:- </b> <span id="title">${request.title}</span></p>
                  <p><b>Type:- </b><span id="type">${request.type}</span></p>
                  <p><b>Status:- </b><span id="status">${request.status}</span></p>
                  <p><b>RequestId:- </b><span id="requestid">${request.id}</span></p>
                  <a href="/requests/admin/${request.id}" class="but">Find out more</a>
                  ${approveButton}
                  ${disapproveButton}
                  ${resolveButton}
                </div>
              </div>`;
                }
                table.appendChild(divElement.firstChild);
                ans.push(index);
              }
            });
          }
          if (document.getElementsByClassName('active')) {
            document.getElementsByClassName('active')[0].classList.remove('active');
          }
          document.getElementById(`${page}`).classList.add('active');
          document.getElementById('noOfRequestOnPage').innerHTML = ans.length === 0 ? '0 - 0' : `${ans[0] + 1} - ${ans[ans.length - 1] + 1}`;
        });
      }
    })
    .catch(err => err);
}
const getRequestDetails = (profile = 'User') => {
  const route  = profile === 'User'? `/api/v1/users/requests/${window.location.pathname.split('/')[2]}` : `/api/v1/users/requests/${window.location.pathname.split('/')[3]}`;
  fetch(route, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: localStorage.token
    })
 }).then(response => ({ jsonObj: response.json(), status: response.status })).then(({ jsonObj, status }) => {
    if (status !== 200) {
      jsonObj.then((result) => {
        const main = document.getElementsByTagName('main')[0];
        const center = document.createElement('center');
        const divElement = document.createElement('h1');
        const errorHeader = document.createElement('h1');
        errorHeader.id = 'statusCodeMessage';
        errorHeader.innerHTML = `${status}`;
        main.innerHTML = '';
        divElement.innerHTML = `${result.message}`;
        center.appendChild(errorHeader);
        center.appendChild(divElement);
        main.appendChild(center);
        main.classList.remove('displayNone');
      });
    } else {
      jsonObj.then((result) => {
        document.getElementById('title').innerHTML = `${result.request.title}`;
        document.getElementById('description').innerHTML = `${result.request.description}`;
        document.getElementById('requestId').innerHTML = `${result.request.id}`;
        document.getElementById('type').innerHTML = `${result.request.type}`;
        document.getElementById('status').innerHTML = `${result.request.status}`;
        document.getElementById('lastEdited').innerHTML = `${result.request.last_edited.split('T')[0].split('-').reverse().join('/')}`;
        document.getElementById('dateSubmitted').innerHTML = `${result.request.date_submitted.split('T')[0].split('-').reverse().join('/')}`;
        document.getElementById('requestLocation').innerHTML = `${result.request.location}`;
        document.getElementById('reason').innerHTML = typeof result.request.reason !== 'undefined' ? result.request.reason : '';
        document.getElementById('dateResolved').innerHTML = typeof result.request.date_resolved === 'string' ? `${result.request.date_resolved.split('T')[0].split('-').reverse().join('/')}` : '';
        document.getElementById('reasonHeader').innerHTML = `${result.request.status} Reason`;
        document.getElementById('requestDetailPhoto').setAttribute('title', result.request.title);
        if (typeof result.request.image_url === 'string') {
          document.getElementById('requestDetailPhoto').setAttribute('src', result.request.image_url);
        }
        if (profile === 'User') {
          const editButton = document.getElementsByClassName('detail-Board__edit-Button')[0];
          const deleteButton = document.getElementsByClassName('detail-Board__delete-button')[0];
          if (result.request.status !== 'Not Approved/Rejected') {
            editButton.removeAttribute('href');
            editButton.classList.add('disabled');
            deleteButton.removeAttribute('onclick');
            deleteButton.classList.add('disabled');
            document.getElementsByTagName('main')[0].classList.remove('displayNone');
          } else {
            editButton.href = `/requests/edit/${result.request.id}`;
            deleteButton.setAttribute('onclick', `deleteDetailBtn('modal-Box', '${result.request.id}', '${result.request.title.replace("'", "\\'").replace('"', "\\'")}')`);
            document.getElementById('reasonColumn').classList.add('displayNone');
            if (result.request.status === 'Resolved') {
              document.getElementById('dateResolvedRow').classList.remove('displayNone');
            }
            document.getElementsByTagName('main')[0].classList.remove('displayNone');
          }
        } else {
          const approveButton = document.getElementsByClassName('detail-Board__approve-Button')[0];
          const disapproveButton = document.getElementsByClassName('detail-Board__delete-button')[0];
          const resolveButton = document.getElementsByClassName('detail-board__resolve-button')[0];
          document.getElementById('requesterName').innerHTML = `${result.request.first_name} ${result.request.last_name}`;
          if (result.request.status === 'Approved') {
            approveButton.removeAttribute('onclick');
            approveButton.classList.add('disabled');
            disapproveButton.removeAttribute('onclick');
            disapproveButton.classList.add('disabled');
            resolveButton.setAttribute('onclick', `resolveBtnNon100('modal-Box', '${result.request.id}', '${result.request.title.replace("'", "\\'").replace('"', "\\'")}')`);
            document.getElementsByTagName('main')[0].classList.remove('displayNone');
          } else if (result.request.status === 'Not Approved/Rejected') {
            approveButton.setAttribute('onclick', `approveDetailBtn('modal-Box', '${result.request.id}', '${result.request.title.replace("'", "\\'").replace('"', "\\'")}')`);
            disapproveButton.setAttribute('onclick', `del('modal-Box', '${result.request.id}', '${result.request.title.replace("'", "\\'").replace('"', "\\'")}')`);
            resolveButton.removeAttribute('onclick');
            resolveButton.classList.add('disabled');
            document.getElementById('reasonColumn').classList.add('displayNone');
            document.getElementsByTagName('main')[0].classList.remove('displayNone');
          } else if (result.request.status === 'Rejected' || result.request.status === 'Resolved') {
            approveButton.removeAttribute('onclick');
            approveButton.classList.add('disabled');
            resolveButton.removeAttribute('onclick');
            resolveButton.classList.add('disabled');
            disapproveButton.removeAttribute('onclick');
            disapproveButton.classList.add('disabled');
            if (result.request.status === 'Resolved') {
              document.getElementById('dateResolvedRow').classList.remove('displayNone');
            }
            document.getElementsByTagName('main')[0].classList.remove('displayNone');
          }
        }
      });
    }
  });
};

const createRequestSubmit = () => {
  const form =  document.getElementById('createRequestForm');
  const image = form.elements.imageOfRequest.files.length > 0 ? form.elements.imageOfRequest.files[0] : undefined;
  const body = JSON.stringify({
    title: form.elements.title.value,
    type: form.elements.type.value,
    location: form.elements.requestLocation.value,
    description: form.elements.description.value,
  });
  fetch('/api/v1/users/requests', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: localStorage.token
    }),
    body
  })
    .then(response => ({ jsonObj: response.json(), status: response.status })).then(({ jsonObj, status }) => {
      if (status !== 201) {
        jsonObj.then((result) => {
          alertAction('requestApproved', 'requestDisapproved', result.message);
        });
      } else {
        if (typeof image === 'undefined') {
          jsonObj.then((result) => {
            window.location.replace(`${window.location.origin}/requests/${result.request.id}`);
          });
        } else {
          jsonObj.then((result) => {
            const formData = new FormData();

            formData.append('file', image);
            formData.append('upload_preset', result.cloudinary.cloudinaryUploadPreset);
            fetch(`${result.cloudinary.cloudinaryUrl}/upload`,
              {
                method: 'POST',
                body: formData
              }
            ).then(response => ({ cloudinaryObj: response.json(), status: response.status })).then(({ cloudinaryObj, status }) => {
              if (status === 200) {
                cloudinaryObj.then((imageResult) => {
                  fetch(`/api/v1/attachImage/${result.request.id}`, {
                    method: 'PUT',
                    headers: new Headers({
                      'Content-Type': 'application/json',
                      authorization: localStorage.token
                    }),
                    body: JSON.stringify({
                      imageUrl: imageResult.url
                    })
                  }).then(response => ({
                    status: response.status,
                    imageInsertResult: response.json()
                  })).then(({ status }) => {
                    if (status === 200) {
                      window.location.replace(`${window.location.origin}/requests/${result.request.id}`);
                    } else {
                      imageInsertResult.then((result) => {
                        alertAction('requestApproved', 'requestDisapproved', result.message);
                      });
                    }
                  });
                });
              }
            });
          });
        }
      }
    })
    .catch(err => err);
};
const getEditDetails = () => {
  const form =  document.getElementById('editRequestForm');
  fetch(`/api/v1/users/requests/${window.location.pathname.split('/')[3]}`, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: localStorage.token
    })
  }).then(response => ({ jsonObj: response.json(), status: response.status })).then(({ jsonObj, status }) => {
    const main = document.getElementsByTagName('main')[0];
    if (status !== 200) {
      jsonObj.then((result) => {
        const center = document.createElement('center');
        const divElement = document.createElement('h1');
        const errorHeader = document.createElement('h1');
        errorHeader.id = 'statusCodeMessage';
        errorHeader.innerHTML = `${status}`;
        main.innerHTML = '';
        divElement.innerHTML = `${result.message}`;
        center.appendChild(errorHeader);
        center.appendChild(divElement);
        main.appendChild(center);
        main.classList.remove('displayNone')
      })
    } else {
      jsonObj.then((result) => {
        if (result.request.status !== 'Not Approved/Rejected') {
          const center = document.createElement('center');
          const divElement = document.createElement('h1');
          const errorHeader = document.createElement('h1');
          errorHeader.id = 'statusCodeMessage';
          errorHeader.innerHTML = 'You do not have an editable request with that id ';
          main.innerHTML = '';
          divElement.innerHTML = `${result.message}`;
          center.appendChild(errorHeader);
          center.appendChild(divElement);
          main.appendChild(center);
          main.classList.remove('displayNone');
        } else {
          form.elements.title.value = result.request.title;
          form.elements.type.value = result.request.type;
          form.elements.requestLocation.value = result.request.location;
          form.elements.description.value = result.request.description;
          main.classList.remove('displayNone');
        }
      });
    }
  });
};

const editRequestSubmit = () => {
  const form =  document.getElementById('editRequestForm');
  const image = form.elements.imageOfRequest.files.length > 0 ? form.elements.imageOfRequest.files[0] : undefined;
  fetch(`/api/v1/users/requests/${window.location.pathname.split('/')[3]}`, {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: localStorage.token
    }),
    body: JSON.stringify({
      title: form.elements.title.value,
      type: form.elements.type.value,
      location: form.elements.requestLocation.value,
      description: form.elements.description.value
    })
  })
    .then(response => ({ jsonObj: response.json(), status: response.status })).then(({ jsonObj, status }) => {
      if (status !== 200) {
        jsonObj.then((result) => {
          alertAction('requestApproved', 'requestDisapproved', result.message);
        });
      } else {
        if (typeof image === 'undefined') {
          jsonObj.then((result) => {
            window.location.replace(`${window.location.origin}/requests/${result.updatedRequest.id}`);
          });
        } else {
          jsonObj.then((result) => {
            const formData = new FormData();
            formData.append('file', image);
            if (typeof result.updatedRequest.image_url === 'string') {
              formData.append('public_id', `${result.cloudinary.publicId}`);
              formData.append('api_key', `${result.cloudinary.apiKey}`);
              formData.append('timestamp', `${result.cloudinary.timestamp}`);
              formData.append('signature', `${result.cloudinary.signature}`);
            }
            fetch(`${result.cloudinary.cloudinaryUrl}/upload`,
              {
                method: 'POST',
                body: formData
              }
            ).then(response => ({ cloudinaryObj: response.json(), status: response.status })).then(({ cloudinaryObj, status }) => {
              if (status === 200) {
                cloudinaryObj.then((imageResult) => {
                  fetch(`/api/v1/attachImage/${result.updatedRequest.id}`, {
                    method: 'PUT',
                    headers: new Headers({
                      'Content-Type': 'application/json',
                      authorization: localStorage.token
                    }),
                    body: JSON.stringify({
                      imageUrl: imageResult.url
                    })
                  }).then(response => ({
                    status: response.status,
                    imageInsertResult: response.json()
                  })).then(({ status }) => {
                    if (status === 200) {
                      window.location.replace(`${window.location.origin}/requests/${result.updatedRequest.id}`);
                    } else {
                      imageInsertResult.then((result) => {
                        alertAction('requestApproved', 'requestDisapproved', result.message);
                      });
                    }
                  });
                });
              }
            });
          });
        }
      }
    })
    .catch(err => err);
};
