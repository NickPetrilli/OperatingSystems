/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    class Shell {
        constructor() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        init() {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "- Displays your location.");
            this.commandList[this.commandList.length] = sc;
            //hello
            sc = new TSOS.ShellCommand(this.shellHello, "hello", "- Displays a greeting.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            //status <string>
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Sets the status message.");
            this.commandList[this.commandList.length] = sc;
            //bsod - blue screen of death
            sc = new TSOS.ShellCommand(this.shellBsod, "bsod", "- Displays a blue screen of death.");
            this.commandList[this.commandList.length] = sc;
            //load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Loads program from user program input text area.");
            this.commandList[this.commandList.length] = sc;
            //run <pid>
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<pid> - Runs the process with the given pid.");
            this.commandList[this.commandList.length] = sc;
            //clearmem
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "- Clears all memory partitions");
            this.commandList[this.commandList.length] = sc;
            //runall
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "- Runs all of the processes in memory");
            this.commandList[this.commandList.length] = sc;
            //ps
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "- Lists all the running proceses and their IDs");
            this.commandList[this.commandList.length] = sc;
            //kill <pid>
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<pid> - Kills the process running with the given pid");
            this.commandList[this.commandList.length] = sc;
            //killall
            sc = new TSOS.ShellCommand(this.shellKillAll, "killall", "- Kills all of the processes");
            this.commandList[this.commandList.length] = sc;
            //quantum
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<num> - Sets the quantum for Round Robin scheduling");
            this.commandList[this.commandList.length] = sc;
            // Display the initial prompt.
            this.putPrompt();
        }
        putPrompt() {
            _StdOut.putText(this.promptStr);
        }
        handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }
        parseInput(buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }
        shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        }
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }
        shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        shellDate(args) {
            _StdOut.putText("The current date and time is " + Date());
        }
        shellWhereAmI(args) {
            _StdOut.putText("In the right place at the right time.");
        }
        shellHello(args) {
            var date = new Date();
            var hours = date.getHours();
            //Checking for the time for different output messages
            if (hours < 12) {
                _StdOut.putText("Good morning, my favorite user.");
            }
            else if (hours >= 12 && hours < 17) {
                _StdOut.putText("Good afternoon, my favorite user.");
            }
            else if (hours >= 17 && hours <= 24) {
                _StdOut.putText("Good evening, my favorite user.");
            }
        }
        shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }
        shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                        _StdOut.putText("Ver displays the name and version of the operating system.");
                        break;
                    case "date":
                        _StdOut.putText("Date displays the current date and time.");
                        break;
                    case "whereami":
                        _StdOut.putText("Whereami displays your location.");
                        break;
                    case "hello":
                        _StdOut.putText("Hello displays a greeting.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shutdown calls the kernel shutdown routine, shutting downthe virtual OS but leaves the underlying host / hardware simulation running.");
                        break;
                    case "cls":
                        _StdOut.putText("Cls clears the screen and resets the cursor position.");
                        break;
                    case "man":
                        _StdOut.putText("Man takes a command argument and outputs what the command does.");
                        break;
                    case "trace":
                        _StdOut.putText("Trace followed by on or off turns the OS trace on or off.");
                        break;
                    case "rot13":
                        _StdOut.putText("Rot13 takes a string argument and does the rot13 obfuscation on the string");
                        break;
                    case "prompt":
                        _StdOut.putText("Prompt takes a string as an argument and sets the prompt to that string.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }
        shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }
        shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        shellStatus(args) {
            if (args.length > 0) {
                var statusLength = args.length;
                var status = "Status: ";
                // Valid for multiple word input
                for (let i = 0; i < statusLength; i++) {
                    status = status + args[i] + " ";
                }
                document.getElementById('divStatus').innerHTML = status;
                _StdOut.putText("Status updated.");
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        }
        shellBsod(args) {
            TSOS.CanvasTextFunctions.bsod();
        }
        shellLoad(args) {
            //Only hex digits and spaces are allowed
            var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', ' '];
            var isValid = true;
            _UserProgramInput = document.getElementById('taProgramInput').value;
            if (_UserProgramInput.length == 0) {
                isValid = false;
            }
            for (var i = 0; i < _UserProgramInput.length; i++) {
                var char = _UserProgramInput[i];
                if (hexDigits.indexOf(char) === -1) {
                    isValid = false;
                    break;
                }
            }
            if (!isValid) {
                _StdOut.putText("Invalid user program.");
            }
            else {
                var arrayProgram = _UserProgramInput.split(' ');
                var processID = _MemoryManager.load(arrayProgram, 1);
                _StdOut.putText("Process ID: " + processID);
            }
        }
        shellRun(args) {
            if (args.length > 0) {
                var pid = parseInt(args[0]);
                if (isNaN(pid)) {
                    _StdOut.putText("Must provide a valid number");
                }
                else if (_MemoryManager.doesProcessExist(pid)) {
                    _CPU.runProcess(pid);
                }
                else {
                    _StdOut.putText("No process with pid " + pid + " in memory");
                }
            }
            else {
                _StdOut.putText("Usage: run <pid> Please supply a PID");
            }
        }
        shellClearMem(args) {
            if (!_CPU.isExecuting) {
                _Memory.clearMemory();
                TSOS.Control.updateMemoryDisplay();
                _StdOut.putText("Memory cleared.");
            }
            else {
                _StdOut.putText("Memory can't be cleared while the CPU is executing.");
            }
        }
        shellRunAll(args) {
            _CPU.runAllProcesses();
        }
        shellPs(args) {
            var processes = _MemoryManager.getAllRunningProcesses();
            if (processes.length === 0) {
                _StdOut.putText("There are no running processes");
            }
            else {
                _StdOut.putText("Running Processes: ");
                for (var process in processes) {
                    _StdOut.putText(processes[process].processID + " ");
                }
            }
        }
        shellKill(args) {
            if (args.length === 0) {
                _StdOut.putText("Must provide a pid to kill");
            }
            else {
                var pid = parseInt(args[0]);
                if (isNaN(pid)) {
                    _StdOut.putText("pid must be an integer");
                }
                else {
                    if (_MemoryManager.doesProcessExist(pid)) {
                        _MemoryManager.killProcess(pid);
                        _StdOut.putText("Process with pid " + pid + " has been killed.");
                    }
                    else {
                        _StdOut.putText("Process with pid " + pid + " does not exist.");
                    }
                }
            }
        }
        shellKillAll(args) {
            var processes = _MemoryManager.getAllRunningProcesses();
            for (var process in processes) {
                _MemoryManager.killProcess(process);
            }
            _StdOut.putText("All processes have been killed.");
        }
        shellQuantum(args) {
            if (args.length === 0) {
                _StdOut.putText("Must provide a quantum.");
            }
            else {
                var quantum = parseInt(args[0]);
                //is Not a Number - returns true if not a number
                if (isNaN(quantum)) {
                    _StdOut.putText("Quantum must be an integer");
                }
                else if (quantum <= 0) {
                    _StdOut.putText("Quantum can't be zero or negative.");
                }
                else {
                    _CpuScheduler.setQuantum(quantum);
                    _StdOut.putText("Quantum set to " + quantum);
                }
            }
        }
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map