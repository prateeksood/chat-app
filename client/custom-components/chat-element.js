const chatTemplate = document.createElement('template');
chatTemplate.innerHTML = `

<div class="container absolute" c-id="chat" c-unmount="false">
      <aside id="left-section" c-id="sideBar" c-parent-id="chat">
        <div class="top-bar" id="left-top-bar">
          <button class="dp-holder" c-id="userDPHolder" c-parent-id="chat">
            <img src="resources/illustrations/profile_pic.svg" c-id="image" c-parent-id="userDPHolder" />
          </button>
          <div class="icons" c-id="actions" c-parent-id="chat">
            <button class="icon" title="Search" c-id="findPeople" c-parent-id="actions">
              <svg viewBox="0 0 32 32">
                <use xlink:href="#search"></use>
              </svg>
            </button>
            <button class="icon" title="Contacts" c-id="contacts" c-parent-id="actions">
              <svg viewBox="0 0 32 32">
                <use xlink:href="#contacts"></use>
              </svg>
            </button>
            <button class="icon" title="Settings" c-id="settings" c-parent-id="actions">
              <svg viewBox="0 0 32 32">
                <use xlink:href="#settings"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="left-main chat-list" c-id="chatList" c-parent-id="chat">
          <form action="#" class="search-bar" c-id="searchBar" c-parent-id="chatList">
            <input type="text" name="query" c-id="searchBarInput" c-parent-id="chatList" minlength="1"
              placeholder="Search chat" autocomplete="off" />
            <button type="search" name="submit">Search</button>
          </form>
          <div class="list-area" c-id="emptyArea" c-parent-id="chatList">
            <div class="empty-container">
              <div class="illustration"></div>
              <p>No conversations found</p>
              <button class="link" c-id="startChat" c-parent-id="emptyArea">Start a conversation</button>
            </div>
          </div>
        </div>
        <div class="left-main" c-id="contactList" c-parent-id="chat" c-unmount="true">
          <form action="#" class="search-bar" c-id="searchBar" c-parent-id="contactList">
            <input type="text" name="query" c-id="searchBarInput" c-parent-id="contactList" minlength="1"
              placeholder="Search contact" autocomplete="off" />
            <button type="search" name="submit">Search</button>
          </form>
          <div class="list-area user-list" c-id="emptyArea" c-parent-id="contactList">
            <div class="empty-container">
              <div class="illustration"></div>
              <p>No contacts found</p>
              <button class="link" c-id="newContact" c-parent-id="emptyArea">Add new contact</button>
            </div>
          </div>
        </div>
        <div class="left-main" c-id="peopleSearchList" c-parent-id="chat" c-unmount="true">
          <form action="#" class="search-bar" c-id="searchBar" c-parent-id="peopleSearchList">
            <input type="text" name="query" minlength="4" placeholder="Username" autocomplete="off" />
            <button type="search" name="submit">Search</button>
          </form>
          <div class="list-area user-list" c-id="emptyArea" c-parent-id="peopleSearchList">
            <div class="empty-container">
              <div class="illustration"></div>
              <p>People not found</p>
              <button class="link">Try again</button>
            </div>
          </div>
        </div>
        <div class="bottom-bar info-area" c-id="infoArea" c-parent-id="chat" c-unmount="true">
          <div class="line" c-id="content" c-parent-id="infoArea">Unable to connect to the server, please check your
            internet connection.</div>
          <!-- <div class="line illustration"></div> -->
          <div class="line" c-id="buttonLine" c-parent-id="infoArea">
            <button c-id="button" c-parent-id="infoArea">Try again</button>
          </div>
          <div class="line" c-id="time" c-parent-id="infoArea">Retrying to connect in 5s</div>
        </div>
        <div class="bottom-bar options">
          <div class="icons">
            <button class="icon" title="Collapse" c-id="pinOption" c-parent-id="chat">
              <svg class="pin" viewBox="0 0 32 32">
                <use xlink:href="#panel-left"></use>
              </svg>
              <svg class="unpin" viewBox="0 0 32 32">
                <use xlink:href="#panel-left-filled"></use>
              </svg>
            </button>
          </div>
        </div>
      </aside>
      <section class="messages-area" c-id="messagesArea" c-parent-id="chat">
        <div class="chat-area" c-id="emptyArea" c-parent-id="messagesArea">
          <div class="empty-container">
            <div class="illustration"></div>
            <p>Click on a contact/chat to view the conversation</p>
          </div>
        </div>
      </section>
    </div>
    
  `;

class ChatElement extends HTMLElement {
  constructor () {
    super();
    this.appendChild(chatTemplate.content.cloneNode(true));
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
window.customElements.define('chat-element', ChatElement);