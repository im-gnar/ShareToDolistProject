export default class NavButton extends HTMLElement {

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  get text() {
    return this.getAttribute("text");
  }

  get href() {
    return this.getAttribute("href");
  }

  static get observedAttributes() {
    return ["href", "text"];
  }

  attributeChangedCallback() {
    this.render();
    window.addEventListener('DOMContentLoaded', () => {
      console.log('reloaded!')
      this.render();
    });
  }

  render() {
    this.shadow.innerHTML = `
        <button class="text-lg font-medium text-white py-4 transition-colors bg-lime-500 hover:bg-lime-600" 
        onclick="location.href = '${this.href}'">${this.text}</button>
      `;
  }
}