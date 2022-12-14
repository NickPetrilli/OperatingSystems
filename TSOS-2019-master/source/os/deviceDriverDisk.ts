/* -----------------
* deviceDriverDisk.ts
* 
* Device Driver Disk
* --------------------*/


module TSOS {


    export class DeviceDriverDisk extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnDiskDriverEntry;
        }

        public krnDiskDriverEntry() {
            // Initialization routine for this, the Disk Device Driver.
            this.status = "loaded";
            // More?
        }

        public formatDisk() {
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

        public createNewBlock(): string[] {
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

        public createFile(filename: string): boolean {
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
        public nextDirectoryEntry(): string {
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

        public nextDataEntry(): string {
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

        public writeToFile(fileName: string, fileData: string) {
            //FILE TSB REFERS TO IN DIRECTORY, FILE DATA TSB REFERS TO IN DATA SECTION
            //First need to find the t,s,b of the directory entry with the filename
            //Then need go into that t,s,b to get just the fileName to match it with the command
            //Then need to get the data t,s,b for where to write to
            //Finally write the data to that data t,s,b
            var fileDataTSB = this.getFileDataTSB(fileName);
            alert(fileDataTSB);
            //When writing to a file, check the length to see if it needs to be linked to another tsb
            //Writing to a file will replace any data that was previously in the file

        }

        //Takes in the fileName and returns the t,s,b of where the data in that file is
        public getFileDataTSB(fileName: string): string {
            let tsbFile = this.getFileTSB(fileName);
            if (tsbFile != null) {
                let tsbFileName = sessionStorage.getItem(tsbFile).split(" ");
                return tsbFileName[1] + "," + tsbFileName[2] + "," + tsbFileName[3];
            }
            else {
                return null;
            }
        }

        //Takes in the fileName and returns the t,s,b of the file in the directory
        public getFileTSB(fileName: string): string {
            for (let i = 0; i < _Disk.numSectors; i++) {
                for (let j = 0; j < _Disk.numBlocks; j++) {
                    let data = sessionStorage.getItem("0," + i + "," + j).split(" ");
                    let usedBit = data[0];
                    let thisFileName = this.getFileName(data);
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

        //Takes in the whole block of data containing the filename, and returns just the filename
        public getFileName(fileNameData: string[]): string {
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

        public decimalToHex(decimalNum: number): string {
            return decimalNum.toString(16);
        }

        public hexToDecimal(hexString: string): number {
            return parseInt(hexString, 16);
        }
    }
}
