/// <reference path="dom.js"/>

const App={
  element:{
    containerChat:DOM.id("chat-container"),
    containerLogin:DOM.id("login-container"),
    formLogin:DOM.id("login-form"),
    formRegister:DOM.id("register-form"),
    formMessage:DOM.id("message-form"),
    holderResponse:DOM.id("message-holder")
  },
  dataValidation:{
    email:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    username:/^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
    password:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&._])[A-Za-z\d@$!%*#?&._]{6,50}$/
  },
  alert(...messages){
    // console.log(...messages);
    App.element.holderResponse.innerHTML=messages.join("<br/>");
  }
};

App.element.formLogin.addEventListener("submit",async event=>{
  event.preventDefault();
  const formData=new FormData(event.target);
  const request=await fetch("/login",{
    method:"POST",
    body:new URLSearchParams(formData)
  }).catch(ex=>App.alert("ERROR: ",ex));
  if(request)
    App.alert(await request.text());
});

App.element.formRegister.addEventListener("submit",async event=>{
  event.preventDefault();
  const formData=new FormData(event.target);
  const email=formData.get("email");
  const username=formData.get("username");
  const password=formData.get("password");
  const confirmPassword=formData.get("confirmPassword");
  if(!App.dataValidation.email.test(email)){
    App.alert("Invalid email address")
    return;
  }
  if(!App.dataValidation.username.test(username)){
    App.alert("Invalid username. Requirements: Minimum 4 characters, maximum 20 characters, numbers and letters are allowed, only special characters allowed are . (dot) and _ (underscore)")
    return;
  }
  if(App.dataValidation.password.test(password)){
    if(password!==confirmPassword){
      App.alert("Password does not match");
      return;
    }
  }else{
    App.alert("Invalid password. Requirements: Minimum 6 characters, maximum 50 characters, at least one letter, one number and one special character ( @ $ ! % * # ? & . _ )");
    return;
  }
  const request=await fetch("/register",{
    method:"POST",
    body:new URLSearchParams(formData)
  }).catch(ex=>App.alert("Error: ",ex));
  if(request)
    App.alert(await request.text());
});

App.element.formLogin.addEventListener("reset",event=>{
  event.preventDefault();
  event.target.closest("#form-holder").removeAttribute("active");
});
App.element.formRegister.addEventListener("reset",event=>{
  event.preventDefault();
  event.target.closest("#form-holder").setAttribute("active","login");
});