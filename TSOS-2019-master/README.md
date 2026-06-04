# NickOS — Browser-Based Operating System

A fully functional operating system simulation running entirely in the browser, built in TypeScript and compiled to JavaScript. NickOS simulates a complete OS environment including a CPU, memory, disk, process scheduler, and interactive shell — all rendered as a dark system-monitor UI.

---

## What Happens When You Open the Site

When you click **START**, a scripted test harness called **GLaDOS** (Genetic Lifeform and Disk Operating System) runs automatically. It greets you with a message, then immediately begins exercising the OS by driving the shell as if a user were typing. Here is exactly what it does, in order:

1. **Runs `help` twice** — scrolls the terminal to verify line-wrap and scroll behavior
2. **Runs `ver`** — prints the OS version
3. **Runs `date`** — prints the current date and time
4. **Runs `whereami`** — prints the user's location message
5. **Runs `StAtUs FiNaL`** — tests the `status` command (intentionally mixed-case to verify case-insensitive parsing), updating the header status bar
6. **Loads invalid hex** — puts garbage text into the Program Input and runs `load`, testing that the OS correctly rejects malformed programs
7. **Runs `format`** — formats the simulated hard disk, making room for more than three processes
8. **Runs `getschedule`** — prints the active CPU scheduling algorithm (Round Robin by default)
9. **Loads four programs** — pastes four valid 6502-compatible machine code programs into the Program Input one second apart, running `load` after each. Each program counts and prints a letter (`a`, `b`, `c`, `d`) a number of times, then terminates
10. **Runs `runall`** — launches all four processes simultaneously under the Round Robin scheduler with context switching
11. **Sets status to "Test the file system"** — a reminder prompt that appears in the header bar while the processes execute

The result is a live demonstration of multi-process scheduling, memory management, and disk I/O — all happening automatically within seconds of clicking START.

---

## Features

### Shell & Terminal
- Interactive command-line interface with a `>` prompt
- Tab completion for commands
- Command history navigation with up/down arrow keys
- Line wrap and auto-scroll as the terminal fills
- Backspace support
- Special character input

### Shell Commands
| Command | Description |
|---|---|
| `help` | Lists all available commands |
| `ver` | Displays OS version |
| `date` | Displays current date and time |
| `whereami` | Displays your location |
| `hello` | Greeting based on time of day |
| `status <msg>` | Updates the header status bar |
| `cls` | Clears the screen |
| `man <topic>` | Displays the manual page for a command |
| `trace <on\|off>` | Toggles kernel trace output |
| `rot13 <string>` | ROT13 obfuscation |
| `prompt <string>` | Changes the shell prompt |
| `shutdown` | Shuts down the OS |
| `bsod` | Triggers a Blue Screen of Death |
| `load` | Loads a hex program from the Program Input area |
| `run <pid>` | Runs the process with the given PID |
| `runall` | Runs all loaded processes |
| `ps` | Lists all running processes and their PIDs |
| `kill <pid>` | Kills a specific process |
| `killall` | Kills all running processes |
| `clearmem` | Clears all memory partitions |
| `quantum <n>` | Sets the Round Robin time quantum |
| `getschedule` | Displays the current CPU scheduling algorithm |
| `setschedule <rr\|fcfs>` | Sets the scheduling algorithm |
| `format` | Formats the simulated hard disk |
| `create <filename>` | Creates a file on disk |
| `write <filename> 'data'` | Writes data to a file |
| `read <filename>` | Reads and prints file contents |
| `delete <filename>` | Deletes a file from disk |
| `copy <src> <dest>` | Copies a file |
| `rename <old> <new>` | Renames a file |
| `ls` | Lists files on disk |

### CPU & Memory
- 6502-inspired instruction set execution
- Three 256-byte memory partitions (768 bytes total)
- Memory displayed live in the Memory panel, updating each cycle
- Single-step execution mode for debugging
- CPU registers (PC, IR, ACC, X, Y, Z) shown in real time

### Process Management
- Process Control Blocks (PCBs) tracking PID, state, and register snapshot
- Process states: New, Resident, Ready, Executing, Terminated
- Color-coded state display in the Process Table panel
- Support for up to four concurrent processes (with disk swapping for overflow)

### CPU Scheduling
- **Round Robin (RR)** — default, preemptive, configurable time quantum
- **First Come First Serve (FCFS)** — non-preemptive, runs each process to completion

### Disk & File System
- Simulated hard disk using `localStorage` (TSB addressing: Track, Sector, Block)
- Full file system: create, read, write, delete, copy, rename, list
- Swap file support: processes that don't fit in memory are rolled out to disk and rolled back in during context switches

---

## Original Course

Based on the starting framework from Alan G. Labouseur's Operating Systems course at Marist College.
See [labouseur.com/courses/os](https://www.labouseur.com/courses/os/) for course details.
