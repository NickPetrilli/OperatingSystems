/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    class Console {
        constructor(currentFont = _DefaultFontFamily, currentFontSize = _DefaultFontSize, currentXPosition = 0, currentYPosition = _DefaultFontSize, buffer = "", commandHistory = [], commandPointer = 0, shouldClear = false) {
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.commandHistory = commandHistory;
            this.commandPointer = commandPointer;
            this.shouldClear = shouldClear;
        }
        init() {
            this.clearScreen();
            this.resetXY();
        }
        clearScreen() {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }
        resetXY() {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }
        handleInput() {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    this.commandHistory.push(this.buffer);
                    //Push adds the command to the back of the array, so last command will be at index length - 1
                    this.commandPointer = this.commandHistory.length - 1;
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(8)) { // backspace key
                    this.backspace();
                }
                else if (chr === String.fromCharCode(9)) { // tab key
                }
                else if (chr === "upArrow") { // up arrow
                    //_StdOut.putText("Up arrow test");
                    if (this.commandPointer != 0) {
                        this.clearLine();
                        this.putText(this.commandHistory[this.commandPointer]);
                        this.buffer = this.commandHistory[this.commandPointer];
                        this.commandPointer--;
                    }
                }
                else if (chr === "downArrow") { // down arrow
                    //_StdOut.putText("Down arrow test");
                    if (this.commandPointer != this.commandHistory.length - 1) {
                        this.clearLine();
                        this.putText(this.commandHistory[this.commandPointer]);
                        this.buffer = this.commandHistory[this.commandPointer];
                        this.commandPointer++;
                    }
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }
        putText(text) {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        }
        advanceLine() {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // TODO: Handle scrolling. (iProject 1)
            //Check if the current y position is off the canvas
            if (this.currentYPosition > _Canvas.height) {
                //Take a snapshot by getting the image data of the canvas
                var imageData = _Canvas.getContext('2d').getImageData(0, 0, _Canvas.width, _Canvas.height);
                _Canvas.height += (this.currentYPosition - _Canvas.height) + 10;
                _Canvas.getContext('2d').putImageData(imageData, 0, 0);
                var console = document.getElementById('divConsole');
                console.scrollTop = console.scrollHeight;
            }
        }
        backspace() {
            if (this.buffer.length > 0) {
                //Calculate offset of the character for x and y coordinates
                var offsetX = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.charAt(this.buffer.length - 1));
                var xBeginnningPos = this.currentXPosition - offsetX;
                var offsetY = _DefaultFontSize;
                var yBeginningPos = this.currentYPosition - offsetY;
                //Clear area from where we began to the current position - last two parameters are width and height
                _DrawingContext.clearRect(xBeginnningPos, yBeginningPos, offsetX, offsetY + 5);
                this.currentXPosition = xBeginnningPos;
                //Remove last character of buffer
                this.buffer = this.buffer.substring(0, this.buffer.length - 1);
            }
        }
        clearLine() {
            if (this.buffer.length > 0) {
                //Calculate offset of the character for x and y coordinates
                var offsetX = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer);
                var xBeginnningPos = this.currentXPosition - offsetX;
                var offsetY = _DefaultFontSize;
                var yBeginningPos = this.currentYPosition - offsetY;
                //Clear area from where we began to the current position - last two parameters are width and height
                _DrawingContext.clearRect(xBeginnningPos, yBeginningPos, offsetX, offsetY + 5);
                this.currentXPosition = xBeginnningPos;
                //Remove last character of buffer
                this.buffer = "";
            }
        }
    }
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=console.js.map