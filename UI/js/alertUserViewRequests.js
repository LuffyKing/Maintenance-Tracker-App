document.getElementsByClassName('del')[0].addEventListener('click',
() => {
  document.getElementsByClassName('modalBox')[0].classList.remove('displayNone');
  document.getElementsByClassName('modal')[0].classList.remove('displayNone');
}
);
document.getElementsByClassName('modalCancel')[0].addEventListener('click',
() => {
  document.getElementsByClassName('modalBox')[0].classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
}
);
document.getElementsByClassName('modalDelApprove')[0].addEventListener('click',
() => {
  document.getElementsByClassName('modalBox')[0].classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
}
);
document.getElementsByClassName('modalDelApprove')[0].addEventListener('click',
() => {
  document.getElementsByClassName('modalBox')[0].classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
  document.getElementById('alerts').classList.remove('displayNone');
  document.getElementById('alerts').classList.remove('requestApproved');
  document.getElementById('alerts').classList.add('requestDisapproved');
  document.getElementById('alertMessage').innerHTML="The request has been deleted!";
}
);
document.getElementById('alertClose').addEventListener('click',
() => {
  document.getElementById('alerts').classList.toggle('displayNone');
}
);
