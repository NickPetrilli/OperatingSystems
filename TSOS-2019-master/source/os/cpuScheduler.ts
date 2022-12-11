/* -----------------
* cpuScheduler.ts
* 
* CPU Scheduler 
* --------------------*/

//CPU Scheduler schedules processes based on its configured mode and sends to CPU Dispatcher for context switches

module TSOS {

    export class CpuScheduler {

        private quantum: number; //Round Robin quantum
        private scheduleMode: string; //Round Robin, FCFS

        public executingPCB: TSOS.ProcessControlBlock;
        private counter: number;

        constructor() {
            this.quantum = 6;
            this.scheduleMode = "rr";

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
                case "rr":
                    this.scheduleRoundRobin();
                    break;
                case "fcfs":
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
                    _Kernel.krnInterruptHandler(CONTEXT_SWITCH_IRQ);
                }
            }

        }

        public scheduleFirstComeFirstServe(): void {
            //FCFS is essentially Round Robin scheduling with the quantum set as the highest value
            this.quantum = Number.MAX_VALUE;
            this.scheduleRoundRobin();
        }

        public incrementCounter(): void {
            this.counter++;
        }

        public resetCounter(): void {
            this.counter = 1;
        }

        public setExecutingPCB(pcb: TSOS.ProcessControlBlock): void {
            this.executingPCB = pcb;
        }

        public getScheduleMode(): string {
            if (this.scheduleMode == "rr") {
                return "Round Robin";
            }
            else if (this.scheduleMode === "fcfs") {
                return "First Come First Serve";
            }
            
        }

        public setSchedulingMode(mode: string): void {
            this.scheduleMode = mode;
        }

    }
}