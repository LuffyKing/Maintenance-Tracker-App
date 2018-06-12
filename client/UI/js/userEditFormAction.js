const getEditDetails = () => {
  const form =  document.getElementById('editRequestForm');
  fetch(`/api/v1/users/requests/${window.location.pathname.split('/')[3]}`, {
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
          main.classList.remove('displayNone')
        })
      } else {
        jsonObj.then((result) => {
          if (result.request.status !== 'Not Approved/Rejected') {
            const center = document.createElement('center');
            const divElement = document.createElement('h1');
            const errorHeader = document.createElement('h1');
            errorHeader.id = 'statusCodeMessage';
            errorHeader.innerHTML = 'You do not have an editable request with that id ';
            main.innerHTML = '';
            divElement.innerHTML = `${result.message}`;
            center.appendChild(errorHeader);
            center.appendChild(divElement);
            main.appendChild(center);
            main.classList.remove('displayNone');
          } else {
            form.elements.title.value = result.request.title;
            form.elements.type.value = result.request.type;
            form.elements.requestLocation.value = result.request.location;
            form.elements.description.value = result.request.description;
            main.classList.remove('displayNone');
          }
        });
      }
    });
};

const editRequestSubmit = () => {
  const form =  document.getElementById('editRequestForm');
  const image = form.elements.imageOfRequest.files.length > 0 ?
    form.elements.imageOfRequest.files[0] : undefined;
  fetch(`/api/v1/users/requests/${window.location.pathname.split('/')[3]}`, {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: localStorage.token
    }),
    body: JSON.stringify({
      title: form.elements.title.value,
      type: form.elements.type.value,
      location: form.elements.requestLocation.value,
      description: form.elements.description.value
    })
  })
    .then(response => ({ jsonObj: response.json(), status: response.status })).then(({ jsonObj, status }) => {
      if (status !== 200) {
        jsonObj.then((result) => {
          alertAction('requestApproved', 'requestDisapproved', result.message);
        });
      } else {
        if (typeof image === 'undefined') {
          jsonObj.then((result) => {
            window.location.replace(`${window.location.origin}/requests/${result.updatedRequest.id}`);
          });
        } else {
          jsonObj.then((result) => {
            const formData = new FormData();
            formData.append('file', image);
            if (typeof result.updatedRequest.image_url === 'string') {
              formData.append('public_id', `${result.cloudinary.publicId}`);
              formData.append('api_key', `${result.cloudinary.apiKey}`);
              formData.append('timestamp', `${result.cloudinary.timestamp}`);
              formData.append('signature', `${result.cloudinary.signature}`);
            } else{
              formData.append('upload_preset', result.cloudinary.cloudinaryUploadPreset);
            }
            fetch(`${result.cloudinary.cloudinaryUrl}upload`,
              {
                method: 'POST',
                body: formData
              }
            ).then(response => ({ cloudinaryObj: response.json(), status: response.status })).then(({ cloudinaryObj, status }) => {
              if (status === 200) {
                cloudinaryObj.then((imageResult) => {
                  fetch(`/api/v1/attachImage/${result.updatedRequest.id}`, {
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
                      window.location.replace(`${window.location.origin}/requests/${result.updatedRequest.id}`);
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
