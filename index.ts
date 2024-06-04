import { html, css, LitElement, unsafeCSS, TemplateResult, PropertyValueMap } from 'lit';
import mainStyles from './style.js';

import './components/Button/IconButton.js';
import './components/Button/TextButton.js';
import './components/MoleculeCanvas.js';

import icons from './assets/VectorGraphics.js';

import { customElement, property } from 'lit/decorators.js';
import { query } from 'lit/decorators/query.js';

import { LitElementWw } from '@webwriter/lit';
import { MoleculeCanvas } from './components/MoleculeCanvas.js';
import { IconButton } from './components/Button/IconButton.js';
import { TextButton } from './components/Button/TextButton.js';

import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import SlTooltip from '@shoelace-style/shoelace/dist/components/tooltip/tooltip.component.js';

import {
    faPlus,
    biPerson,
    biPcDisplayHorizontal,
    biPhone,
    biType,
    biMarkerTip,
    biHiglighter,
    biTypeItalic,
    biTypeBold,
    biEraser,
    cSingle,
    cDouble,
    cTripple,
    biEyeDropper,
    biArrowLeft,
} from './icons.js';
import { PeriodicTable } from './components/PeriodicTable.js';

@customElement('webwriter-chemdraw')
export class ChemDraw extends LitElementWw {
    public static get styles() {
        return [mainStyles];
    }

    @property({ type: Number, attribute: false, reflect: false })
    zoom: number = 6;

    @property({ type: Boolean }) _bold = false;
    @property({ type: Boolean }) _italic = false;
    @property({ type: Boolean }) _underline = false;
    @property({ type: Boolean }) _delete = false;
    @property({ type: Boolean }) _lewis = false;
    @property({ type: Boolean }) _color = false;
    @property({ type: Boolean }) _highlight = false;
    @property({ type: Array }) _elements = [];
    @property({ type: String }) _insertMode = 'H';
    @property({ type: Number }) _bondMode = 1;
    @property({ type: Boolean }) _elementselect = false;

    @property({ type: Array })
    canvasList: Array<any> = [];

    @query('#toolboxButtons') toolboxButtons: HTMLElement;

    constructor() {
        super();
        this.zoom = 6;
        this._insertMode = 'H';
        this._bondMode = 1;
        this.canvasList = [{}];
        this._elements = [
            {
                name: 'H',
                description: 'Wasserstoff',
            },
            {
                name: 'C',
                description: 'Kohlenstoff',
            },
            {
                name: 'N',
                description: 'Stickstoff',
            },
            {
                name: 'O',
                description: 'Sauerstoff',
            },
            {
                name: 'S',
                description: 'Schwefel',
            },
            {
                name: 'F',
                description: 'Flour',
            },
            {
                name: 'P',
                description: 'Phosphor',
            },
            {
                name: 'Cl',
                description: 'Chlor',
            },
            {
                name: 'Br',
                description: 'Brom',
            },
            {
                name: 'I',
                description: 'Iod',
            },
        ];

        this.addEventListener('wheel', (e) => {
            e.preventDefault();

            if (e.deltaY > 0) {
                if (this.zoom < 42) {
                    this.zoom++;
                }
            } else {
                if (this.zoom > 6) {
                    this.zoom--;
                }
            }
        });
    }

    static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {}

    public static get scopedElements() {
        return {
            'ww-chem-icon-button': IconButton,
            'ww-chem-text-button': TextButton,
            'ww-chem-molecule-canvas': MoleculeCanvas,
            'webwriter-periodic-table': PeriodicTable,
            'sl-button': SlButton,
            'sl-tooltip': SlTooltip,
        };
    }

    render() {
        return html`
            ${this.toolboxTemplate()}
            <div class="flex-column">
                <div class="menu-bar horizontal flex-row" id="menu-tools">
                    <div class="sub-menu" id="sub-menu-view">
                        <!-- <ww-chem-icon-button
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
                        ></ww-chem-icon-button> -->
                        <!-- <ww-chem-icon-button
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
                        ></ww-chem-icon-button> -->
                    </div>
                    <div class="sub-menu" id="sub-menu-undo-redo">
                        <!-- <ww-chem-icon-button
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
                        ></ww-chem-icon-button> -->
                    </div>
                    <div class="sub-menu" id="sub-menu-modes">
                        <!-- <ww-chem-icon-button
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
                        ></ww-chem-icon-button> -->
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
                    <div class="menu-bar vertical flex-column" id="menu-objects" style="display:none">
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
                                    const elementSymbol = prompt('Element Symbol');
                                    if (!elementSymbol) return alert('Element Symbol is required');
                                    const elementDescription = prompt('Element Description');
                                    if (!elementDescription) return alert('Element Description is required');
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
            </div>
            <webwriter-periodic-table
                class="periodic-table"
                style=${this._elementselect ? 'display: block;' : 'display: none;'}
                @element-click=${(e) => {
                    this._insertMode = e.detail.element.symbol;
                }}
            ></webwriter-periodic-table>
        `;
    }

