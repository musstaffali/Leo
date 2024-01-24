"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENTITY_TYPES = exports.SPACY_ENTITY_TYPES = exports.CUSTOM_ENTITY_TYPES = exports.BUILT_IN_ENTITY_TYPES = void 0;
/**
 * NER types
 */
/* eslint-disable @typescript-eslint/no-empty-interface */
exports.BUILT_IN_ENTITY_TYPES = [
    'number',
    'ip',
    'hashtag',
    'phonenumber',
    'currency',
    'percentage',
    'date',
    'time',
    'timerange',
    'daterange',
    'datetimerange',
    'duration',
    'dimension',
    'email',
    'ordinal',
    'age',
    'url',
    'temperature'
];
exports.CUSTOM_ENTITY_TYPES = ['regex', 'trim', 'enum'];
exports.SPACY_ENTITY_TYPES = [
    'location:country',
    'location:city',
    'person',
    'organization'
];
exports.ENTITY_TYPES = [
    ...exports.BUILT_IN_ENTITY_TYPES,
    ...exports.CUSTOM_ENTITY_TYPES,
    ...exports.SPACY_ENTITY_TYPES
];
