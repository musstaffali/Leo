import type { Static } from '@sinclair/typebox';
import { SkillBridges } from '../core/brain/types';
declare const answerTypes: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
    speech: import("@sinclair/typebox").TString;
    text: import("@sinclair/typebox").TString;
}>]>;
declare const skillCustomEnumEntityType: import("@sinclair/typebox").TObject<{
    type: import("@sinclair/typebox").TLiteral<"enum">;
    name: import("@sinclair/typebox").TString;
    options: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
        synonyms: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
    }>>;
}>;
declare const skillCustomRegexEntityType: import("@sinclair/typebox").TObject<{
    type: import("@sinclair/typebox").TLiteral<"regex">;
    name: import("@sinclair/typebox").TString;
    regex: import("@sinclair/typebox").TString;
}>;
declare const skillCustomTrimEntityType: import("@sinclair/typebox").TObject<{
    type: import("@sinclair/typebox").TLiteral<"trim">;
    name: import("@sinclair/typebox").TString;
    conditions: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"between">, import("@sinclair/typebox").TLiteral<"after">, import("@sinclair/typebox").TLiteral<"after_first">, import("@sinclair/typebox").TLiteral<"after_last">, import("@sinclair/typebox").TLiteral<"before">, import("@sinclair/typebox").TLiteral<"before_first">, import("@sinclair/typebox").TLiteral<"before_last">]>;
        from: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>, import("@sinclair/typebox").TString]>>;
        to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>, import("@sinclair/typebox").TString]>>;
    }>>;
}>;
export declare const domainSchemaObject: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
}>;
export declare const skillSchemaObject: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    bridge: import("@sinclair/typebox").TUnion<(import("@sinclair/typebox").TLiteral<SkillBridges.Python> | import("@sinclair/typebox").TLiteral<SkillBridges.NodeJS> | import("@sinclair/typebox").TNull)[]>;
    version: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TString;
    author: import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TString;
        email: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
}>;
export declare const skillConfigSchemaObject: import("@sinclair/typebox").TObject<{
    variables: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TString>>;
    actions: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
        type: import("@sinclair/typebox").TUnion<(import("@sinclair/typebox").TLiteral<"logic"> | import("@sinclair/typebox").TLiteral<"dialog">)[]>;
        loop: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            expected_item: import("@sinclair/typebox").TObject<{
                type: import("@sinclair/typebox").TUnion<(import("@sinclair/typebox").TLiteral<"skill_resolver"> | import("@sinclair/typebox").TLiteral<"global_resolver"> | import("@sinclair/typebox").TLiteral<"entity">)[]>;
                name: import("@sinclair/typebox").TString;
            }>;
        }>>;
        http_api: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            entities: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                entity: import("@sinclair/typebox").TString;
                resolution: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            }>>;
        }>>;
        utterance_samples: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        answers: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
            speech: import("@sinclair/typebox").TString;
            text: import("@sinclair/typebox").TString;
        }>]>>>;
        unknown_answers: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
            speech: import("@sinclair/typebox").TString;
            text: import("@sinclair/typebox").TString;
        }>]>>>;
        suggestions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        slots: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            item: import("@sinclair/typebox").TObject<{
                type: import("@sinclair/typebox").TUnion<(import("@sinclair/typebox").TLiteral<"skill_resolver"> | import("@sinclair/typebox").TLiteral<"global_resolver"> | import("@sinclair/typebox").TLiteral<"entity">)[]>;
                name: import("@sinclair/typebox").TString;
            }>;
            questions: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            suggestions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>>>;
        entities: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<(import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            type: import("@sinclair/typebox").TLiteral<"trim">;
            name: import("@sinclair/typebox").TString;
            conditions: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"between">, import("@sinclair/typebox").TLiteral<"after">, import("@sinclair/typebox").TLiteral<"after_first">, import("@sinclair/typebox").TLiteral<"after_last">, import("@sinclair/typebox").TLiteral<"before">, import("@sinclair/typebox").TLiteral<"before_first">, import("@sinclair/typebox").TLiteral<"before_last">]>;
                from: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>, import("@sinclair/typebox").TString]>>;
                to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>, import("@sinclair/typebox").TString]>>;
            }>>;
        }>> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            type: import("@sinclair/typebox").TLiteral<"regex">;
            name: import("@sinclair/typebox").TString;
            regex: import("@sinclair/typebox").TString;
        }>> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            type: import("@sinclair/typebox").TLiteral<"enum">;
            name: import("@sinclair/typebox").TString;
            options: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
                synonyms: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            }>>;
        }>>)[]>>;
        next_action: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>>;
    answers: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
        speech: import("@sinclair/typebox").TString;
        text: import("@sinclair/typebox").TString;
    }>]>>>>;
    entities: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TString>>;
    resolvers: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
        intents: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
            utterance_samples: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            value: import("@sinclair/typebox").TUnknown;
        }>>;
    }>>>;
}>;
export type DomainSchema = Static<typeof domainSchemaObject>;
export type SkillSchema = Static<typeof skillSchemaObject>;
export type SkillConfigSchema = Static<typeof skillConfigSchemaObject>;
export type SkillBridgeSchema = Static<typeof skillSchemaObject.bridge>;
export type SkillCustomTrimEntityTypeSchema = Static<typeof skillCustomTrimEntityType>;
export type SkillCustomRegexEntityTypeSchema = Static<typeof skillCustomRegexEntityType>;
export type SkillCustomEnumEntityTypeSchema = Static<typeof skillCustomEnumEntityType>;
export type SkillAnswerConfigSchema = Static<typeof answerTypes>;
export {};
