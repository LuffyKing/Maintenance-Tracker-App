const changePasswordSubmit = () => {
  const form =  document.getElementById('changePasswordForm');
  if (form.elements.passwordConfirm.value !== form.elements.password.value) {
    return alertAction('requestApproved', 'requestDisapproved', 'Passwords do not match.');
  }
  fetch(`/api/v1/auth/changePassword?resetToken=${window.location.search.split('=')[1]}`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      password: form.elements.password.value
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
          window.location.replace('../SigninPage.html');
          alertAction('requestDisapproved', 'requestApproved', result.message);
        });
      }
    })
    .catch(err => err);
};
