
ifr = document.createElement('iframe')
ifr.src = document.currentScript.getAttribute('link')
parent = document.querySelector('.resources')
parent.appendChild(ifr)