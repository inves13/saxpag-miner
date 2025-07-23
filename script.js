const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");
const toRegister = document.getElementById("toRegister");
const toLogin = document.getElementById("toLogin");

// Alternar entre login e registro
btnLogin.onclick = () => {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  btnLogin.classList.add("active");
  btnRegister.classList.remove("active");
};

btnRegister.onclick = () => {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
  btnLogin.classList.remove("active");
  btnRegister.classList.add("active");
};

toRegister.onclick = btnRegister.onclick;
toLogin.onclick = btnLogin.onclick;

// Cadastro
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const senha = document.getElementById("registerSenha").value;

  firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then(() => {
      alert("Cadastro realizado com sucesso!");
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
      btnLogin.classList.add("active");
      btnRegister.classList.remove("active");
    })
    .catch((error) => {
      alert("Erro no cadastro: " + error.message);
    });
});

// Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  firebase.auth().signInWithEmailAndPassword(email, senha)
    .then(() => {
      window.location.href = "tela-principal.html";
    })
    .catch((error) => {
      alert("Erro no login: " + error.message);
    });
});
