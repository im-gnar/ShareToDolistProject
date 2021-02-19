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
  }

  render() {
    this.shadow.innerHTML = `
        <a class="hello Custom!" href="${this.href}">${this.text}</a>
      `;
  }
}