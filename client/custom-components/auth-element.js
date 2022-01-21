
const authTemplate = document.createElement('template');
authTemplate.innerHTML = `

<div class="container absolute auth" c-id="auth" c-unmount="true">
      <div class="form-holder" active="login" c-id="formHolder" c-parent-id="auth">
        <form c-id="registerForm" c-parent-id="auth" c-unmount="true">
          <h2>Register</h2>
          <input type="text" name="name" placeholder="Full Name" required="required" />
          <input type="email" name="email" placeholder="Email" required="required" />
          <input type="text" name="username" placeholder="Username" required="required" minlength="4" maxlength="20"
            pattern="^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$"
            title="Minimum 4 characters, maximum 20 characters, numbers and letters are allowed, only special characters allowed are . (dot) and _ (underscore)" />
          <input type="password" name="password" placeholder="Password" required="required" minlength="6" maxlength="20"
            pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&._])[A-Za-z\d@$!%*#?&._]{6,50}$"
            title="Minimum 6 characters, maximum 50 characters, at least one letter, one number and one special character ( @ $ ! % * # ? & . _ )" />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" required="required" minlength="6"
            maxlength="20" />
          <button class="icon" type="submit" name="submit">
            <span>Register</span>
            <svg viewBox="0 0 32 32">
              <use xlink:href="#in-progress"></use>
            </svg>
          </button>
          <p class="alread-reg-msg">Already registered?
            <button class="link" type="reset">Login</button>
          </p>
        </form>
        <form c-id="loginForm" c-parent-id="auth">
          <h2>Sign In</h2>
          <input type="text" name="username" placeholder="Username" required="required" />
          <input type="password" name="password" placeholder="Password" required="required" />
          <button class="icon" type="submit" name="submit">
            <span>Sign In</span>
            <svg viewBox="0 0 32 32">
              <use xlink:href="#in-progress"></use>
            </svg>
          </button>
          <p class="alread-reg-msg">Doesn't have an account?
            <button class="link" type="reset">Register</button>
          </p>
        </form>
      </div>
    </div>

`;

class AuthElement extends HTMLElement {
  constructor () {
    super();
    this.appendChild(authTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }
  render() {
  }
}
window.customElements.define('auth-element', AuthElement);