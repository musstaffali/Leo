"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemHelper = exports.BinaryFolderNames = void 0;
const node_os_1 = __importDefault(require("node:os"));
const types_1 = require("../types");
var OSNames;
(function (OSNames) {
    OSNames["Windows"] = "Windows";
    OSNames["MacOS"] = "macOS";
    OSNames["Linux"] = "Linux";
    OSNames["Unknown"] = "Unknown";
})(OSNames || (OSNames = {}));
var BinaryFolderNames;
(function (BinaryFolderNames) {
    BinaryFolderNames["Linux64Bit"] = "linux-x86_64";
    BinaryFolderNames["LinuxARM64"] = "linux-aarch64";
    BinaryFolderNames["MacOS64Bit"] = "macosx-x86_64";
    BinaryFolderNames["MacOSARM64"] = "macosx-arm64";
    BinaryFolderNames["Windows64Bit"] = "win-amd64";
    BinaryFolderNames["Unknown"] = "unknown";
})(BinaryFolderNames || (exports.BinaryFolderNames = BinaryFolderNames = {}));
class SystemHelper {
    /**
     * Get information about your OS
     * N.B. Node.js returns info based on the compiled binary we are running on. Not based our machine hardware
     * @see https://github.com/nodejs/node/blob/main/BUILDING.md#supported-platforms
     * @example getInformation() // { type: 'linux', name: 'Linux', platform: 'linux', cpuArchitecture: 'x64' }
     */
    static getInformation() {
        const platform = node_os_1.default.platform();
        const cpuArchitecture = node_os_1.default.arch();
        const information = {
            linux: {
                type: types_1.OSTypes.Linux,
                name: OSNames.Linux
            },
            darwin: {
                type: types_1.OSTypes.MacOS,
                name: OSNames.MacOS
            },
            // Node.js returns "win32" for both 32-bit and 64-bit versions of Windows
            win32: {
                type: types_1.OSTypes.Windows,
                name: OSNames.Windows
            }
        };
        return {
            ...(information[platform] || {
                type: types_1.OSTypes.Unknown,
                name: OSNames.Unknown
            }),
            platform,
            cpuArchitecture
        };
    }
    /**
     * Get binaries folder name based on the platform and CPU architecture
     * Comply with the naming convention of Python sysconfig.get_platform()
     * @see https://github.com/python/cpython/blob/main/Lib/sysconfig.py
     * @example getBinariesFolderName() // 'linux-x86_64'
     */
    static getBinariesFolderName() {
        const { type, cpuArchitecture } = this.getInformation();
        if (type === types_1.OSTypes.Linux) {
            if (cpuArchitecture === types_1.CPUArchitectures.X64) {
                return BinaryFolderNames.Linux64Bit;
            }
            return BinaryFolderNames.LinuxARM64;
        }
        if (type === types_1.OSTypes.MacOS) {
            const cpuCores = node_os_1.default.cpus();
            const isM1 = cpuCores[0]?.model.includes('Apple');
            if (isM1 || cpuArchitecture === types_1.CPUArchitectures.ARM64) {
                return BinaryFolderNames.MacOSARM64;
            }
            return BinaryFolderNames.MacOS64Bit;
        }
        if (type === types_1.OSTypes.Windows) {
            return BinaryFolderNames.Windows64Bit;
        }
        return BinaryFolderNames.Unknown;
    }
    /**
     * Get the number of cores on your machine
     * @example getNumberOfCPUCores() // 8
     */
    static getNumberOfCPUCores() {
        return node_os_1.default.cpus().length;
    }
    /**
     * Get the total amount of memory (in GB) on your machine
     * @example getTotalRAM() // 4
     */
    static getTotalRAM() {
        return Number((node_os_1.default.totalmem() / (1024 * 1024 * 1024)).toFixed(2));
    }
    /**
     * Get the amount of free memory (in GB) on your machine
     * @example getFreeRAM() // 6
     */
    static getFreeRAM() {
        return Number((node_os_1.default.freemem() / (1024 * 1024 * 1024)).toFixed(2));
    }
    /**
     * Get the Node.js version of the current process
     * @example getNodeJSVersion() // '18.15.0'
     */
    static getNodeJSVersion() {
        return process.versions.node || '0.0.0';
    }
    /**
     * Get the npm version used to run the current process
     * @example getNPMVersion() // '9.5.0'
     */
    static getNPMVersion() {
        return (process.env['npm_config_user_agent']?.split('/')[1]?.split(' ')[0] ||
            '0.0.0');
    }
    /**
     * Replace all current session profile name occurrences with {username} placeholder
     * @example sanitizeUsername('/home/louis') // '/home/{username}'
     */
    static sanitizeUsername(str) {
        const { username } = node_os_1.default.userInfo();
        return str.replace(new RegExp(username, 'g'), '{username}');
    }
}
exports.SystemHelper = SystemHelper;
