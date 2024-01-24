import type { LongLanguageCode } from '../../../types';
import type { SynthesizeResult } from '../types';
import { TTSSynthesizerBase } from '../tts-synthesizer-base';
export default class FliteSynthesizer extends TTSSynthesizerBase {
    protected readonly name = "Flite TTS Synthesizer";
    protected readonly lang: "en-US" | "fr-FR";
    private readonly binPath;
    constructor(lang: LongLanguageCode);
    synthesize(speech: string): Promise<SynthesizeResult | null>;
}
