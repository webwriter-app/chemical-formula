import { css } from 'lit';

export const PeriodicTableStyles = css`
    .periodic-table {
        display: grid;
        grid-template-columns: repeat(18, 1fr);
        grid-template-rows: repeat(7, 1fr);
        /* gap: 0.5rem; */
        /* padding: 0.5rem; */

        width: 100%;

        font-size: 0.7em;
    }

    .element {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid black;

        aspect-ratio: 1/1;
        /* padding: 0.5rem; */
    }

    .element:hover {
        background-color: lightgray;
        cursor: pointer;
    }

    .element:hover .hover-only {
        display: block;
    }

    .element .element-number {
        font-size: 0.8em;
    }

    .element .element-symbol {
        font-size: 1.2em;
    }

    .hover-only {
        display: none;
        position: absolute;

        top: 0;
        left: 16em;

        height: 8em;
        aspect-ratio: 1/1;

        border: 1px solid black;
    }

    .selected-element {
        margin: 0.5rem;
        outline: 1px solid black;

        position: relative;
    }

    .selected-element .element-number {
        position: absolute;
        top: 0rem;
        right: 0.5rem;

        font-size: 1.5em;
    }

    .selected-element .element-symbol {
        position: absolute;
        bottom: 1.5rem;
        left: 0.5rem;

        font-size: 3em;
    }

    .selected-element .element-name {
        position: absolute;
        bottom: 1rem;
        left: 0.5rem;

        font-size: 1em;
    }

    .selected-element .element-mass {
        position: absolute;
        top: 0.25rem;
        left: 0.5rem;

        font-size: 1em;
    }

    .selected-element .element-electron-configuration {
        position: absolute;
        bottom: 0.25rem;
        left: 0.5rem;

        font-size: 0.7em;
    }

    .selected-element .element-first-ionization-energy {
        position: absolute;
        top: 1.3rem;
        left: 0.5rem;

        font-size: 0.8em;
    }

    .selected-element .element-electronegativity {
        position: absolute;
        top: 1.3rem;
        left: 3.5rem;

        font-size: 0.8em;
    }

    .diatomic.nonmetal,
    .polyatomic.nonmetal {
        background-color: lightblue;
    }

    .nobel.gas {
        background-color: lightgreen;
    }

    .alkali.metal {
        background-color: lightcoral;
    }

    .alkaline.earth.metal {
        background-color: lightyellow;
    }

    .metalloid {
        background-color: lightcyan;
    }

    .halogen {
        background-color: lightpink;
    }

    .transition.metal {
        background-color: lightgray;
    }

    .post-transition.metal {
        background-color: lightgoldenrodyellow;
    }

    .lanthanide {
        background-color: lightseagreen;
    }

    .actinide {
        background-color: lightseagreen;
    }
`;
