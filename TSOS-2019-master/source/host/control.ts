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
module TSOS {

    //Deletes the placeholder row in pcb display
    let firstCall: boolean = true;

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

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

        public static initMemoryDisplay(): void {
            var memoryDisplay = <HTMLTableElement> document.getElementById("memoryTable");
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
                if (i > 100 && i < 256) {
                    iStr = '0' + iStr;
                }
                iStr = '0x' + iStr;
                row.textContent = iStr;
                var cell = row.insertCell(0);
                for (var j = 0; j < 8; j++) {
                    cell = row.insertCell(j);
                    cell.textContent= '00';

                }
                rowCount++;

            }
        }

        public static initCpuDisplay(): void {
            var table = <HTMLTableElement> document.getElementById("cpuTable");
            var headers = ['PC', 'IR', 'ACC', 'X', 'Y', 'Z'];
            var body = ['000', '--', '00', '00', '00', '0'];
            var headerRow = table.insertRow();
            var bodyRow = table.insertRow();
            for (var i = 0; i < headers.length; i++) {
                headerRow.insertCell(i).textContent = headers[i];
                bodyRow.insertCell(i).textContent = body[i];
            }
        }

        public static initPcbDisplay(): void {
            var table = <HTMLTableElement> document.getElementById("pcbTable");
            var headers = ['PID', 'State', 'PC', 'IR', 'ACC', 'X', 'Y', 'Z', 'Base', 'Limit', 'Location'];
            var body = ['--', '--', '000', '--', '00', '00', '00', '0', '0', '0', '--'];
            var headerRow = table.insertRow();
            var bodyRow = table.insertRow();
            for (var i = 0; i < headers.length; i++) {
                headerRow.insertCell(i).textContent = headers[i];
                bodyRow.insertCell(i).textContent = body[i];
            }
            

        }

        public static updateMemoryDisplay() {
            var memoryDisplay = <HTMLTableElement> document.getElementById("memoryTable");
            var rowCount = 0;
            var memoryPointer = 0;
            for (var i = 0; i < _MemorySize; i += 8) {
                var iStr = i.toString(16).toUpperCase();
                //Delete the existing row because we are basically rebuilding the table each time
                //Without it memory is doubled
                memoryDisplay.deleteRow(rowCount);
                var row = memoryDisplay.insertRow(rowCount);
                //Pad with zeros accordingly
                if (i < 10) {
                    iStr = '0' + iStr;
                }
                if (i < 100) {
                    iStr = '0' + iStr;
                }
                if (i > 100 && i < 256) {
                    iStr = '0' + iStr;
                }
                iStr = '0x' + iStr;
                row.textContent = iStr;
                var cell = row.insertCell(0);
                for (var j = 0; j < 8; j++) {
                    cell = row.insertCell(j);
                    cell.textContent = _Memory.memory[memoryPointer];
                    memoryPointer++;
                }
                
                rowCount++;
            }
        }

        public static updateCpuDisplay(pcb: TSOS.ProcessControlBlock, instruction: string) {
            var table = <HTMLTableElement> document.getElementById("cpuTable");
            table.deleteRow(1);
            var body = [pcb.programCounter.toString(), instruction, 
            TSOS.Utils.toHexDigit(pcb.acc, 2), TSOS.Utils.toHexDigit(pcb.XRegister, 2), 
            TSOS.Utils.toHexDigit(pcb.YRegister, 2), pcb.ZFlag.toString()];
            var bodyRow = table.insertRow();
            for (var i = 0; i < body.length; i++) {
                bodyRow.insertCell(i).textContent = body[i];
            }

        }
        /*
        public static updatePcbDisplay(isLoadCommand: boolean, pcb: TSOS.ProcessControlBlock, instruction?: string) {
            var table = <HTMLTableElement> document.getElementById("pcbTable");
            var numRows = table.rows.length;
            if (firstCall) {
                table.deleteRow(1);
                firstCall = false;
            }      
            if (instruction === undefined) {
                instruction = "--";
            }
            var body = [pcb.processID.toString(), pcb.processState, pcb.programCounter.toString(), instruction, 
            TSOS.Utils.toHexDigit(pcb.acc, 2), TSOS.Utils.toHexDigit(pcb.XRegister, 2), 
            TSOS.Utils.toHexDigit(pcb.YRegister, 2), pcb.ZFlag.toString(), pcb.baseRegister.toString(), 
            pcb.limitRegister.toString(), "Segment " + _MemoryManager.allocated[pcb.processID].toString()];
            //To fix the issue with the processes displaying wrong:
            //Load command adds new process into the display
            //Anything else is just updating a process already there, so delete and add new info in its place
            //This will be an issue moving forward as the processID will keep incrementing
            //Changed when processes terminate to not remove from row because it was preventing the other processes from finishing
            if (isLoadCommand) {
                var bodyRow = table.insertRow();
            }
            else {
                if (pcb.processID === 0) {
                    table.deleteRow(1);
                    var bodyRow = table.insertRow(1);
                }
                if (pcb.processID === 1) {
                    table.deleteRow(2);
                    var bodyRow = table.insertRow(2);
                }
                if (pcb.processID === 2) {
                    table.deleteRow(3);
                    var bodyRow = table.insertRow(3);
                }
            }

            for (var i = 0; i < body.length; i++) {
                bodyRow.insertCell(i).textContent = body[i];
            }

        }
        */
        public static updatePcbDisplay(isLoadCommand: boolean, pcb: TSOS.ProcessControlBlock, instruction?: string) {
            let table = document.getElementById("pcbTable");  
            if (instruction === undefined) {
                instruction = "--";
            }
            let tableBody = "<tbody>" + "<tr>" +
                "<th>PID</th><th>State</th><th>PC</th><th>IR</th><th>ACC</th><th>X</th><th>Y</th><th>Z</th><th>Base</th><th>Limit</th><th>Location</th>" +
                "</tr>";
            for (let i = 0; i < _MemoryManager.residentList.length; i++) {
                tableBody += "<tr>" +
                    `<td> ${_MemoryManager.residentList[i].processID.toString()} </td>` +
                    `<td> ${_MemoryManager.residentList[i].processState} </td>` +
                    `<td> ${_MemoryManager.residentList[i].programCounter.toString()} </td>` +
                    `<td> ${instruction} </td>` +
                    `<td> ${TSOS.Utils.toHexDigit(_MemoryManager.residentList[i].acc, 2)} </td>` +
                    `<td> ${TSOS.Utils.toHexDigit(_MemoryManager.residentList[i].XRegister, 2)} </td>` +
                    `<td> ${TSOS.Utils.toHexDigit(_MemoryManager.residentList[i].YRegister, 2)} </td>` +
                    `<td> ${_MemoryManager.residentList[i].ZFlag.toString()} </td>` +
                    `<td> ${_MemoryManager.residentList[i].baseRegister.toString()} </td>` +
                    `<td> ${_MemoryManager.residentList[i].limitRegister.toString()} </td>` +
                    `<td> ${_MemoryManager.allocated[pcb.processID].toString()} </td>` +
                    "</tr>";
            }
            tableBody += "</tbody>";
            table.innerHTML = tableBody;
        }

        public static updateDiskDisplay() {
            var table = document.getElementById("diskTable");
            var tableBody = "<tbody>" + "<tr>" +
            "<th>T:S:B</th><th>Used</th><th>Next</th><th>Data</th>" +
            "</tr>";
            for (var i = 0; i < _Disk.numTracks; i++) {
                for (var j = 0; j < _Disk.numSectors; j++) {
                    for (var k = 0; k < _Disk.numBlocks; k++) {
                        var data = sessionStorage.getItem(i + "," + j + "," + k).split(" ");
                        var blockData = "";
                        for (var x = 4; x < data.length; x++) {
                            blockData += (data[x] + " ");
                        }
                        blockData.trim();
                        tableBody += "<tr>" +
                        `<td> ${i + ',' + j + ',' + k} </td>` +
                        `<td> ${data[0]} </td>` +
                        `<td> ${data[1] + ',' + data[2] + ',' + data[3]} </td>` +
                        `<td> ${blockData} </td>`;
                    }
                }
            }
            tableBody += "</tbody>";
            table.innerHTML = tableBody;
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnSingleStep")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnStep")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            _Memory = new Memory(_MemorySize);
            _Memory.init();
            _MemoryAccessor = new MemoryAccessor();

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload();
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static hostBtnSingleStep_click(btn): void {
            //Toggle single step mode
            TSOS.Cpu.singleStep = !(TSOS.Cpu.singleStep);
            (<HTMLButtonElement> document.getElementById("btnStep")).disabled = !(TSOS.Cpu.singleStep);
            btn.value = (TSOS.Cpu.singleStep) ? 'Single-Step Execution: On' : 'Single-Step Execution: Off';

            //If single step is turned off while executing a program, we need to start executing again
            if (!TSOS.Cpu.singleStep && !_CPU.isExecuting && _CPU.PC !== 0) {
                _CPU.isExecuting = true;
            }
        }

        public static hostBtnStep_click(btn): void {
            //Execute next step in program
            _CPU.isExecuting = true;
        }
    }
}
