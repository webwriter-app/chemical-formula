import { LitElement, html, svg, unsafeCSS } from "lit";

import style from "./MoleculeCanvas.css?inline";

export class MoleculeCanvas extends LitElement {
  static styles = unsafeCSS(style);

  static properties = {
    zoom: { type: Number },
    class: { type: String },

    insertMode: { type: String },
    bold: { type: Boolean },
    italic: { type: Boolean },
    delete: { type: Boolean },
    lewis: { type: Boolean },
    bondMode: { type: Number },

    textColor: { type: Boolean },
    highlightColor: { type: Boolean },
    molecule: { type: Object },
  };

  constructor() {
    super();
    this.molecule = {
      elements: [],
      bonds: [],
    };
  }

  firstUpdated() {
    this.reRender();
  }

  reRender() {
    const main_canvas = this.renderRoot.getElementById("main-canvas"); //used to display the molecule
    const back_canvas = this.renderRoot.getElementById("back-canvas"); //contains background hexagonal paper
    const hover_canvas = this.renderRoot.getElementById("hover-canvas"); //used to highlight hexagons
    const active_canvas = this.renderRoot.getElementById("active-canvas"); //used to highlight hexagons
    const highlight_canvas = this.renderRoot.getElementById("highlight-canvas"); //used to display ui elements
    if (!main_canvas) {
      //on the scripts first run, html hasnt been mounted. This prevents an error.
      return;
    }
    let previous = [];
    let selected = [];
    const main_ctx = main_canvas.getContext("2d");
    const back_ctx = back_canvas.getContext("2d");
    const active_ctx = active_canvas.getContext("2d");
    const hover_ctx = hover_canvas.getContext("2d");
    const highlight_ctx = highlight_canvas.getContext("2d");
    const amount_h = this.zoom;

    const hex_h_size = main_canvas.height / amount_h / 2; //y 'radius' of hexagons: each hexagon will be twice as tall as this value
    const hex_w_size = 2 * (hex_h_size / Math.sqrt(3)); //x 'radius' of hexagons
    const amount_w = Math.ceil(main_canvas.width / hex_w_size / 1.5);

    //Canvas helper functions
    const clearCanvas = (canvas) => {
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    };

    //mouse Events
    main_canvas.addEventListener("mousemove", function (e) {
      hoverHexagon(e);
    });

    main_canvas.addEventListener("mouseout", function (e) {
      clearCanvas(hover_canvas);
    });

    main_canvas.addEventListener("mousedown", function (e) {
      selectHexagon(e);
      edit();
    });

    const getCursorPosition = (event) => {
      const rect = main_canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return [x, y];
    };

    const hoverHexagon = (event) => {
      const canvas_coords = getCursorPosition(event);
      const hex_coords = getHexCoords(canvas_coords[0], canvas_coords[1]);
      clearCanvas(hover_canvas);
      hover_ctx.strokeStyle = "rgba(0, 0, 0, 0)";
      hover_ctx.fillStyle = "#00000030";
      drawHex(hex_coords[0], hex_coords[1], hover_ctx);
    };

    const selectHexagon = (event) => {
      const canvas_coords = getCursorPosition(event);
      previous = selected;
      selected = getHexCoords(canvas_coords[0], canvas_coords[1]);
      const s = previous[0];
      const t = previous[1];
      const u = selected[0];
      const v = selected[1];
      if (
        previous === selected ||
        //mehr als 1 übereinander
        Math.abs(t - v) > 1 ||
        //gleiche reihe, mehr als 1 entfernt
        Math.abs(s - u) > 1 ||
        //previous ist ungerade spalte, selected ist gerade spalte, sortiere alle aus, die eine spalte darunter
        (s % 2 === 1 && u % 2 === 0 && t < v) ||
        //previos ist gerade, selected ist ungerade, sortiere alle aus, die eine spalte darüber sind
        (s % 2 === 0 && u % 2 === 1 && t > v)
      ) {
        previous = [];
      }
      redrawSelected();
    };

    const redrawSelected = () => {
      clearCanvas(active_canvas);
      active_ctx.strokeStyle = "rgba(0, 0, 0, 0)";
      active_ctx.fillStyle = "#0284C710";
      drawHex(previous[0], previous[1], active_ctx);
      active_ctx.fillStyle = "#0284C730";
      drawHex(selected[0], selected[1], active_ctx);
    };

    //editing
    const getCurrentElement = () => {
      return this.molecule.elements.find(
        (ele) => ele.x === selected[0] && ele.y === selected[1]
      );
    };

    const getPreviousElement = () => {
      return this.molecule.elements.find(
        (ele) => ele.x === previous[0] && ele.y === previous[1]
      );
    };

    const getElementBonds = () => {
      return this.molecule.bonds.filter(
        (ele) =>
          (ele.s === selected[0] && ele.t === selected[1]) ||
          (ele.u === selected[0] && ele.v === selected[1])
      );
    };

    const edit = () => {
      const element = getCurrentElement();
      if (this.delete) {
        //editor is in delete mode
        if (element) {
          this.molecule.elements.splice(
            this.molecule.elements.indexOf(element),
            1
          );
          const bonds = getElementBonds();
          getElementBonds().forEach((ele) => {
            this.molecule.bonds.splice(this.molecule.bonds.indexOf(ele), 1);
          });
        }
      } else {
        //editor is in edit mode
        if (element) {
          //Falls sich dort bereits ein element befindet, überschreibe es im folgenden schritt
          this.molecule.elements.splice(
            this.molecule.elements.indexOf(element),
            1
          );
        }
        if (getPreviousElement()) {
          //Falls das zuvor angeklickte Feld ebenfalls ein Element enthällt, erzeuge eine Verbindung
          this.molecule.bonds.push({
            s: previous[0],
            t: previous[1],
            u: selected[0],
            v: selected[1],
            type: this.bondMode,
          });
        }
        const bold = this.bold ? 1 : 0;
        const italic = this.italic ? 2 : 0;
        // Füge das Element neu hinzu
        this.molecule.elements.push({
          x: selected[0],
          y: selected[1],
          label: this.insertMode,
          style: bold + italic,
          color: this.textColor ? "#f00" : "#000",
          background: this.highlightColor ? "#fdab9f" : null,
          deco: [],
        });
      }
      redrawMolecule();
    };

    //Coordinate helper funcitons
    const getHexCoords = (x, y) => {
      let s = Math.floor((x / hex_w_size) * 2); //get "subsquare" of click
      let t = Math.floor(y / hex_h_size);
      if (s % 3 == 0) {
        //square is shared between hexagons
        const lx = (x - s * (0.5 * hex_w_size)) / (hex_w_size / 2); //get local coords of rectangle and scale to square
        const ly = (y % hex_h_size) / hex_h_size;
        if (s % 2 == t % 2) {
          // der trennende Strich verläuft von unten nach oben: /
          s = 1 - lx > ly ? s / 3 - 1 : s / 3;
        } else {
          // der trennende Strich verläuft von oben nach unten: \
          s = lx > ly ? s / 3 : s / 3 - 1;
        }
      } else {
        //square is not shared between hexagons
        s = s % 3 == 1 ? (s - 1) / 3 : (s - 2) / 3;
      }
      y = s % 2 == 0 ? y : y + hex_h_size; //das hexagon hat einene ungerade x-koordinate: die mitte des hexagons ist um einen y-radius verschoben
      t = Math.floor(y / hex_h_size / 2);
      return [s, t];
    };

    const getCanvasCoords = (s, t) => {
      const x = (1.5 * s + 1) * hex_w_size;
      const y =
        Math.abs(s) % 2 == 1 ? t * 2 * hex_h_size : (t * 2 + 1) * hex_h_size;
      return [x, y];
    };

    //hex drawing
    const drawHex = (s, t, ctx) => {
      const canvas_coords = getCanvasCoords(s, t);
      const x = canvas_coords[0];
      const y = canvas_coords[1];
      ctx.beginPath();
      ctx.moveTo(x - 0.5 * hex_w_size, y - hex_h_size); //oben links
      ctx.lineTo(x + 0.5 * hex_w_size, y - hex_h_size); //oben rechts
      ctx.lineTo(x + hex_w_size, y); // rechts
      ctx.lineTo(x + 0.5 * hex_w_size, y + hex_h_size); //unten rechts
      ctx.lineTo(x - 0.5 * hex_w_size, y + hex_h_size); //unten links
      ctx.lineTo(x - hex_w_size, y); //links
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      /*
       */
    };

    const redrawGrid = () => {
      clearCanvas(back_canvas);
      back_ctx.lineWidth = 0.5;
      back_ctx.fillStyle = "rgba(0, 0, 0, 0)";
      back_ctx.strokeStyle = "#E0E0E0";
      for (let x = -1; x < amount_w; x++) {
        //x = -1 adds an extra column to the left to improve line width consistency
        for (let y = 0; y < amount_h + 1; y++) {
          //amount_h + 1 as above
          drawHex(x, y, back_ctx);
        }
      }
    };

    //Element drawing
    this.drawElement = (s, t, symbol, style, color, background, deco) => {
      const canvas_coords = getCanvasCoords(s, t);
      const x = canvas_coords[0];
      const y = canvas_coords[1];
      const font_size = 0.7 * hex_h_size;
      switch (style) {
        case 0:
          main_ctx.font = "normal " + font_size + "px sans-serif";
          break;
        case 1:
          main_ctx.font = "bold " + font_size + "px sans-serif";
          break;
        case 2:
          main_ctx.font = "italic " + font_size + "px sans-serif";
          break;
        case 3:
          main_ctx.font = "bold italic " + font_size + "px sans-serif";
          break;
      }
      if (color) {
        main_ctx.fillStyle = color;
      } else main_ctx.fillStyle = "black";
      main_ctx.textAlign = "center";
      main_ctx.fillText(symbol, x, y + font_size / 2.7);
      if (background) {
        highlight_ctx.strokeStyle = "rgba(0, 0, 0, 0)";
        highlight_ctx.fillStyle = background;
        drawHex(s, t, highlight_ctx);
      }
      if (deco) {
        deco.forEach((ele) => {
          main_ctx.beginPath();
          switch (ele.pos) {
            case 0:
              main_ctx.moveTo(x - 0.4 * hex_h_size, y - 0.6 * hex_w_size);
              main_ctx.lineTo(x + 0.4 * hex_h_size, y - 0.6 * hex_w_size);
              break;
            case 1:
              main_ctx.moveTo(x + 0.4 * hex_h_size, y - 0.6 * hex_w_size);
              main_ctx.lineTo(x + 0.8 * hex_h_size, y);
              break;
            case 2:
              main_ctx.moveTo(x + 0.8 * hex_h_size, y);
              main_ctx.lineTo(x + 0.4 * hex_h_size, y + 0.6 * hex_w_size);
              break;
            case 3:
              main_ctx.moveTo(x + 0.4 * hex_h_size, y + 0.6 * hex_w_size);
              main_ctx.lineTo(x - 0.4 * hex_h_size, y + 0.6 * hex_w_size);
              break;
            case 4:
              main_ctx.moveTo(x - 0.4 * hex_h_size, y + 0.6 * hex_w_size);
              main_ctx.lineTo(x - 0.8 * hex_h_size, y);
              break;
            case 5:
              main_ctx.moveTo(x - 0.8 * hex_h_size, y);
              main_ctx.lineTo(x - 0.4 * hex_h_size, y - 0.6 * hex_w_size);
              main_ctx.moveTo;
              break;
          }
          main_ctx.setLineDash([0.5 * hex_h_size]);
          main_ctx.lineDashOffset = -0.15 * hex_h_size;
          main_ctx.lineWidth = 2;
          main_ctx.lineCap = "round";
          main_ctx.strokeStyle = "black";
          if (ele.type == 0) {
            //freies Elektron
            main_ctx.setLineDash([2, 0.365 * hex_h_size]);
            main_ctx.lineDashOffset = -0.365 * hex_h_size;
            main_ctx.lineWidth = 4;
          }
          main_ctx.stroke();
          main_ctx.setLineDash([1]);
        });
      }
      if (background) {
        hover_ctx.strokeStyle = "rgba(0, 0, 0, 0)";
        highlight_ctx.fillStyle = background;
        drawHex(s, t, highlight_ctx);
      }
    };

    this.drawBond = (a1, b1, a2, b2, type) => {
      const s = a1 < a2 ? a1 : a2;
      const t = a1 < a2 ? b1 : b2;
      const u = a1 < a2 ? a2 : a1;
      const v = a1 < a2 ? b2 : b1;
      const canvas_coords_1 = getCanvasCoords(s, t);
      const canvas_coords_2 = getCanvasCoords(u, v);
      const x1 = canvas_coords_1[0];
      const y1 = canvas_coords_1[1];
      const x2 = canvas_coords_2[0];
      const y2 = canvas_coords_2[1];
      main_ctx.beginPath();
      switch (type) {
        case 1:
          main_ctx.moveTo(x1, y1);
          main_ctx.lineTo(x2, y2);
          break;
        case 2:
          if (s == u) {
            //die zu verbindenden Waben sind übereinander
            main_ctx.moveTo(x1 - 2.5, y1);
            main_ctx.lineTo(x2 - 2.5, y2);
            main_ctx.moveTo(x1 + 2.5, y1);
            main_ctx.lineTo(x2 + 2.5, y2);
          } else if ((t < v) & (s % 2 == 0) || (t == v) & (s % 2 == 1)) {
            main_ctx.moveTo(x1 - 1, y1 + 2);
            main_ctx.lineTo(x2 - 1, y2 + 2);
            main_ctx.moveTo(x1 + 1, y1 - 2);
            main_ctx.lineTo(x2 + 1, y2 - 2);
          } else {
            main_ctx.moveTo(x1 - 1, y1 - 2);
            main_ctx.lineTo(x2 - 1, y2 - 2);
            main_ctx.moveTo(x1 + 1, y1 + 2);
            main_ctx.lineTo(x2 + 1, y2 + 2);
          }
          break;
        case 3:
          main_ctx.moveTo(x1, y1);
          main_ctx.lineTo(x2, y2);
          if (s == u) {
            //die zu verbindenden Waben sind übereinander
            main_ctx.moveTo(x1 - 3.5, y1);
            main_ctx.lineTo(x2 - 3.5, y2);
            main_ctx.moveTo(x1 + 3.5, y1);
            main_ctx.lineTo(x2 + 3.5, y2);
          } else if ((t < v) & (s % 2 == 0) || (t == v) & (s % 2 == 1)) {
            main_ctx.moveTo(x1 - 1.5, y1 + 3);
            main_ctx.lineTo(x2 - 1.5, y2 + 3);
            main_ctx.moveTo(x1 + 1.5, y1 - 3);
            main_ctx.lineTo(x2 + 1.5, y2 - 3);
          } else {
            main_ctx.moveTo(x1 - 1.5, y1 - 3);
            main_ctx.lineTo(x2 - 1.5, y2 - 3);
            main_ctx.moveTo(x1 + 1.5, y1 + 3);
            main_ctx.lineTo(x2 + 1.5, y2 + 3);
          }
          break;
      }
      main_ctx.setLineDash([0.75 * hex_h_size]);
      main_ctx.lineDashOffset = -0.625 * hex_h_size;
      main_ctx.lineWidth = 2;
      main_ctx.lineCap = "round";
      main_ctx.strokeStyle = "black";
      main_ctx.stroke();
      main_ctx.setLineDash([1]);
    };

    //rendering
    const redrawMolecule = () => {
      clearCanvas(main_canvas);
      clearCanvas(highlight_canvas);
      this.molecule.elements.forEach((element) => {
        this.drawElement(
          element.x,
          element.y,
          element.label,
          element.style,
          element.color,
          element.background,
          element.deco
        );
      });
      this.molecule.bonds.forEach((bond) => {
        this.drawBond(bond.s, bond.t, bond.u, bond.v, bond.type);
      });
    };

    this.init = () => {
      redrawGrid();
      redrawSelected();
      redrawMolecule();
    };

    this.init();
  }

