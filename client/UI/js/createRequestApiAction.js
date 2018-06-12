const createRequestSubmit = () => {
  const form =  document.getElementById('createRequestForm');
  const image = form.elements.imageOfRequest.files.length > 0 ? form.elements.imageOfRequest.files[0] : undefined;
  const body = JSON.stringify({
    title: form.elements.title.value,
    type: form.elements.type.value,
    location: form.elements.requestLocation.value,
    description: form.elements.description.value,
  });
  fetch('/api/v1/users/requests', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: localStorage.token
    }),
    body
  })
    .then(response => ({ jsonObj: response.json(), status: response.status })).then(({ jsonObj, status }) => {
      if (status !== 201) {
        jsonObj.then((result) => {
          alertAction('requestApproved', 'requestDisapproved', result.message);
        });
      } else {
        if (typeof image === 'undefined') {
          jsonObj.then((result) => {
            window.location.replace(`${window.location.origin}/requests/${result.request.id}`);
          });
        } else {
          jsonObj.then((result) => {
            const formData = new FormData();

            formData.append('file', image);
            formData.append('upload_preset', result.cloudinary.cloudinaryUploadPreset);
            fetch(`${result.cloudinary.cloudinaryUrl}upload`,
              {
                method: 'POST',
                body: formData
              }
            ).then(response => ({ cloudinaryObj: response.json(), status: response.status })).then(({ cloudinaryObj, status }) => {
              if (status === 200) {
                cloudinaryObj.then((imageResult) => {
                  fetch(`/api/v1/attachImage/${result.request.id}`, {
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
                      window.location.replace(`${window.location.origin}/requests/${result.request.id}`);
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
