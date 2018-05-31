'use strict';

document.getElementById('hamburger').addEventListener('click', function () {
  console.log(document.getElementById('navbar'));
  document.getElementById('navbar').classList.toggle("responsive");
});