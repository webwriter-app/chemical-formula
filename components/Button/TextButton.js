import { LitElement, html, svg, css } from "lit";

export class TextButton extends LitElement {
  static styles = css`
    .menu-button {
      position: relative;
      background: none;
      border: none;
      border-radius: 0.2rem;
      width: 2rem;
      height: 2rem;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.2rem;
      overflow: visible;
    }
    .tooltip {
      opacity: 0;
      padding: 0.2rem 0.4rem;
      border-radius: 0.2rem;
      white-space: nowrap;
      position: absolute;
      right: 0;
      bottom: -1rem;
      background-color: black;
      color: white;
      font-size: 0.5rem;
      pointer-events: none;
      transition: opacity 0.2s ease-in-out;
      font-family: sans-serif;
      z-index: 100;
    }
    .content-element-menu-side-button .tooltip {
      bottom: calc(50% - 2rem);
    }
    .menu-button:hover .tooltip {
      opacity: 1;
      transition: opacity 0.2s ease-in-out 1s;
    }
    .menu-button:not(.active):hover {
      color: gray;
    }
    .menu-button.active {
      color: #0284c7;
      fill: #0284c7;
    }
    .chem-element {
      font-weight: 800;
    }
  `;

  static properties = {
    tooltip: { type: String },
    displayText: { type: String },
    toggle: { type: Boolean },
    active: { type: Boolean },
  };

  handleClick(e) {
    if (this.toggle) {
      this.active = !this.active;
      this.dispatchEvent(
        new CustomEvent("ww-chem-toggle", {
          detail: { value: this.active },
          composed: true,
        })
      );
    } else {
      this.dispatchEvent(
        new CustomEvent("ww-chem-click", {
          detail: {},
          composed: true,
        })
      );
    }
  }

  render() {
    return html`
      <button
        @click="${this.handleClick}"
        class=${this.active ? "menu-button active" : "menu-button"}
      >
        <span class="chem-element">${this.displayText}</span>
        <label class="tooltip">${this.tooltip}</label>
      </button>
    `;
  }
}

customElements.define("ww-chem-text-button", TextButton);
