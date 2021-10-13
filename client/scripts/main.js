/// <reference path="../scripts/dom.js"/>
/// <reference path="ui-handler.js"/>
/// <reference path="./sessions.js"/>
/// <reference path="./components/friends-area.js"/>

const UI=new UIHandler();
const session=new Session();
const App=new class AppManager{

  popupCount=0;
  dataValidation={
    email:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    username:/^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
    password:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&._])[A-Za-z\d@$!%*#?&._]{6,50}$/
  };
  /**
   * 
   * @param {Date} date 
   */
  showFormatedTime(date){
    const milliInDay=8.64e+7;
    const milliInYear=3.154e+10;
    const milliInMin=60000;
    const istOffset=1.98e+7;

    const monthname=["January","February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    date=(new Date(date)).getTime();
    date=new Date(date+istOffset);
    const today=new Date(Date.now()+istOffset);
    if(today-date>milliInYear){
      return `${date.getDate()} ${monthname[date.getMonth()]}, ${date.getFullYear()}`;
    }
    if(today-date>milliInDay){
      return `${date.getDate()} ${monthname[date.getMonth()]}`;
    }
    if(today-date<milliInMin){
      return `Few seconds ago`;
    }
    return `${date.getHours()>12?date.getHours()-12:date.getHours()}:${date.getMinutes()} ${date.getHours()>12?"pm":"am"}`
  }
  /**
   * 
   * @param {string} userID
   */
  async populateFriendsList(){
    const token=localStorage.getItem('token');
    App.request("/chat",{
      method:"GET",
      headers:{
        "x-auth-token": token
      }
    }).then(data=>{
      data.forEach(friend=>{
        const component=new friendsArea(
          friend._id,
          friend.participants[0].userID===session.getCurrentUser()._id?friend.participants[1].userName:friend.participants[0].userName,
          friend.previewMessages,
          this.showFormatedTime(friend.previewMessages[0].updatedAt)
        );
        component.mount(UI.container.main.sub.friendsList);
      })

    });
  }
  async auth(){
    const token=localStorage.getItem('token');
    if(!token){
      UI.container.chat.unmount();
      UI.container.auth.mount(UI.container.main);
      return;
    }
    const request=await fetch("/auth",{
      method:"POST",
      headers:{
        "x-auth-token": token
      }
    }).catch(ex=>{
      UI.container.chat.unmount();
      UI.container.auth.mount(UI.container.main);
      App.popAlert("ERROR: ",ex)
    });

    if(request && request.ok){
      const user=await request.json();
      session.setCurrentUser(user);
      UI.container.auth.unmount();
      UI.container.chat.mount(UI.container.main);
      App.populateFriendsList();
    }
  }
  logout(){
    localStorage.removeItem("token");
    session.removeCurrentUser();
    window.location.reload();
  }
  /** @param {HTMLFormElement} form */
  async sendMessage(form){
    const formData=new FormData(form);
    App.request("/message",{
      method:"POST",
      body:new URLSearchParams(formData)
    }).then(data=>{
      // Message sent
    });
  }

  /** @param {Component} chatArea */
  async receiveMessage(chatArea){
    App.request("/message",{
      method:"GET",
      body:new URLSearchParams({chatId:20})
    }).then(data=>{
      // Message sent
    });
  }

  /**
   * Make a fetch request
   * @param {RequestInit} url
   * @param {RequestInfo} object
   * @returns {Promise<{}>}
   */
  async request(url,object=null){
    return new Promise(async function(resolve,reject){
      const request=await fetch(url,object).catch(ex=>{
        App.popAlert(ex);
        reject(ex);
      });
      if(request && request.ok)
        resolve(await request.json());
    });
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
          container.chat.mount(UI.container.main);
          session.setCurrentUser(user);
          App.populateFriendsList();
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
          container.chat.mount(UI.container.main);
          session.setCurrentUser(user);
          App.populateFriendsList();
        }else{
          App.popAlert(await request.text());
        }
      }
    }
  });

  const menu=new UIMenu("chat");
  let itemCount=0;
  menu.addItem("delete","Remove Last Item",()=>{
    if(itemCount>0)
      menu.removeItem("item"+--itemCount);
  });
  menu.addItem("insert","Add Item",()=>{
    menu.addItem("item"+itemCount,"Item "+itemCount+" added",()=>{});
    itemCount++;
  });
  menu.addItem("close","Close",()=>{
    menu.unmount();
  });
  container.chat.sub.messagesArea.event({
    /** @param {PointerEvent} event */
    contextmenu(event){
      event.preventDefault();
      menu.mount(container.chat);
      /** Preventing menu.element from displaying outside the container.chat.element */
      const gap_at_end=16;
      const width_diff=container.chat.element.clientWidth-menu.element.clientWidth-gap_at_end;
      const height_diff=container.chat.element.clientHeight-menu.element.clientHeight-gap_at_end;
      menu.style({
        top:(event.y<height_diff?event.y:height_diff)+"px",
        left:(event.x<width_diff?event.x:width_diff)+"px"
      });
    }
  });

  container.prompts.style({display:"none"});
});

window.addEventListener("load",function(){
  UI.init();
  App.auth();
});