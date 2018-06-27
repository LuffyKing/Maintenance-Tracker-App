const getRequestDetails = (profile = 'User') => {
  const route = profile === 'User' ?
    `/api/v1/users/requests/${window.location.pathname.split('/')[2]}` :
    `/api/v1/users/requests/${window.location.pathname.split('/')[3]}`;
  fetch(route, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: localStorage.token
    })
 }).then(response => ({ jsonObj: response.json(), status: response.status }))
    .then(({ jsonObj, status }) => {
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
          document.getElementById('reasonHeader').innerHTML = `${result.request.status} Reason:- `;
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
