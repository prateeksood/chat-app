/// <reference path="../scripts/dom.js"/>
/// <reference path="ui-handler.js"/>

const UI=new UIHandler();

const App=new class AppManager{

  popupCount=0;
  dataValidation={
    email:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    username:/^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
    password:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&._])[A-Za-z\d@$!%*#?&._]{6,50}$/
  };
  async auth(){
    const token=localStorage.getItem('token');
    const request=await fetch("/auth",{
      method:"POST",
      headers:{
        "x-auth-token": token
      }
    }).catch(ex=>{
      App.popAlert("ERROR: ",ex)
    });

    if(request && request.ok){
      const user=await request.json();
      UI.container.auth.unmount();
      UI.container.chat.mount(UI.container.main);
    }
  }

  popAlert(...content){
    const component=new UINotification(content.join("<br/>"));
    component.mount(UI.container.notifications);
  }
  popConfirm(title,content){
    UI.container.prompts.style({display:"initial"});
    const component=new Popup(title,content,[{
      type:"accept",
      value:"Accept",
      action(popup,event){
        console.log(event);
      }
    },{type:"cancel"}]);
    component.on("close",()=>{
      this.popupCount--;
      if(this.popupCount<=0)
        UI.container.prompts.style({display:"none"});
    });
    component.mount(UI.container.prompts);
    this.popupCount++;
  }

  Notification=class Notification{
    constructor(message){
      return 
    }
  };
};

UI.onInit(ui=>{

  const {container} = ui; // UI == ui

  const {loginForm, registerForm, formHolder} = container.auth.sub;

  // Login Form events
  loginForm.event({
    reset(event){
      event.preventDefault();
      // formHolder.removeAttr("active");
      registerForm.mount(formHolder);
      loginForm.unmount();
    },
    async submit(event){
      event.preventDefault();
      const formData=new FormData(event.target);
      event.target.elements.submit.disabled=true;
      const request=await fetch("/login",{
        method:"POST",
        body:new URLSearchParams(formData)
      }).catch(ex=>App.popAlert("ERROR: ",ex));
      setTimeout(()=>event.target.elements.submit.disabled=false,1000);
      if(request){
        if(request.ok){
          const user=await request.json();
          localStorage.setItem("token",user.token);
          App.popAlert("Login successful!🙌");
          container.auth.unmount();
        }else{
          App.popAlert(await request.text());
        }
      }
    }
  });

  // Register Form events
  registerForm.event({
    reset(event){
      event.preventDefault();
      // formHolder.attr({active:"login"});
      loginForm.mount(formHolder);
      registerForm.unmount();
    },
    async submit(event){
      event.preventDefault();
      const formData=new FormData(event.target);
      const email=formData.get("email");
      const username=formData.get("username");
      const password=formData.get("password");
      const confirmPassword=formData.get("confirmPassword");
      if(!App.dataValidation.email.test(email)){
        App.popAlert("Invalid email address")
        return;
      }
      if(!App.dataValidation.username.test(username)){
        App.popAlert("Invalid username. Requirements: Minimum 4 characters, maximum 20 characters, numbers and letters are allowed, only special characters allowed are . (dot) and _ (underscore)")
        return;
      }
      if(App.dataValidation.password.test(password)){
        if(password!==confirmPassword){
          App.popAlert("Password does not match");
          return;
        }
      }else{
        App.popAlert("Invalid password. Requirements: Minimum 6 characters, maximum 50 characters, at least one letter, one number and one special character ( @ $ ! % * # ? & . _ )");
        return;
      }
      event.target.elements.submit.disabled=true;
      const request=await fetch("/register",{
        method:"POST",
        body:new URLSearchParams(formData)
      }).catch(ex=>App.popAlert("Error: ",ex));
      event.target.elements.submit.disabled=false;
      if(request){
        if(request.ok){
          const user=await request.json();
          localStorage.setItem("token",user.token);
          App.popAlert("Registration successful!😍");
          container.auth.unmount();
        }else{
          App.popAlert(await request.text());
        }
      }
    }
  });

  container.prompts.style({display:"none"});
});

window.addEventListener("load",function(){
  UI.init();
  App.auth();
});