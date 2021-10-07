const UI=new UIHandler();

const App=new class AppManager{
  async auth(){
    const token=localStorage.getItem('token');
    const request=await fetch("/auth",{
      method:"POST",
      headers:{
        "x-auth-token": token
      }
    }).catch(ex=>App.alert("ERROR: ",ex));
    if(request){
      if(request.ok){
        const user=await request.json();
        DOM.style(App.element.containerLogin,{display:"none"});
        App.alert(`logged in as ${user.username}`);
      }
    }
  }
  alert(){}
};

UI.onInit(ui=>{

  const {container}=ui; // UI == ui

  container.formLogin.event({
    reset(event){
      event.preventDefault();
      container.holderForm.removeAttr("active");
    }
  });

  container.formRegister.event({
    reset(event){
      event.preventDefault();
      container.holderForm.attr({active:"login"});
    }
  });

  container.login.unmount();
});

window.addEventListener("load",function(){
  UI.init();
});