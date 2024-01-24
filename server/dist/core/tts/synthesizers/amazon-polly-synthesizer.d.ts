import type { LongLanguageCode } from '../../../types';
import type { SynthesizeResult } from '../types';
import { TTSSynthesizerBase } from '../tts-synthesizer-base';
export default class AmazonPollySynthesizer extends TTSSynthesizerBase {
    protected readonly name = "Amazon Polly TTS Synthesizer";
    protected readonly lang: "en-US" | "fr-FR";
    private readonly client;
    constructor(lang: LongLanguageCode);
    synthesize(speech: string): Promise<SynthesizeResult | null>;
}
