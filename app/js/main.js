
// Forms modal

var link = document.querySelector(".contact-button"),
    popup = document.querySelector(".popup"),
    close = document.querySelector(".popup-close"),
    form = popup.querySelector("form"),
    login = form.querySelector("[name=name]"),
    mail = form.querySelector("[name=email]"),
    storageLogin = localStorage.getItem("login"),
    storageMail = localStorage.getItem("mail");

link.addEventListener("click", function(event) {
  event.preventDefault();
  popup.classList.add("popup-show");

  if(storageLogin) {
    login.value = storageLogin;
    mail.focus();
  } else {
    login.focus();
  }
});

close.addEventListener("click", function(event) {
  event.preventDefault();
  popup.classList.remove("popup-show", "popup-error");
});

form.addEventListener("submit", function(event) {
  if(!login.value||!mail.value) {
    event.preventDefault();
    popup.classList.remove("popup-error");
    popup.offsetWidth = popup.offsetWidth;
    popup.classList.add("popup-error");
    }  else {
      localStorage.setItem("login", login.value);
      localStorage.setItem("mail", mail.value);
  }
});

window.addEventListener("keydown", function (event) {
  if (event.keyCode == 27 && popup.classList.contains("popup-show")) {
    popup.classList.remove("popup-show", "popup-error")
  }
});
