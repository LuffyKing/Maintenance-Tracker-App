const pagination = (limit, func = 'insertRequestRow', profile = 'User', route = '/api/v1/users/requests/') => {
  const pagRow = document.getElementById('pagRowComp');
  for (let i = 2; i <= pagRow.childElementCount; i++) {
    if (document.getElementById(`${i}`) && i > limit) {
      document.getElementById(`${i}`).parentNode.removeChild(document.getElementById(`${i}`));
    }
  }
  for (let i = 2; i <= limit; i++) {
    if (!document.getElementById(`${i}`)) {
      const divElement = document.createElement('div');
      divElement.innerHTML = `<a id=${i} onclick="${func}(${i}, route='${route}', func='insertRequestRow', profile='${profile}')">${i}</a>`;
      pagRow.insertBefore(divElement.firstChild, pagRow.childNodes[pagRow.childNodes.length - 2]);
    }
  }
};
