function approveDetailBtn(){
  document.getElementsByClassName('modalBox')[0].classList.remove('displayNone');
  document.getElementsByClassName('modal')[0].classList.remove('displayNone');
}
function del(){
  document.getElementsByClassName('modalBox')[1].classList.remove('displayNone');
  document.getElementsByClassName('modal')[0].classList.remove('displayNone');
}
function resolveBtnNon100(){
  document.getElementsByClassName('modalBox')[2].classList.remove('displayNone');
  document.getElementsByClassName('modal')[0].classList.remove('displayNone');
}
function disapproveCancel(){
  document.getElementById('disapproveModal').classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
}
function resolveCancel(){
  document.getElementById('resolveModal').classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
}
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
function modalDelApprove(){
  document.getElementsByClassName('modalBox')[0].classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
  document.getElementById('alerts').classList.remove('displayNone');
  document.getElementById('alerts').classList.remove('requestDisapproved');
  document.getElementById('alerts').classList.add('requestApproved');
  document.getElementById('alertMessage').innerHTML="<strong>Success!</strong> The request has been approved!";
}
function modalDeldisapprove(){
  document.getElementById('disapproveModal').classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
  document.getElementById('alerts').classList.remove('displayNone');
  document.getElementById('alerts').classList.remove('requestApproved');
  document.getElementById('alerts').classList.add('requestDisapproved');
  document.getElementById('alertMessage').innerHTML="The request has been disapproved!";
}
function modalDelResolve(){
  document.getElementById('resolveModal').classList.add('displayNone');
  document.getElementsByClassName('modal')[0].classList.add('displayNone');
  document.getElementById('alerts').classList.remove('displayNone');
  document.getElementById('alerts').classList.remove('requestDisapproved');
  document.getElementById('alerts').classList.add('requestApproved');
  document.getElementById('alertMessage').innerHTML="The request has been resolved!";
};
