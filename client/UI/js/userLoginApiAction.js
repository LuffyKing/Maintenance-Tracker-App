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
    .then(response => ({ jsonObj: response.json(), status: response.status }))
    .then(({ jsonObj, status }) => {
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
