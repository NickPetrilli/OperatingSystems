/* -----------------
* deviceDriverDisk.ts
*
* Device Driver Disk
* --------------------*/
var TSOS;
(function (TSOS) {
    class DeviceDriverDisk extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnDiskDriverEntry;
        }
        krnDiskDriverEntry() {
            // Initialization routine for this, the Disk Device Driver.
            this.status = "loaded";
            // More?
        }
        formatDisk() {
            _Kernel.krnTrace("Beginning disk format.");
            var block = this.createNewBlock();
            for (var i = 0; i < _Disk.numTracks; i++) {
                for (var j = 0; j < _Disk.numSectors; j++) {
                    for (var k = 0; k < _Disk.numBlocks; k++) {
                        //Master Boot Record
                        if ((i == 0) && (j == 0) && (k == 0)) {
                            block[0] = "1";
                            sessionStorage.setItem(i + "," + j + "," + k, block.join(" "));
                            block[0] = "0";
                        }
                        else {
                            sessionStorage.setItem(i + "," + j + "," + k, block.join(" "));
                        }
                    }
                }
            }
            _Kernel.krnTrace("Disk formatted.");
            TSOS.Control.updateDiskDisplay();
        }
        createNewBlock() {
            //Each block is an array of size 64
            let block = new Array(64);
            for (var i = 0; i < 4; i++) {
                block[i] = "0";
            }
            for (var j = 0; j < block.length; j++) {
                block[j] = "-";
            }
            return block;
        }
        createFile(filename) {
            //First file entry will be directory block 001
            //TODO: check that file doesn't exist first - return true or false
            var directoryEntry = this.nextDirectoryEntry();
            var dataEntry = this.nextDataEntry();
            var directoryEntryData = this.createNewBlock();
            var dataEntryData = this.createNewBlock();
            //Set the used bit to 1 for both the directory entry and data entry
            directoryEntryData[0] = "1";
            dataEntryData[0] = "1";
            //Split on commas to put the T,S,B of data entry in the directory
            var dataEntrySplit = dataEntry.split(",");
            directoryEntryData[1] = dataEntrySplit[0];
            directoryEntryData[2] = dataEntrySplit[1];
            directoryEntryData[3] = dataEntrySplit[2];
            for (var i = 0; i < filename.length; i++) {
                directoryEntryData[i + 4] = this.decimalToHex(filename.charCodeAt(i));
            }
            sessionStorage.setItem(directoryEntry, directoryEntryData.join(" "));
            sessionStorage.setItem(dataEntry, dataEntryData.join(" "));
            return true;
        }
        //Finds the next directory entry to store the filename that is being created
        nextDirectoryEntry() {
            for (var i = 0; i < _Disk.numSectors; i++) {
                for (var j = 0; j < _Disk.numTracks; j++) {
                    var data = sessionStorage.getItem("0," + i + "," + j).split(" ");
                    if (data[0] === "0") {
                        return "0," + i + "," + j;
                    }
                }
            }
            return null;
        }
        nextDataEntry() {
            //Start at track 1 for data section of file system
            for (var i = 1; i < _Disk.numTracks; i++) {
                for (var j = 0; j < _Disk.numSectors; j++) {
                    for (var k = 0; k < _Disk.numBlocks; k++) {
                        var data = sessionStorage.getItem(i + "," + j + "," + k);
                        if (data[0] === "0") {
                            return i + "," + j + "," + k;
                        }
                    }
                }
            }
            return null;
        }
        writeToFile(fileName, fileData) {
            //When writing to a file, check the length to see if it needs to be linked to another tsb
            //Writing to a file will replace any data that was previously in the file
            //First need to find the directory tsb of the desired filename
            //Then need to get the data tsb for where to write to
            //var fileDataTSB = this.getFileDataTSB(fileName);
            var fileDataTSB = this.getFileDataTSB(fileName);
            alert(fileDataTSB);
        }
        /*
                public getFileDataTSB(fileName: string): string {
                    for (var i = 0; i < _Disk.numSectors; i++) {
                        for (var j = 0; j < _Disk.numTracks; j++) {
                            var data = sessionStorage.getItem("0," + i + "," + j).split(" ");
                            var usedBit = data[0];
                            var thisFileName = this.getFileName(fileName, data);
                            if (thisFileName === fileName && usedBit === "1") {
                                return "0," + i + "," + j;
                            }
                        }
                    }
                    return null;
                }
                */
        //Takes in the whole block of data containing the filename, and returns just the filename
        getFileName(fileNameData) {
            let fileName = "";
            for (let i = 4; i < fileNameData.length; i++) {
                if (fileNameData[i] === "-") {
                    return fileName;
                }
                else {
                    fileName += String.fromCharCode(this.hexToDecimal(fileNameData[i]));
                }
            }
            return fileName;
        }
        decimalToHex(decimalNum) {
            return decimalNum.toString(16);
        }
        hexToDecimal(hexString) {
            return parseInt(hexString, 16);
        }
        getFileDataTSB(fileName) {
            let tsbFile = this.getFileTSB(fileName);
            if (tsbFile != null) {
                let tsbFileName = sessionStorage.getItem(tsbFile).split(" ");
                return tsbFileName[1] + "," + tsbFileName[2] + "," + tsbFileName[3];
            }
            else {
                return null;
            }
        }
        getFileTSB(fileName) {
            for (let i = 0; i < _Disk.numSectors; i++) {
                for (let j = 0; j < _Disk.numBlocks; j++) {
                    let thisData = sessionStorage.getItem("0," + i + "," + j).split(" ");
                    let usedBit = thisData[0];
                    let thisFileName = this.getFileName(thisData);
                    if (thisFileName == fileName) {
                        if (usedBit == "1") {
                            return "0" + "," + i + "," + j;
                            break;
                        }
                        else if (usedBit == "0") {
                            return null;
                        }
                    }
                }
            }
            return null;
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map