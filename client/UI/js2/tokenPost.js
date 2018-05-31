'use strict';

addEventListener('DOMContentLoaded', function () {
  fetch('/verify', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'authorization': localStorage.token
    }
  }).then(function (response) {
    return response.status;
  }).then(function (status) {
    console.log(status);
    if (status !== 200) {
      window.location.replace('../SigninPage.html');
    } else {
      var body = document.getElementsByTagName("BODY")[0];
      body.classList.remove('displayNone');
    }
  });
});