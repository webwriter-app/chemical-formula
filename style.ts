import { css } from 'lit';

export default css`
    .flex-row {
        /* display: flex; */
    }
    .flex-column {
        /* display: flex; */
        /* flex-direction: column; */
    }
    .content {
        /* height: calc(100vh - 16px - 4.4rem); */
        flex-grow: 1;
        flex-wrap: wrap;
        /* overflow: scroll; */
        overflow: hidden;
        outline: 1px solid black;
    }

    .menu-bar {
        border-radius: 0.5rem;
        display: flex;
        flex-grow: 0;
        flex-shrink: 0;
    }
    .sub-menu {
        display: flex;
        gap: 0.1rem;
    }
    .menu-bar.horizontal {
        justify-content: flex-end;
    }
    .menu-bar.horizontal .sub-menu {
        padding: 0.2rem 0.4rem;
    }
    .menu-bar.horizontal .sub-menu:not(:last-child) {
        border-right: 1px solid black;
    }
    .menu-bar.vertical {
        flex-direction: column;
        height: 100%;
    }
    .menu-bar.vertical .sub-menu {
        padding: 0.4rem 0.2rem;
        flex-direction: column;
    }
    .menu-bar.vertical .sub-menu:not(:last-child) {
        border-bottom: 1px solid black;
    }

    .toolbox {
        position: absolute;
        display: flex;
        flex-direction: column-reverse;
        align-items: flex-start;

        left: 10px;
        bottom: 10px;

        z-index: 1000;
    }

    .toolbox sl-button::part(base) {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .toolbox__buttons {
        display: flex;
        flex-direction: column;

        position: relative;

        height: auto;
        margin-left: calc((var(--sl-input-height-large) - var(--sl-input-height-medium)) * 0.5);
    }

    .toolbox__buttongroup {
        display: flex;
        flex-direction: row;
        margin-bottom: 5px;
    }
    .toolbox__subbuttons {
        display: none;
    }

    .toolbox__buttons.closed {
        display: none;
    }

    .toolbox__buttongroup sl-button {
        margin-right: 5px;
    }

    .toolbox__buttongroup:not(:has(sl-button[disabled])):hover .toolbox__subbuttons {
        display: flex;
        flex-direction: row;
    }

    .toolbox__buttons svg {
        height: 24px;
        width: 24px;
    }

    .periodic-table {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        background-color: white;
    }
`;
