/// <reference types="node" />
import { OSTypes, CPUArchitectures } from '../types';
declare enum OSNames {
    Windows = "Windows",
    MacOS = "macOS",
    Linux = "Linux",
    Unknown = "Unknown"
}
export declare enum BinaryFolderNames {
    Linux64Bit = "linux-x86_64",
    LinuxARM64 = "linux-aarch64",
    MacOS64Bit = "macosx-x86_64",
    MacOSARM64 = "macosx-arm64",
    Windows64Bit = "win-amd64",
    Unknown = "unknown"
}
interface GetInformation {
    type: OSTypes;
    name: OSNames;
    platform: NodeJS.Platform;
    cpuArchitecture: CPUArchitectures;
}
export declare class SystemHelper {
    /**
     * Get information about your OS
     * N.B. Node.js returns info based on the compiled binary we are running on. Not based our machine hardware
     * @see https://github.com/nodejs/node/blob/main/BUILDING.md#supported-platforms
     * @example getInformation() // { type: 'linux', name: 'Linux', platform: 'linux', cpuArchitecture: 'x64' }
     */
    static getInformation(): GetInformation;
    /**
     * Get binaries folder name based on the platform and CPU architecture
     * Comply with the naming convention of Python sysconfig.get_platform()
     * @see https://github.com/python/cpython/blob/main/Lib/sysconfig.py
     * @example getBinariesFolderName() // 'linux-x86_64'
     */
    static getBinariesFolderName(): BinaryFolderNames;
    /**
     * Get the number of cores on your machine
     * @example getNumberOfCPUCores() // 8
     */
    static getNumberOfCPUCores(): number;
    /**
     * Get the total amount of memory (in GB) on your machine
     * @example getTotalRAM() // 4
     */
    static getTotalRAM(): number;
    /**
     * Get the amount of free memory (in GB) on your machine
     * @example getFreeRAM() // 6
     */
    static getFreeRAM(): number;
    /**
     * Get the Node.js version of the current process
     * @example getNodeJSVersion() // '18.15.0'
     */
    static getNodeJSVersion(): string;
    /**
     * Get the npm version used to run the current process
     * @example getNPMVersion() // '9.5.0'
     */
    static getNPMVersion(): string;
    /**
     * Replace all current session profile name occurrences with {username} placeholder
     * @example sanitizeUsername('/home/louis') // '/home/{username}'
     */
    static sanitizeUsername(str: string): string;
}
export {};
