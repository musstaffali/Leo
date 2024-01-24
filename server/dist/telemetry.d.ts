import type { NLUProcessResult } from './core/nlp/types';
interface PostIntallResponse {
    instanceID: string;
    birthDate: number;
}
export declare class Telemetry {
    private static readonly serviceURL;
    private static readonly instanceID;
    private static readonly axios;
    static postInstall(): Promise<PostIntallResponse | unknown>;
    static start(): Promise<void>;
    static utterance(processedData: NLUProcessResult | null): Promise<void>;
    static error(error: string): Promise<void>;
    static stop(): Promise<void>;
    static heartbeat(): Promise<void>;
    private static sendEvent;
    private static anonymizeEntities;
}
export {};
