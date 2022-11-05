/* -----------------
* cpuScheduler.ts
*
* CPU Scheduler
* --------------------*/
var TSOS;
(function (TSOS) {
    class CpuScheduler {
        constructor() {
            this.quantum = 6;
            this.scheduleMode = "Round Robin";
            this.executingPCB = null;
            this.counter = 1;
        }
        getQuantum() {
            return this.quantum;
        }
        setQuantum(q) {
            this.quantum = q;
        }
        contextSwitch() {
            if (_MemoryManager.readyQueue.getSize() > 0) {
                //Put the executing process back in the ready queue and change to ready state
                this.executingPCB.processState = "Ready";
                _MemoryManager.readyQueue.enqueue(this.executingPCB);
                //Get the next process and update the current process
                var nextProcess = _MemoryManager.readyQueue.dequeue();
                this.executingPCB = nextProcess;
                //And load it to the cpu to start execution
                _CPU.loadProcess(this.executingPCB);
            }
            //Else - nothing in the ready queue
            else {
                alert("Empty context switch");
            }
        }
        schedule() {
            this.scheduleRoundRobin();
            //TODO for iProject 4: Add FCFS and priority scheduling
        }
        scheduleRoundRobin() {
            if (this.executingPCB === null && _MemoryManager.readyQueue.getSize() > 0) {
                this.executingPCB = _MemoryManager.readyQueue.dequeue();
                _CPU.loadProcess(this.executingPCB);
            }
            //Already have a process executing, checking for another one to context switch to
            else if (_MemoryManager.readyQueue.getSize() > 0) {
                //Each process executes 6 cpu cycles and then moves to the next process
                if (this.counter === this.quantum) {
                    this.counter = 1;
                    this.contextSwitch();
                }
            }
        }
        incrementCounter() {
            this.counter++;
        }
    }
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuScheduler.js.map