const routeToMyRequest = () => {
  fetch('/verify', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      authorization: localStorage.token
    }
  }).then(response => ({ status: response.status, jsonObj: response.json() }))
    .then(({ status, jsonObj }) => {
      if (status !== 200) {
        window.location.replace(`${window.location.origin}/SigninPage.html`);
      } else {
        jsonObj.then((result) => {
          if (result.profile === 'User') {
            window.location.replace(`${window.location.origin}/UserViewRequests.html`);
          } else {
            window.location.replace(`${window.location.origin}/requests`);
          }
        });
      }
    });
};
