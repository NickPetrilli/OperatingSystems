/* -----------------
* cpuSwapper.ts
*
* CPU Swapper
* --------------------*/
//CPU Swapper works with the CPU Scheduler and CPU Dispatcher to roll in and roll out processes to the disk
var TSOS;
(function (TSOS) {
    class CpuSwapper {
        constructor() {
            this.rollOutData = "";
            this.rollInData = "";
        }
        rollIn(diskPCB, segment) {
            // Read the swap file as raw hex characters (hexFile=true)
            this.rollInData = _krnDiskDriver.readFile("@swap" + diskPCB.processID, undefined, undefined, true);
            // Assign the target memory segment registers
            diskPCB.baseRegister = segment * 256;
            diskPCB.limitRegister = diskPCB.baseRegister + 255;
            diskPCB.memSegment = segment;
            // Update allocation tracking so deallocateMemory can find this process later
            _MemoryManager.allocated[segment] = diskPCB.processID;
            _Memory.clearRange(diskPCB.baseRegister, diskPCB.limitRegister);
            // rollInData is a string of concatenated 2-char hex pairs, e.g. "A9008D..."
            var addressCounter = 0;
            for (var i = 0; i < this.rollInData.length; i += 2) {
                var byteToWrite = this.rollInData.charAt(i) + this.rollInData.charAt(i + 1);
                _MemoryAccessor.write(diskPCB, addressCounter, byteToWrite);
                addressCounter++;
            }
            diskPCB.isInMemory = true;
            _krnDiskDriver.deleteFile("@swap" + diskPCB.processID);
            TSOS.Control.updateMemoryDisplay();
            TSOS.Control.updateDiskDisplay();
        }
        rollOut(memoryPCB) {
            // Build swap data as concatenated 2-char hex pairs with no spaces
            this.rollOutData = "";
            for (var i = 0; i < 256; i++) {
                this.rollOutData += _MemoryAccessor.read(memoryPCB, i);
            }
            _Memory.clearRange(memoryPCB.baseRegister, memoryPCB.limitRegister);
            // Free the allocation slot so allocateMemory can reuse this segment
            _MemoryManager.allocated[memoryPCB.memSegment] = -1;
            memoryPCB.isInMemory = false;
            memoryPCB.memSegment = -1;
            memoryPCB.baseRegister = -1;
            memoryPCB.limitRegister = -1;
            _krnDiskDriver.createSwapFile(memoryPCB.processID, this.rollOutData);
            this.rollOutData = "";
            TSOS.Control.updateDiskDisplay();
        }
    }
    TSOS.CpuSwapper = CpuSwapper;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuSwapper.js.map