addEventListener('DOMContentLoaded', ()=>{
  fetch('/verify', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'authorization':localStorage.token
    }
  }).then(response => response.status)
    .then(status => {
      console.log(status)
      if (status !== 200){
        window.location.replace('../SigninPage.html');
      } else{
        const body = document.getElementsByTagName("BODY")[0];
        body.classList.remove('displayNone')
      }
    });
});
