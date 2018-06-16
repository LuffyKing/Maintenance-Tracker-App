const getUserDetails = () => {
  const route = '/api/v1/auth/users/';
  fetch(route, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: localStorage.token
    })
  }).then(response => ({ jsonObj: response.json(), status: response.status }))
    .then(({ jsonObj, status }) => {
      if (status !== 200) {
        jsonObj.then((result) => {
          const main = document.getElementsByTagName('main')[0];
          const center = document.createElement('center');
          const divElement = document.createElement('h1');
          const errorHeader = document.createElement('h1');
          errorHeader.id = 'statusCodeMessage';
          errorHeader.innerHTML = `${status}`;
          main.innerHTML = '';
          divElement.innerHTML = `${result.message}`;
          center.appendChild(errorHeader);
          center.appendChild(divElement);
          main.appendChild(center);
          main.classList.remove('displayNone');
        });
      } else {
        jsonObj.then((result) => {
          document.getElementById('firstName').innerHTML = `${result.user.first_name}`;
          document.getElementById('lastName').innerHTML = `${result.user.last_name}`;
          document.getElementById('email').innerHTML = `${result.user.email}`;
          document.getElementById('jobTitle').innerHTML = `${result.user.job_title}`;
          document.getElementById('department').innerHTML = `${result.user.department}`;
          document.getElementById('profile').innerHTML = `${result.user.profile}`;
          document.getElementById('location').innerHTML = `${result.user.location}`;
          if (typeof result.user.image_url === 'string') {
            document.getElementById('requestDetailPhoto').setAttribute('src', result.user.image_url);
          }
          const editButton = document.getElementsByClassName('detail-Board__approve-Button')[0];
          editButton.href = '/users/edit/';
          document.getElementsByTagName('main')[0].classList.remove('displayNone');
        });
      }
    });
};
