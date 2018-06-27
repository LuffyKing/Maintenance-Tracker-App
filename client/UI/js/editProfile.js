const getEditDetails = () => {
  const form =  document.getElementById('editProfileForm');
  fetch('/api/v1/auth/users/', {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: localStorage.token
    })
  }).then(response => ({ jsonObj: response.json(), status: response.status }))
    .then(({ jsonObj, status }) => {
      const main = document.getElementsByTagName('main')[0];
      if (status !== 200) {
        jsonObj.then((result) => {
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
          form.elements.firstName.value = result.user.first_name;
          form.elements.lastName.value = result.user.last_name;
          form.elements.email.value = result.user.email;
          form.elements.jobTitle.value = result.user.job_title;
          form.elements.userLocation.value = result.user.location;
          form.elements.department.value = result.user.department;
          main.classList.remove('displayNone');
        });
      }
    });
};

const editProfileSubmit = () => {
  const form =  document.getElementById('editProfileForm');
  const image = form.elements.imageOfUser.files.length > 0 ?
    form.elements.imageOfUser.files[0] : undefined;
  fetch('/api/v1/users/edit/', {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: localStorage.token
    }),
    body: JSON.stringify({
      email: form.elements.email.value,
      jobTitle: form.elements.jobTitle.value,
      location: form.elements.userLocation.value,
      department: form.elements.department.value,
      firstName: form.elements.firstName.value,
      lastName: form.elements.lastName.value
    })
  })
    .then(response => ({ jsonObj: response.json(), status: response.status }))
    .then(({ jsonObj, status }) => {
      if (status !== 200) {
        jsonObj.then((result) => {
          alertAction('requestApproved', 'requestDisapproved', result.message);
        });
      } else {
        if (typeof image === 'undefined') {
          jsonObj.then((result) => {
            window.location.replace(`${window.location.origin}/profile`);
          });
        } else {
          jsonObj.then((result) => {
            const formData = new FormData();
            formData.append('file', image);
            if (typeof result.user.imageUrl === 'string') {
              formData.append('public_id', `${result.cloudinary.publicId}`);
              formData.append('api_key', `${result.cloudinary.apiKey}`);
              formData.append('timestamp', `${result.cloudinary.timestamp}`);
              formData.append('signature', `${result.cloudinary.signature}`);
            } else {
              formData.append('upload_preset', result.cloudinary.cloudinaryUploadPreset);
            }
            fetch(`${result.cloudinary.cloudinaryUrl}upload`,
              {
                method: 'POST',
                body: formData
              }
            ).then(response => ({ cloudinaryObj: response.json(), status: response.status }))
            .then(({ cloudinaryObj, status }) => {
              if (status === 200) {
                cloudinaryObj.then((imageResult) => {
                  fetch('/api/v1/attachImageUser', {
                    method: 'PUT',
                    headers: new Headers({
                      'Content-Type': 'application/json',
                      authorization: localStorage.token
                    }),
                    body: JSON.stringify({
                      imageUrl: imageResult.url
                    })
                  }).then(response => ({
                    status: response.status,
                    imageInsertResult: response.json()
                  })).then(({ status }) => {
                    if (status === 200) {
                      window.location.replace(`${window.location.origin}/profile`);
                    } else {
                      imageInsertResult.then((result) => {
                        alertAction('requestApproved', 'requestDisapproved', result.message);
                      });
                    }
                  });
                });
              }
            });
          });
        }
      }
    })
    .catch(err => err);
};
