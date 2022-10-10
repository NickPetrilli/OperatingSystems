/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
//
// Control Services
//
var TSOS;
(function (TSOS) {
    class Control {
        static hostInit() {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            this.initMemoryDisplay();
            this.initCpuDisplay();
            this.initPcbDisplay();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }
        static initMemoryDisplay() {
            var memoryDisplay = document.getElementById("memoryTable");
            var rowCount = 0;
            //Create rows and columns for each row 
            for (var i = 0; i < _MemorySize; i += 8) {
                var iStr = i.toString(16).toUpperCase();
                var row = memoryDisplay.insertRow(rowCount);
                //Pad with zeros accordingly
                //Yes, these testing values are in decimal while i is in hex but it works
                if (i < 10) {
                    iStr = '0' + iStr;
                }
                if (i < 100) {
                    iStr = '0' + iStr;
                }
                if (i > 100) {
                    iStr = '0' + iStr;
                }
                iStr = '0x' + iStr;
                row.textContent = iStr;
                var cell = row.insertCell(0);
                for (var j = 0; j < 8; j++) {
                    cell = row.insertCell(j);
                    cell.textContent = '00';
                }
                rowCount++;
            }
        }
        static initCpuDisplay() {
            var table = document.getElementById("cpuTable");
            var headers = ['PC', 'IR', 'ACC', 'X', 'Y', 'Z'];
            var body = ['000', '--', '00', '00', '00', '0'];
            var headerRow = table.insertRow();
            var bodyRow = table.insertRow();
            for (var i = 0; i < headers.length; i++) {
                headerRow.insertCell(i).textContent = headers[i];
                bodyRow.insertCell(i).textContent = body[i];
            }
        }
        static initPcbDisplay() {
            var table = document.getElementById("pcbTable");
            var headers = ['PID', 'State', 'PC', 'IR', 'ACC', 'X', 'Y', 'Z'];
            var body = ['--', '--', '000', '--', '00', '00', '00', '0'];
            var headerRow = table.insertRow();
            var bodyRow = table.insertRow();
            for (var i = 0; i < headers.length; i++) {
                headerRow.insertCell(i).textContent = headers[i];
                bodyRow.insertCell(i).textContent = body[i];
            }
        }
        static updateMemoryDisplay(baseRegister) {
            var memoryDisplay = document.getElementById("memoryTable");
            var rowCount = 0;
            var memoryPointer = 0;
            for (var i = 0; i < _MemorySize; i += 8) {
                var iStr = i.toString(16).toUpperCase();
                var row = memoryDisplay.insertRow(rowCount);
                //Pad with zeros accordingly
                if (i < 10) {
                    iStr = '0' + iStr;
                }
                if (i < 100) {
                    iStr = '0' + iStr;
                }
                if (i > 100) {
                    iStr = '0' + iStr;
                }
                iStr = '0x' + iStr;
                row.textContent = iStr;
                var cell = row.insertCell(0);
                for (var j = baseRegister; j < 8; j++) {
                    cell = row.insertCell(j);
                    cell.textContent = _Memory.memory[memoryPointer];
                    memoryPointer++;
                }
                rowCount++;
            }
        }
        static updateCpuDisplay(pcb, instruction) {
            var table = document.getElementById("cpuTable");
            table.deleteRow(1);
            var body = [pcb.programCounter.toString(), instruction,
                TSOS.Utils.toHexDigit(pcb.acc, 2), TSOS.Utils.toHexDigit(pcb.XRegister, 2),
                TSOS.Utils.toHexDigit(pcb.YRegister, 2), pcb.ZFlag.toString()];
            var bodyRow = table.insertRow();
            for (var i = 0; i < body.length; i++) {
                bodyRow.insertCell(i).textContent = body[i];
            }
        }
        static updatePcbDisplay(pcb) {
            var table = document.getElementById("pcbTable");
            table.deleteRow(1);
            var body = [pcb.processID.toString(), pcb.processState, pcb.programCounter.toString(), "--",
                TSOS.Utils.toHexDigit(pcb.acc, 2), TSOS.Utils.toHexDigit(pcb.XRegister, 2),
                TSOS.Utils.toHexDigit(pcb.YRegister, 2), pcb.ZFlag.toString()];
            var bodyRow = table.insertRow();
            for (var i = 0; i < body.length; i++) {
                bodyRow.insertCell(i).textContent = body[i];
            }
        }
        static hostLog(msg, source = "?") {
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        }
        //
        // Host Events
        //
        static hostBtnStartOS_click(btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            document.getElementById("btnSingleStep").disabled = false;
            document.getElementById("btnStep").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            _Memory = new TSOS.Memory(256);
            _Memory.init();
            _MemoryAccessor = new TSOS.MemoryAccessor();
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
        }
        static hostBtnHaltOS_click(btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }
        static hostBtnReset_click(btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload();
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }
        static hostBtnSingleStep_click(btn) {
            //Toggle single step mode
            TSOS.Cpu.singleStep = !(TSOS.Cpu.singleStep);
            document.getElementById("btnStep").disabled = !(TSOS.Cpu.singleStep);
            btn.value = (TSOS.Cpu.singleStep) ? 'Single-Step Execution: On' : 'Single-Step Execution: Off';
            //If single step is turned off while executing a program, we need to start executing again
            if (!TSOS.Cpu.singleStep && !_CPU.isExecuting && _CPU.PC !== 0) {
                _CPU.isExecuting = true;
            }
        }
        static hostBtnStep_click(btn) {
            //Execute next step in program
            _CPU.isExecuting = true;
        }
    }
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=control.js.map