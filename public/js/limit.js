document.addEventListener('DOMContentLoaded', () => {
  const array = [];
  const limits = [];
  const elements = document.querySelectorAll('.vLimit');
  elements.forEach(ele => {
    limits.push(Number(ele.value));
    array.push([]);
  });

  const length = document.querySelectorAll('.vLimit').length;
  for (let i = 0; i < length; i++) {
    let t = '.cName' + i;
    let count = document.querySelectorAll(t);
    count.forEach(ele => {
      ele.addEventListener('click', (e) => {
        let parent = e.target.parentNode;
        let forAttribue = parent.getAttribute('for');
        let i = Number(forAttribue[forAttribue.length - 2]);
        let j = Number(forAttribue[forAttribue.length - 1]);
        if (e.target.checked) {
          array[i].push(j);
          if (array[i].length > limits[i]) {
            let k = array[i].shift();
            let d = document.querySelector('#cName' + i + k);
            d.checked = false;
          }
        } else {
          let index = array[i].indexOf(j);
          if (index !== -1) {
            array[i].splice(index, 1);
          }
        }
      });
    });
  }


  document.querySelector('#submitbtn').addEventListener('click', (e) => {
    let err = false;
    let msg = '';
    for(let i = 0; i < limits.length; i++) {
      let count = document.querySelectorAll(`.cName${i}:checked`).length;
      if (count < 1) {
        let ele = document.querySelector(`.cName${i}`).parentNode.parentNode.parentNode;
        ele = ele.firstElementChild;
        msg += `Select at least 1 from ${ele.textContent} <br>`;
        err = true;
      }
    }
    e.preventDefault();
    if (err) {
      let node = document.querySelector('#err');
      node.innerHTML = `<h4>${msg}</h4>`;
    } else {
      const sound = new Audio();
      sound.src = '/audio/beep.mp3';
      sound.play();
      setTimeout(() => { document.forms['electionVoting'].submit(); }, 500);
    }
  });
});