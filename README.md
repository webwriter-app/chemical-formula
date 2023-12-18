ww-chemical-drawing

This is a Widget developed for use with WebWriter.
As part of a bachelor's thesis, the widget aims to implement an intuitive and easy to use editor for chemical drawings.

Folder Structure

ww-chemical-drawing
|- assets
| |- VectorGraphics.js //contains svg icons for use with icon button component
|- components
| |- Button //contains reusable button components
| | |- IconButton.js
| | |- TextButton.js
| |- MoleculeCanvas.css
| |- MoleculeCanvas.js //molecule editing and rendering is done here
|- index.css
|- index.html
|- index.js //logic concerning the user interface

Installing the project

This project requires node.js and npm to be installed.
Run 'npm install' to install the project.
Run 'npm run dev' to start the program.
The App can be reached using a webbrowser under the address displayed.

Further information can be found in the accompanying thesis paper.

Developed using LitElements.

This project uses Material Icons by Google, licensed under Apache License Version 2.0, also found in this repository.
