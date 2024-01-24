import type { Static } from '@sinclair/typebox';
export declare const amazonVoiceConfiguration: import("@sinclair/typebox").TObject<{
    credentials: import("@sinclair/typebox").TObject<{
        accessKeyId: import("@sinclair/typebox").TString;
        secretAccessKey: import("@sinclair/typebox").TString;
    }>;
    region: import("@sinclair/typebox").TString;
}>;
export declare const googleCloudVoiceConfiguration: import("@sinclair/typebox").TObject<{
    type: import("@sinclair/typebox").TLiteral<"service_account">;
    project_id: import("@sinclair/typebox").TString;
    private_key_id: import("@sinclair/typebox").TString;
    private_key: import("@sinclair/typebox").TString;
    client_email: import("@sinclair/typebox").TString;
    client_id: import("@sinclair/typebox").TString;
    auth_uri: import("@sinclair/typebox").TString;
    token_uri: import("@sinclair/typebox").TString;
    auth_provider_x509_cert_url: import("@sinclair/typebox").TString;
    client_x509_cert_url: import("@sinclair/typebox").TString;
}>;
export declare const watsonVoiceConfiguration: import("@sinclair/typebox").TObject<{
    apikey: import("@sinclair/typebox").TString;
    url: import("@sinclair/typebox").TString;
}>;
export type AmazonVoiceConfigurationSchema = Static<typeof amazonVoiceConfiguration>;
export type GoogleCloudVoiceConfigurationSchema = Static<typeof googleCloudVoiceConfiguration>;
export type WatsonVoiceConfigurationSchema = Static<typeof watsonVoiceConfiguration>;
export type VoiceConfigurationSchema = AmazonVoiceConfigurationSchema | GoogleCloudVoiceConfigurationSchema | WatsonVoiceConfigurationSchema;
