import type { LongLanguageCode } from '../../../types';
import type { SynthesizeResult } from '../types';
import { TTSSynthesizerBase } from '../tts-synthesizer-base';
export default class GoogleCloudTTSSynthesizer extends TTSSynthesizerBase {
    protected readonly name = "Google Cloud TTS Synthesizer";
    protected readonly lang: "en-US" | "fr-FR";
    private readonly client;
    constructor(lang: LongLanguageCode);
    synthesize(speech: string): Promise<SynthesizeResult | null>;
}
