import { html, css, LitElement, unsafeCSS } from "lit";
import style from "./index.css?inline";

import "./components/Button/IconButton.js";
import "./components/Button/TextButton.js";
import "./components/MoleculeCanvas.js";
export class Main extends LitElement {
  static styles = unsafeCSS(style);

  static properties = {
    zoom: { type: Number },
    _bold: { type: Boolean },
    _italic: { type: Boolean },
    _underline: { type: Boolean },
    _delete: { type: Boolean },
    _lewis: { type: Boolean },
    _color: { type: Boolean },
    _highlight: { type: Boolean },
    _elements: { type: Array },
    _insertMode: { type: String },
    _bondMode: { type: Number },
    canvasList: { type: Array },
  };

  constructor() {
    super();
    this.zoom = 6;
    this._insertMode = "H";
    this._bondMode = 1;
    this.canvasList = [{}];
    this._elements = [
      {
        name: "H",
        description: "Wasserstoff",
      },
      {
        name: "C",
        description: "Kohlenstoff",
      },
      {
        name: "N",
        description: "Stickstoff",
      },
      {
        name: "O",
        description: "Sauerstoff",
      },
      {
        name: "S",
        description: "Schwefel",
      },
      {
        name: "F",
        description: "Flour",
      },
      {
        name: "P",
        description: "Phosphor",
      },
      {
        name: "Cl",
        description: "Chlor",
      },
      {
        name: "Br",
        description: "Brom",
      },
      {
        name: "I",
        description: "Iod",
      },
    ];
  }

