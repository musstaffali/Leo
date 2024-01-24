import type { LongLanguageCode } from '../../../types';
import type { SynthesizeResult } from '../types';
import { TTSSynthesizerBase } from '../tts-synthesizer-base';
export default class WatsonTTSSynthesizer extends TTSSynthesizerBase {
    protected readonly name = "Watson TTS Synthesizer";
    protected readonly lang: LongLanguageCode;
    private readonly client;
    constructor(lang: LongLanguageCode);
    synthesize(speech: string): Promise<SynthesizeResult | null>;
}
