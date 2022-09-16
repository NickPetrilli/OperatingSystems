/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverKeyboard extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }
        krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) {
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                }
                else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode >= 48) && (keyCode <= 57)) {
                if (isShifted == true) {
                    switch (keyCode) {
                        case 48:
                            chr = ")";
                            break;
                        case 49:
                            chr = "!";
                            break;
                        case 50:
                            chr = "@";
                            break;
                        case 51:
                            chr = "#";
                            break;
                        case 52:
                            chr = "$";
                            break;
                        case 53:
                            chr = "%";
                            break;
                        case 54:
                            chr = "^";
                            break;
                        case 55:
                            chr = "&";
                            break;
                        case 56:
                            chr = "*";
                            break;
                        case 57:
                            chr = "(";
                            break;
                    }
                }
                else {
                    chr = String.fromCharCode(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 32) || (keyCode == 13)) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            /*
            ||   // digits
                        (keyCode == 32)                     ||   // space
                        (keyCode == 13)                     ||   // enter
                        (keyCode == 8)                      ||   // backspace
                        (keyCode == 188)                    ||   // ,
                        (keyCode == 190)                    ||   // .
                        (keyCode == 191)                    ||   // /
                        (keyCode == 186)                    ||   // ;
                        (keyCode == 222)                    ||   // '
                        (keyCode == 219)                    ||   // [
                        (keyCode == 221)                    ||   // ]
                        (keyCode == 189)                    ||   // -
                        (keyCode == 187)) {                      // =
                            
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            */
        }
    }
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverKeyboard.js.map