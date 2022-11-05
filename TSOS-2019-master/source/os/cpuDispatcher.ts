/* -----------------
* cpuDispatcher.ts
* 
* CPU Dispatcher 
* --------------------*/

//CPU Dispatcher is responsible for handling context switching from the CPU Scheduler

module TSOS {

    export class CpuDispatcher {

        constructor() {
            
        }

        public contextSwitch() {
            if (_MemoryManager.readyQueue.getSize() > 0) {
                //Put the executing process back in the ready queue and change to ready state
                _CpuScheduler.executingPCB.processState = "Ready";
                _MemoryManager.readyQueue.enqueue(_CpuScheduler.executingPCB);
                //Get the next process and update the current process
                var nextProcess = _MemoryManager.readyQueue.dequeue();
                _CpuScheduler.executingPCB = nextProcess;
                //And load it to the cpu to start execution
                _CPU.loadProcess(_CpuScheduler.executingPCB);
            }
            //Else - nothing in the ready queue
            else {
                alert("Empty ready queue");
            }
        }

    }

}