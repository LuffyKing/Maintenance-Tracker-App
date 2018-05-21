document.getElementsByClassName('approveDetailBtn')[0].addEventListener('click',
() => {
  document.getElementsByClassName('modalBox')[0].classList.remove('displayNone');
  document.getElementsByClassName('modal')[0].classList.remove('displayNone');
}
);
document.getElementsByClassName('deleteBtn')[0].addEventListener('click',
() => {
  document.getElementsByClassName('modalBox')[1].classList.remove('displayNone');
  document.getElementsByClassName('modal')[0].classList.remove('displayNone');
}
);
document.querySelector('#disapproveModal .modalCancel').addEventListener('click',
() => {
  document.getElementById('disapproveModal').classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
}
);
document.querySelector('.modalCancel').addEventListener('click',
() => {
  document.getElementsByClassName('modalBox')[0].classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
}
);
document.getElementById('alertClose').addEventListener('click',
() => {
  document.getElementById('alerts').classList.toggle('displayNone');
}
);
document.getElementsByClassName('modalDelApprove')[0].addEventListener('click',
() => {
  document.getElementsByClassName('modalBox')[0].classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
  document.getElementById('alerts').classList.remove('displayNone');
  document.getElementById('alerts').classList.remove('requestDisapproved');
  document.getElementById('alerts').classList.add('requestApproved');
  document.getElementById('alertMessage').innerHTML="<strong>Success!</strong> The request has been approved!";
}
);
document.getElementsByClassName('modalDeldisapprove')[0].addEventListener('click',
() => {
  document.getElementById('disapproveModal').classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
  document.getElementById('alerts').classList.remove('displayNone');
  document.getElementById('alerts').classList.remove('requestApproved');
  document.getElementById('alerts').classList.add('requestDisapproved');
  document.getElementById('alertMessage').innerHTML="The request has been disapproved!";
}
);
