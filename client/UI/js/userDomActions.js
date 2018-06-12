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
  }).then(response => ({ jsonObj: response.json(), status: response.status }))
    .then(({ jsonObj, status }) => {
      if (status !== 200) {
        jsonObj.then((result) => {
          modalAction(modalName, requestAction2, requestAction1, result.message);
        });
      } else {
        jsonObj.then((result) => {
          if (document.getElementsByClassName('active').length > 0) {
            const route = localStorage.profile === 'User' ? '/api/v1/users/requests/' : '/api/v1/requests/';
            const current = document.getElementsByClassName('active')[0].text;
            pagination(Math.ceil((Number(document.getElementById('noOfRequestTotal').innerHTML) - 1) / 10), 'insertRequestRow', localStorage.profile, route)
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
              fetch(`${result.cloudinary.cloudinaryUrl}destroy`,
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
