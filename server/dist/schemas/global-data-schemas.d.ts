import type { Static } from '@sinclair/typebox';
export declare const globalEntitySchemaObject: import("@sinclair/typebox").TObject<{
    options: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
        synonyms: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        data: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>>;
    }>>;
}>;
export declare const globalResolverSchemaObject: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    intents: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
        utterance_samples: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        value: import("@sinclair/typebox").TUnknown;
    }>>;
}>;
export declare const globalAnswersSchemaObject: import("@sinclair/typebox").TObject<{
    answers: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TString>, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>]>>;
}>;
export type GlobalEntitySchema = Static<typeof globalEntitySchemaObject>;
export type GlobalResolverSchema = Static<typeof globalResolverSchemaObject>;
export type GlobalAnswersSchema = Static<typeof globalAnswersSchemaObject>;