  render() {
    return html` <div class="flex-column">
      <div class="menu-bar horizontal flex-row" id="menu-tools">
        <div class="sub-menu" id="sub-menu-view">
          <ww-chem-icon-button
            toggle
            tooltip="Ansicht &auml;ndern: Skelettschreibweise"
            iconName="skelett"
            ?active=${!this._lewis}
            @ww-chem-toggle=${(e) => {
              this._lewis = !e.detail.value;
            }}
          ></ww-chem-icon-button>
          <ww-chem-icon-button
            toggle
            active
            tooltip="Ansicht &auml;ndern: Lewis-Schreibweise"
            iconName="lewis"
            ?active=${this._lewis}
            @ww-chem-toggle=${(e) => {
              this._lewis = e.detail.value;
            }}
          ></ww-chem-icon-button>
          <ww-chem-icon-button
            tooltip="Heranzoomen"
            iconName="zoom_in"
            @ww-chem-click=${() => {
              if (this.zoom > 6) {
                this.zoom--;
              }
            }}
          ></ww-chem-icon-button>
          <ww-chem-icon-button
            tooltip="Rauszoomen"
            iconName="zoom_out"
            @ww-chem-click=${() => {
              if (this.zoom < 42) {
                this.zoom++;
              }
            }}
          ></ww-chem-icon-button>
        </div>
        <div class="sub-menu" id="sub-menu-undo-redo">
          <ww-chem-icon-button
            toggle
            tooltip="Textfarbe"
            iconName="text_color"
            @ww-chem-toggle=${(e) => (this._color = e.detail.value)}
          ></ww-chem-icon-button>
          <ww-chem-icon-button
            toggle
            tooltip="Farbig hinterlegen"
            iconName="highlight"
            @ww-chem-toggle=${(e) => (this._highlight = e.detail.value)}
          ></ww-chem-icon-button>
          <ww-chem-icon-button
            toggle
            tooltip="Fett"
            iconName="bold"
            @ww-chem-toggle=${(e) => (this._bold = e.detail.value)}
          ></ww-chem-icon-button>
          <ww-chem-icon-button
            toggle
            tooltip="Kurisv"
            iconName="italic"
            @ww-chem-toggle=${(e) => (this._italic = e.detail.value)}
          ></ww-chem-icon-button>
        </div>
        <div class="sub-menu" id="sub-menu-modes">
          <ww-chem-icon-button
            toggle
            ?active=${!this._delete}
            tooltip="Bearbeiten"
            iconName="cursor"
            @ww-chem-toggle=${(e) => (this._delete = !e.detail.value)}
          ></ww-chem-icon-button>
          <ww-chem-icon-button
            toggle
            ?active=${this._delete}
            tooltip="L&ouml;schen"
            iconName="eraser"
            @ww-chem-toggle=${(e) => (this._delete = e.detail.value)}
          ></ww-chem-icon-button>
        </div>
      </div>
      <div class="flex-row">
        <div class="content flex-row">
          ${this.canvasList.map((element) => {
            return html`
              <ww-chem-molecule-canvas
                @ww-chem-reactsTo=${(e) => {
                  this.canvasList = [
                    ...this.canvasList,
                    {
                      class: e.detail.value,
                    },
                  ];
                }}
                zoom=${this.zoom}
                class=${element.class}
                ?delete=${this._edit}
                ?bold=${this._bold}
                ?italic=${this._italic}
                ?delete=${this._delete}
                ?lewis=${this._lewis}
                ?textColor=${this._color}
                ?highlightColor=${this._highlight}
                insertMode=${this._insertMode}
                bondMode=${this._bondMode}
                test=${this.test}
              ></ww-chem-molecule-canvas>
            `;
          })}
        </div>
        <div class="menu-bar vertical flex-column" id="menu-objects">
          <div class="sub-menu" id="sub-menu-elements">
            ${this._elements.map((element) => {
              return html`
                <ww-chem-text-button
                  toggle
                  ?active=${this._insertMode === element.name}
                  tooltip=${element.description}
                  displayText=${element.name}
                  @ww-chem-toggle=${(e) => {
                    if (e.detail.value) {
                      this._insertMode = element.name;
                    } else if (this._insertMode === element.name) {
                      this._insertMode = null;
                    }
                  }}
                ></ww-chem-text-button>
              `;
            })}

            <ww-chem-icon-button
              tooltip="Neues Element"
              iconName="add"
              @ww-chem-click=${() => {
                const elementSymbol = prompt("Element Symbol");
                if (!elementSymbol) return alert("Element Symbol is required");
                const elementDescription = prompt("Element Description");
                if (!elementDescription)
                  return alert("Element Description is required");
                this._elements = [
                  ...this._elements,
                  {
                    name: elementSymbol,
                    description: elementDescription,
                  },
                ];
              }}
            ></ww-chem-icon-button>
          </div>
          <div class="sub-menu" id="sub-menu-verbindungen">
            <ww-chem-icon-button
              toggle
              tooltip="Einfachbindung"
              iconName="single"
              ?active=${this._bondMode === 1}
              @ww-chem-toggle=${(e) => {
                if (e.detail.value) {
                  this._bondMode = 1;
                } else if (this._bondMode === 1) {
                  this._bondMode = null;
                }
              }}
            ></ww-chem-icon-button>
            <ww-chem-icon-button
              toggle
              tooltip="Doppelbindung"
              iconName="double"
              ?active=${this._bondMode === 2}
              @ww-chem-toggle=${(e) => {
                if (e.detail.value) {
                  this._bondMode = 2;
                } else if (this._bondMode === 2) {
                  this._bondMode = null;
                }
              }}
            ></ww-chem-icon-button>
            <ww-chem-icon-button
              toggle
              tooltip="Dreifachbindung"
              iconName="triple"
              ?active=${this._bondMode === 3}
              @ww-chem-toggle=${(e) => {
                if (e.detail.value) {
                  this._bondMode = 3;
                } else if (this._bondMode === 3) {
                  this._bondMode = null;
                }
              }}
            ></ww-chem-icon-button>
          </div>
        </div>
      </div>
      <script src="main.js"></script>
    </div>`;
  }
}
customElements.define("ww-chemdraw", Main);
