
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
document.getElementsByClassName('deleteBtn')[0].addEventListener('click',
() => {
  document.getElementsByClassName('modalBox')[0].classList.remove('displayNone');
  document.getElementsByClassName('modal')[0].classList.remove('displayNone');
}
);
