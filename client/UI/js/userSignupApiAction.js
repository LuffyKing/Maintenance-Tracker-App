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
      location: form.elements.location.value,
      profile: form.elements.profile.value
    })
  })
    .then(response => ({ jsonObj: response.json(), status: response.status }))
    .then(({ jsonObj, status }) => {
      if (status !== 201) {
        jsonObj.then((result) => {
          alertAction('requestApproved', 'requestDisapproved', result.message);
        });
      } else {
        jsonObj.then((result) => {
          localStorage.setItem('token', result.token);
          localStorage.setItem('profile', result.user.profile);
          if (result.user.profile === 'User') {
            window.location.replace('../UserViewRequests.html');
          } else {
            window.location.replace('../requests');
          }
        });
      }
    })
    .catch(err => err);
};