  render() {
    this.reRender();
    return html`
      <div class="content-element ${this.class}">
        <div class="content-element-menu-container-top">
          <span onClick="this.contentEditable='true';" class="molecule-name"
            >Neues Molek&uuml;l</span
          >
        </div>
        <div class="canvas-container">
          <canvas id="highlight-canvas" width="400" height="300"></canvas>
          <canvas id="hover-canvas" width="400" height="300"></canvas>
          <canvas id="active-canvas" width="400" height="300"></canvas>
          <canvas id="back-canvas" width="400" height="300"></canvas>
          <canvas id="main-canvas" width="400" height="300"></canvas>
        </div>
        <div class="content-element-menu-container-bottom hover-only">
          <span onClick="this.contentEditable='true';" class="molecule-name"
            >H<sub>2</sub>O</span
          >
        </div>
        <div class="content-element-menu-container-side hover-only">
          <div class="content-element-menu-side-default">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path
                d="M432-432v112q0 20.4 13.8 34.2Q459.6-272 480-272q20.4 0 34.2-13.8Q528-299.6 528-320v-112h112q20.4 0 34.2-13.8Q688-459.6 688-480q0-20.4-13.8-34.2Q660.4-528 640-528H528v-112q0-20.4-13.8-34.2Q500.4-688 480-688q-20.4 0-34.2 13.8Q432-660.4 432-640v112H320q-20.4 0-34.2 13.8Q272-500.4 272-480q0 20.4 13.8 34.2Q299.6-432 320-432h112Zm48 386q-91 0-169.987-34.084-78.988-34.083-137.417-92.512T80.084-310.013Q46-389 46-480t34.084-169.987q34.083-78.988 92.512-137.417t137.417-92.512Q389-914 480-914t169.987 34.084q78.988 34.083 137.417 92.512t92.512 137.417Q914-571 914-480t-34.084 169.987q-34.083 78.988-92.512 137.417T649.987-80.084Q571-46 480-46Z"
              />
            </svg>
          </div>
          <div class="content-element-menu-side-hover">
            <ww-chem-icon-button
              canvasButton
              tooltip="+ Molek&uuml;l"
              iconName="add"
              @ww-chem-click=${() => {
                this.dispatchEvent(
                  new CustomEvent("ww-chem-reactsTo", {
                    detail: { value: "add" },
                    composed: true,
                  })
                );
              }}
            ></ww-chem-icon-button>
            <ww-chem-icon-button
              canvasButton
              tooltip="Reagiert zu"
              iconName="reactsTo"
              @ww-chem-click=${() => {
                this.dispatchEvent(
                  new CustomEvent("ww-chem-reactsTo", {
                    detail: { value: "react" },
                    composed: true,
                    bubbles: true,
                  })
                );
              }}
            ></ww-chem-icon-button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("ww-chem-molecule-canvas", MoleculeCanvas);
