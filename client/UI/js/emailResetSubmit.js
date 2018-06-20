const emailResetSubmit = () => {
  const form =  document.getElementById('emailResetSubmit');
  fetch('/api/v1/auth/forgotPassword', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      email: form.elements.email.value
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
          alertAction('requestDisapproved', 'requestApproved', result.message);
        });
      }
    })
    .catch(err => err);
};
