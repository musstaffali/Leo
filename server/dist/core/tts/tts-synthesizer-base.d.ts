import type { LongLanguageCode } from '../../types';
import type { SynthesizeResult } from './types';
export declare abstract class TTSSynthesizerBase {
    protected abstract name: string;
    protected abstract lang: LongLanguageCode;
    protected abstract synthesize(speech: string): Promise<SynthesizeResult | null>;
    protected getAudioDuration(audioFilePath: string): Promise<number>;
}
