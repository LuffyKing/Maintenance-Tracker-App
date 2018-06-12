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
