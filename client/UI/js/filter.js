const filter = () => {
  const filter = document.getElementById('filter');
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
          if (['Approved', 'Rejected', 'Resolved', 'Not Approved/Rejected', 'All'].includes(filter.value)) {
            if (filter.value === 'All') {
              insertRequestRow(1, `${routeObj[result.profile]}`, 'insertRequestRow', result.profile)
            } else {
              insertRequestRow(1, `${routeObj[result.profile]}?status=${filter.value}`, 'insertRequestRow', result.profile);
            }
          }
        });
      }
    });
};