    private toolboxTemplate(): TemplateResult {
        return html`
            <div class="toolbox">
                <sl-button
                    size="large"
                    circle
                    class="toolbox__open"
                    @click=${() => {
                        if (this._elementselect) {
                            this._elementselect = false;
                        } else {
                            this.openToolbox();
                        }
                    }}
                    id="toolboxButton"
                >
                    ${this._elementselect ? biArrowLeft : faPlus}
                </sl-button>

                <div class="toolbox__buttons closed" id="toolboxButtons">
                    <div class="toolbox__buttongroup">
                        <!-- <sl-tooltip content="Host" placement="left"> -->
                        <sl-button circle class="toolbox__btn"> ${biType} </sl-button>
                        <!-- </sl-tooltip> -->
                        <div class="toolbox__subbuttons">
                            <sl-tooltip content="Highlight Cell" placement="top">
                                <sl-button
                                    circle
                                    class="toolbox__btn"
                                    variant=${this._highlight ? 'primary' : 'default'}
                                    @click=${() => {
                                        this._highlight = !this._highlight;
                                    }}
                                >
                                    ${biMarkerTip}
                                </sl-button>
                            </sl-tooltip>
                            <sl-tooltip content="Highlight Text" placement="top">
                                <sl-button
                                    circle
                                    class="toolbox__btn"
                                    variant=${this._color ? 'primary' : 'default'}
                                    @click=${() => {
                                        this._color = !this._color;
                                    }}
                                >
                                    ${biHiglighter}
                                </sl-button>
                            </sl-tooltip>
                            <sl-tooltip content="Italic" placement="top">
                                <sl-button
                                    circle
                                    class="toolbox__btn"
                                    variant=${this._italic ? 'primary' : 'default'}
                                    @click=${() => {
                                        this._italic = !this._italic;
                                    }}
                                >
                                    ${biTypeItalic}
                                </sl-button>
                            </sl-tooltip>
                            <sl-tooltip content="Bold" placement="top">
                                <sl-button
                                    circle
                                    class="toolbox__btn"
                                    variant=${this._bold ? 'primary' : 'default'}
                                    @click=${() => {
                                        this._bold = !this._bold;
                                    }}
                                >
                                    ${biTypeBold}
                                </sl-button>
                            </sl-tooltip>
                        </div>
                    </div>
                    <div class="toolbox__buttongroup">
                        <!-- <sl-tooltip content="Host" placement="left"> -->
                        <sl-button
                            circle
                            class="toolbox__btn"
                            variant=${this._delete ? 'primary' : 'default'}
                            @click=${() => {
                                this._delete = !this._delete;
                            }}
                        >
                            ${biEraser}
                        </sl-button>
                        <!-- </sl-tooltip> -->
                    </div>
                    <div class="toolbox__buttongroup">
                        <!-- <sl-tooltip content="Host" placement="left"> -->
                        <sl-button circle class="toolbox__btn">
                            ${this._bondMode === 1 ? cSingle : this._bondMode === 2 ? cDouble : cTripple}
                        </sl-button>
                        <!-- </sl-tooltip> -->
                        <div class="toolbox__subbuttons">
                            <sl-tooltip content="Einfachbindung" placement="top">
                                <sl-button
                                    circle
                                    class="toolbox__btn"
                                    variant=${this._bondMode === 1 ? 'primary' : 'default'}
                                    @click=${() => {
                                        this._bondMode = 1;
                                    }}
                                >
                                    ${icons.single}
                                </sl-button>
                            </sl-tooltip>
                            <sl-tooltip content="Doppelbindung" placement="top">
                                <sl-button
                                    circle
                                    class="toolbox__btn"
                                    variant=${this._bondMode === 2 ? 'primary' : 'default'}
                                    @click=${() => {
                                        this._bondMode = 2;
                                    }}
                                >
                                    ${icons.double}
                                </sl-button>
                            </sl-tooltip>
                            <sl-tooltip content="Dreierbindung" placement="top">
                                <sl-button
                                    circle
                                    class="toolbox__btn"
                                    variant=${this._bondMode === 3 ? 'primary' : 'default'}
                                    @click=${() => {
                                        this._bondMode = 3;
                                    }}
                                >
                                    ${icons.triple}
                                </sl-button>
                            </sl-tooltip>
                        </div>
                    </div>
                    <div class="toolbox__buttongroup">
                        <sl-tooltip content="Elementauswahl" placement="right">
                            <sl-button
                                circle
                                class="toolbox__btn"
                                variant=${this._elementselect ? 'primary' : 'default'}
                                @click=${() => {
                                    this._elementselect = !this._elementselect;
                                    this.toolboxButtons.classList.add('closed');
                                }}
                            >
                                ${biEyeDropper}
                            </sl-button>
                        </sl-tooltip>
                    </div>
                </div>
            </div>
        `;
    }

    private openToolbox(): void {
        this.toolboxButtons.classList.toggle('closed');
    }
}
