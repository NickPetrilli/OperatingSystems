/* -----------------
* cpuScheduler.ts
* 
* CPU Scheduler 
* --------------------*/

//CPU Scheduler schedules processes based on its configured mode and sends to CPU Dispatcher for context switches

module TSOS {

    export class CpuScheduler {

        private quantum: number; //Round Robin quantum
        private scheduleMode: string; //Round Robin, Priority, First Come First Serve

        public executingPCB: TSOS.ProcessControlBlock;
        private counter: number;

        constructor() {
            this.quantum = 6;
            this.scheduleMode = "Round Robin";

            this.executingPCB = null;
            this.counter = 1;
        }

        public getQuantum(): number {
            return this.quantum;
        }

        public setQuantum(q: number): void {
            this.quantum = q;
        }

        public schedule(): void {
            switch(this.scheduleMode) {
                case "Round Robin":
                    this.scheduleRoundRobin();
                    break;
                case "Priority":
                    this.schedulePriority();
                    break;
                case "FCFS":
                    this.scheduleFirstComeFirstServe();
                    break;
            }
        }

        public scheduleRoundRobin(): void {
            if (this.executingPCB === null && _MemoryManager.readyQueue.getSize() > 0) {
                this.executingPCB = _MemoryManager.readyQueue.dequeue();
                _CPU.loadProcess(this.executingPCB);
            }
            //Already have a process executing, checking for another one to context switch to
            else if (_MemoryManager.readyQueue.getSize() > 0) {
                //Each process executes 6 cpu cycles and then moves to the next process
                if (this.counter === this.quantum) {
                    this.counter = 1;
                    //_Kernel.krnInterruptHandler(CONTEXT_SWITCH_IRQ);
                    _CpuDispatcher.contextSwitch();
                }
            }
        }

        public schedulePriority(): void {
            //TODO for iProject 4
        }

        public scheduleFirstComeFirstServe(): void {
            //TODO for iProject 4
        }

        public incrementCounter(): void {
            this.counter++;
        }

    }
}