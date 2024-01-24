export declare class LogHelper {
    static readonly ERRORS_FILE_PATH: string;
    /**
     * This one looks obvious :)
     */
    static success(value: string): void;
    /**
     * This one looks obvious :)
     */
    static info(value: string): void;
    /**
     * This one looks obvious :)
     */
    static warning(value: string): void;
    /**
     * This one looks obvious :)
     */
    static debug(value: string): void;
    /**
     * Log message on stderr and write in error log file
     */
    static error(value: string): void;
    /**
     * This one looks obvious :)
     */
    static title(value: string): void;
    /**
     * This one looks obvious :)
     */
    static default(value: string): void;
    /**
     * Start a log timer
     */
    static time(value: string): void;
    /**
     * Stop log timer
     */
    static timeEnd(value: string): void;
    /**
     * Parse error logs and return an array of log errors
     * @example parseErrorLogs() // 'Failed to connect to the TCP server: Error: read ECONNRESET'
     */
    static parseErrorLogs(): Promise<string[]>;
}
