/// <reference path="dom.js"/>

const App=new class{
  element={
    containerChat: DOM.id("chat-container"),
    containerLogin: DOM.id("login-container"),
    formHolder: DOM.id("form-holder"),
    formLogin: DOM.id("login-form"),
    formRegister: DOM.id("register-form"),
    formMessage: DOM.id("message-form"),
    holderResponse: DOM.id("message-holder")
  };
  createLoginContainer(){
    return DOM.create("div",{
      class:"container absolute",
      id:"login-container",
      children:[
        DOM.create("div",{id:"message-holder"}),
        DOM.create("div",{
          id:"form-holder",
          active:"login",
          children:[
            DOM.create("form",{
              id:"register-form",
              action:"/register",
              method:"post",
              children:[
                DOM.create("h2",{text:"Register"}),
                DOM.create("input",{
                  type:"text",
                  name:"fullname",
                  placeholder:"Full Name",
                  required:true
                }),
                DOM.create("input",{
                  type:"email",
                  name:"email",
                  placeholder:"Email",
                  required:true
                }),
                DOM.create("input",{
                  type:"text",
                  name:"username",
                  placeholder:"Username",
                  required:true,
                  minlength:4,
                  maxlength:20
                }),
                DOM.create("input",{
                  type:"password",
                  name:"password",
                  placeholder:"Password",
                  required:true,
                  minlength:6,
                  maxlength:20
                }),
                DOM.create("input",{
                  type:"password",
                  name:"confirmPassword",
                  placeholder:"Confirm Password",
                  required:true,
                  minlength:6,
                  maxlength:20
                }),
                DOM.create("button",{
                  class:"icon",
                  type:"submit",
                  name:"submit",
                  placeholder:"Submit",
                  children:[
                    DOM.create("span",{text:"Register"}),
                    // <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
                    //   <use xlink:href="#in-progress"></use>
                    // </svg>
                  ]
                }),
                DOM.create("p",{
                  class:"alread-reg-msg",
                  text:"Already registered?",
                  children:[
                    DOM.create("input",{
                      type:"reset",
                      value:"Login"
                    })
                  ]
                })
              ]
            },{/** No style */},{
              async submit(event){
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
                event.target.elements.submit.disabled=true;
                const request=await fetch("/register",{
                  method:"POST",
                  body:new URLSearchParams(formData)
                }).catch(ex=>App.alert("Error: ",ex));
                event.target.elements.submit.disabled=false;
                if(request){
                  if(request.ok){
                    const user=await request.json();
                    localStorage.setItem("token",user.token);
                    App.alert("Registration successful!😍");
                    DOM.style(App.element.containerLogin,{display:"none"});
                  }else{
                    App.alert(await request.text());
                  }
                }
              },  // onsumit
              reset(event){
                event.preventDefault();
                DOM.attr(App.element.formHolder,{active:"login"});
              }  // onreset
            }),  // Registeration form
            DOM.create("form",{
              id:"register-form",
              action:"/register",
              method:"post",
              children:[
                DOM.create("h2",{text:"Sign In"}),
                DOM.create("input",{
                  type:"text",
                  name:"username",
                  placeholder:"Username",
                  required:true
                }),
                DOM.create("input",{
                  type:"password",
                  name:"password",
                  placeholder:"Password",
                  required:true
                }),
                DOM.create("button",{
                  class:"icon",
                  type:"submit",
                  name:"submit",
                  placeholder:"Submit",
                  children:[
                    DOM.create("span",{text:"Sign In"}),
                    // <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
                    //   <use xlink:href="#in-progress"></use>
                    // </svg>
                  ]
                }),
                DOM.create("p",{
                  class:"alread-reg-msg",
                  text:"Doesn't have an account?",
                  children:[
                    DOM.create("input",{
                      type:"reset",
                      value:"Register"
                    })
                  ]
                })
              ]
            },{/** No style */},{
              async submit(event){
                event.preventDefault();
                const formData=new FormData(event.target);
                event.target.elements.submit.disabled=true;
                const request=await fetch("/login",{
                  method:"POST",
                  body:new URLSearchParams(formData)
                }).catch(ex=>App.alert("ERROR: ",ex));
                setTimeout(()=>event.target.elements.submit.disabled=false,1000);
                if(request){
                  if(request.ok){
                    const user=await request.json();
                    localStorage.setItem("token",user.token);
                    App.alert("Login successful!🙌");
                    DOM.style(App.element.containerLogin,{display:"none"});
                  }else{
                    App.alert(await request.text());
                  }
                }
              },  // onsubmit
              reset(event){
                event.preventDefault();
                App.element.formHolder.removeAttribute("active");
              }  // onreset
            })  // Login form
          ]
        })  // Form Holder
      ]
    });
  }
};