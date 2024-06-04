import { LitElementWw } from '@webwriter/lit';
import { LitElement, PropertyValueMap, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import periodicTable from '../periodicTable.json';

import { PeriodicTableStyles } from './PeriodicTableStyles';

export interface Element {
    name: string;
    appearance: null | string;
    atomic_mass: number;
    boil: number | null;
    category: string;
    density: number | null;
    discovered_by: null | string;
    melt: number | null;
    molar_heat: number | null;
    named_by: null | string;
    number: number;
    period: number;
    group: number;
    phase: Phase;
    source: string;
    bohr_model_image: null | string;
    bohr_model_3d: null | string;
    spectral_img: null | string;
    summary: string;
    symbol: string;
    xpos: number;
    ypos: number;
    wxpos: number;
    wypos: number;
    shells: number[];
    electron_configuration: string;
    electron_configuration_semantic: string;
    electron_affinity: number | null;
    electronegativity_pauling: number | null;
    ionization_energies: number[];
    'cpk-hex': null | string;
    image: Image;
    block: Block;
}

export enum Block {
    D = 'd',
    F = 'f',
    P = 'p',
    S = 's',
}

export interface Image {
    title: string;
    url: string;
    attribution: string;
}

export enum Phase {
    Gas = 'Gas',
    Liquid = 'Liquid',
    Solid = 'Solid',
}

@customElement('webwriter-periodic-table')
export class PeriodicTable extends LitElementWw {
    static styles = PeriodicTableStyles;
    static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

    @property({ type: Object, attribute: true, reflect: true })
    private selectedElement: Element = periodicTable.elements[1] as Element;

    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        let p = document.createElement('p');
        p.innerHTML = 'Hello World';

        this.appendChild(p);
    }

    render() {
        return html`
            <div class="periodic-table">
                <div class="selected-element" style="grid-column: 5/8; grid-row: 1/4;">
                    <div class="element-number">${this.selectedElement.number}</div>
                    <div class="element-symbol">${this.selectedElement.symbol}</div>
                    <div class="element-name">${this.selectedElement.name}</div>
                    <div class="element-mass">${this.selectedElement.atomic_mass.toFixed(3)}</div>
                    <div class="element-electron-configuration">
                        ${this.formatElectronConfiguration(this.selectedElement.electron_configuration_semantic)}
                    </div>
                    <div class="element-first-ionization-energy">${this.selectedElement.ionization_energies[0]}</div>
                    <div class="element-electronegativity">${this.selectedElement.electronegativity_pauling}</div>
                </div>
                ${Object.entries(periodicTable.elements as Element[]).map(([key, value]) => {
                    return html`
                        <div
                            class=${`element ${value.category}`}
                            style="grid-column: ${value.xpos}; grid-row: ${value.ypos};"
                            @click=${() => {
                                const e = new CustomEvent('element-click', {
                                    detail: { element: value },
                                    bubbles: true,
                                    composed: true,
                                });
                                this.dispatchEvent(e);
                                this.selectedElement = value;
                            }}
                        >
                            <div class="element-number">${value.number}</div>
                            <div class="element-symbol">${value.symbol}</div>

                            <!-- <div class="hover-only">
                                <div class="element-name">${value.name}</div>
                                <div class="element-mass">${value.atomic_mass}</div>
                            </div> -->
                        </div>
                    `;
                })}
            </div>
        `;
    }

    private formatElectronConfiguration(configuration: string): TemplateResult {
        const parts = configuration.split(' ');
        const brackets = ['[', '*'].includes(parts[0][0]) ? parts[0] : null;

        const config = parts.slice(brackets ? 1 : 0).map((part) => {
            const subparts = part.split(new RegExp('([A-Za-z]+)'));
            return html` ${subparts[0]}${subparts[1]}<sup>${subparts[2]}</sup> `;
        });

        return html` ${brackets} ${config}`;
    }
}
