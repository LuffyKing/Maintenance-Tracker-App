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
    .then(response => ({ jsonObj: response.json(), status: response.status }))
    .then(({ jsonObj, status }) => {
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
            page = page <= Math.ceil(result.requests.length / 10) ? page :
              Math.ceil(result.requests.length / 10);
          }
          pagination(Math.ceil(result.requests.length / 10), func, profile, route);
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
                  <img src="${request.image_url || '../media/images/noimage.png'}" alt="${request.title}">
                </div>
                <div class="infoColumn1 centerInfo">
                  <p><b class="boldText">Title:- </b> <span id="title">${request.title}</span></p>
                  <p><b class="boldText">Type:- </b><span id="type">${request.type}</span></p>
                  <p><b class="boldText">Status:- </b><span id="status">${request.status}</span></p>
                  <p><b class="boldText">RequestId:- </b><span id="requestid">${request.id}</span></p>
                </div>
                <div class="infoColumn1 actionColumn">
                  <a href="/requests/${request.id}" class="but">Details...</a>
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
                  <img src="${request.image_url || '../media/images/noimage.png'}" alt="${request.title}">
                </div>
                <div class="infoColumn1 centerInfo">
                  <p><b>Title:- </b> <span id="title">${request.title}</span></p>
                  <p><b>Type:- </b><span id="type">${request.type}</span></p>
                  <p><b>Status:- </b><span id="status">${request.status}</span></p>
                  <p><b>RequestId:- </b><span id="requestid">${request.id}</span></p>
                </div>
                <div class="infoColumn1 actionColumn">
                  <a href="/requests/admin/${request.id}" class="but">Details...</a>
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
};
