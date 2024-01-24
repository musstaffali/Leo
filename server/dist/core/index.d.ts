import TCPClient from './tcp-client';
import HTTPServer from './http-server/http-server';
import SocketServer from './socket-server';
import SpeechToText from './stt/stt';
import TextToSpeech from './tts/tts';
import AutomaticSpeechRecognition from './asr/asr';
import NamedEntityRecognition from './nlp/nlu/ner';
import ModelLoader from './nlp/nlu/model-loader';
import NaturalLanguageUnderstanding from './nlp/nlu/nlu';
import Brain from './brain/brain';
/**
 * Register core singletons
 */
export declare const TCP_CLIENT: TCPClient;
export declare const HTTP_SERVER: HTTPServer;
export declare const SOCKET_SERVER: SocketServer;
export declare const STT: SpeechToText;
export declare const TTS: TextToSpeech;
export declare const ASR: AutomaticSpeechRecognition;
export declare const NER: NamedEntityRecognition;
export declare const MODEL_LOADER: ModelLoader;
export declare const NLU: NaturalLanguageUnderstanding;
export declare const BRAIN: Brain;
