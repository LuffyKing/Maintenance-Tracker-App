addEventListener('DOMContentLoaded', () => {
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
          const body = document.getElementsByTagName('BODY')[0];
          body.classList.remove('displayNone');
        });
      }
    });
});
