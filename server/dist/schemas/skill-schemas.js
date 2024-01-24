"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skillConfigSchemaObject = exports.skillSchemaObject = exports.domainSchemaObject = void 0;
const typebox_1 = require("@sinclair/typebox");
const global_data_schemas_1 = require("./global-data-schemas");
const types_1 = require("../core/brain/types");
const skillBridges = [
    typebox_1.Type.Literal(types_1.SkillBridges.Python),
    typebox_1.Type.Literal(types_1.SkillBridges.NodeJS),
    typebox_1.Type.Null()
];
const skillActionTypes = [
    typebox_1.Type.Literal('logic', {
        description: 'It runs the business logic implemented in actions via code.'
    }),
    typebox_1.Type.Literal('dialog', {
        description: "Action that don't need code to run. Leon actually just answers without any business logic."
    })
];
const skillDataTypes = [
    typebox_1.Type.Literal('skill_resolver'),
    typebox_1.Type.Literal('global_resolver'),
    typebox_1.Type.Literal('entity')
];
const answerTypes = typebox_1.Type.Union([
    typebox_1.Type.String(),
    typebox_1.Type.Object({
        speech: typebox_1.Type.String(),
        text: typebox_1.Type.String()
    })
]);
const skillCustomEnumEntityType = typebox_1.Type.Object({
    type: typebox_1.Type.Literal('enum', {
        description: 'Enum: define a bag of words and synonyms that should match your new entity.'
    }),
    name: typebox_1.Type.String(),
    options: typebox_1.Type.Record(typebox_1.Type.String({ minLength: 1 }), typebox_1.Type.Object({
        synonyms: typebox_1.Type.Array(typebox_1.Type.String({ minLength: 1 }))
    }))
}, {
    additionalProperties: false
});
const skillCustomRegexEntityType = typebox_1.Type.Object({
    type: typebox_1.Type.Literal('regex', {
        description: 'Regex: you can create an entity based on a regex.'
    }),
    name: typebox_1.Type.String({ minLength: 1 }),
    regex: typebox_1.Type.String({ minLength: 1 })
}, {
    additionalProperties: false
});
const skillCustomTrimEntityType = typebox_1.Type.Object({
    type: typebox_1.Type.Literal('trim', {
        description: 'Trim: you can pick up a data from an utterance by clearly defining conditions (e.g: pick up what is after the last "with" word of the utterance).'
    }),
    name: typebox_1.Type.String({ minLength: 1 }),
    conditions: typebox_1.Type.Array(typebox_1.Type.Object({
        type: typebox_1.Type.Union([
            typebox_1.Type.Literal('between'),
            typebox_1.Type.Literal('after'),
            typebox_1.Type.Literal('after_first'),
            typebox_1.Type.Literal('after_last'),
            typebox_1.Type.Literal('before'),
            typebox_1.Type.Literal('before_first'),
            typebox_1.Type.Literal('before_last')
        ]),
        from: typebox_1.Type.Optional(typebox_1.Type.Union([
            typebox_1.Type.Array(typebox_1.Type.String({ minLength: 1 })),
            typebox_1.Type.String({ minLength: 1 })
        ])),
        to: typebox_1.Type.Optional(typebox_1.Type.Union([
            typebox_1.Type.Array(typebox_1.Type.String({ minLength: 1 })),
            typebox_1.Type.String({ minLength: 1 })
        ]))
    }, {
        additionalProperties: false
    }))
}, { additionalProperties: false });
const skillCustomEntityTypes = [
    typebox_1.Type.Array(skillCustomTrimEntityType),
    typebox_1.Type.Array(skillCustomRegexEntityType),
    typebox_1.Type.Array(skillCustomEnumEntityType)
];
exports.domainSchemaObject = typebox_1.Type.Strict(typebox_1.Type.Object({
    name: typebox_1.Type.String({ minLength: 1, description: 'The name of the domain.' })
}));
exports.skillSchemaObject = typebox_1.Type.Strict(typebox_1.Type.Object({
    name: typebox_1.Type.String({ minLength: 1, description: 'The name of the skill.' }),
    bridge: typebox_1.Type.Union(skillBridges, { description: 'Bridge SDK.' }),
    version: typebox_1.Type.String({
        minLength: 1,
        description: 'Version following semver.'
    }),
    description: typebox_1.Type.String({
        minLength: 1,
        description: 'This helps people understand what your skill does.'
    }),
    author: typebox_1.Type.Object({
        name: typebox_1.Type.String({ minLength: 1, description: 'Name of the author.' }),
        email: typebox_1.Type.Optional(typebox_1.Type.String({
            minLength: 1,
            maxLength: 254,
            format: 'email',
            description: 'Email address of the author.'
        })),
        url: typebox_1.Type.Optional(typebox_1.Type.String({
            minLength: 1,
            maxLength: 255,
            format: 'uri',
            description: 'Website of the author.'
        }))
    }, {
        additionalProperties: false,
        description: 'A person who has been involved in creating or maintaining this skill.'
    })
}));
exports.skillConfigSchemaObject = typebox_1.Type.Strict(typebox_1.Type.Object({
    variables: typebox_1.Type.Optional(typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.String())),
    actions: typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Object({
        type: typebox_1.Type.Union(skillActionTypes),
        loop: typebox_1.Type.Optional(typebox_1.Type.Object({
            expected_item: typebox_1.Type.Object({
                type: typebox_1.Type.Union(skillDataTypes),
                name: typebox_1.Type.String()
            }, { description: 'An item can be a entity or a resolver.' })
        }, {
            additionalProperties: false,
            description: 'The action loop is a concept to keep Leon triggering the same skill action until the logic of the skill breaks the loop according to new utterances content.'
        })),
        http_api: typebox_1.Type.Optional(typebox_1.Type.Object({
            entities: typebox_1.Type.Array(typebox_1.Type.Object({
                entity: typebox_1.Type.String(),
                resolution: typebox_1.Type.Array(typebox_1.Type.String())
            }, { additionalProperties: false }))
        }, { additionalProperties: false })),
        utterance_samples: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String(), {
            description: 'Utterance samples are used by the NLU (Natural Language Understanding) to train the skill. They are examples of what Leon owners can say to trigger the skill action.'
        })),
        answers: typebox_1.Type.Optional(typebox_1.Type.Array(answerTypes)),
        unknown_answers: typebox_1.Type.Optional(typebox_1.Type.Array(answerTypes)),
        suggestions: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String(), {
            description: 'Suggestions are a simple way to suggest Leon owners what can be answered next.'
        })),
        slots: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Object({
            name: typebox_1.Type.String(),
            item: typebox_1.Type.Object({
                type: typebox_1.Type.Union(skillDataTypes),
                name: typebox_1.Type.String()
            }, { additionalProperties: false }),
            questions: typebox_1.Type.Array(typebox_1.Type.String()),
            suggestions: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String(), {
                description: 'Suggestions are a simple way to suggest Leon owners what can be answered next.'
            }))
        }, {
            additionalProperties: false,
            description: 'A slot expects a type of data called "item", and makes use of questions to let Leon owners knows what data they need to provide.'
        }), {
            description: 'Depending on how skill developers wants to design their skill, they have the possibility to ask for more information before to get to the meat of the skill. In this way, Leon can gather these information to operate the skill in a complete manner. These information are called "slots".'
        })),
        entities: typebox_1.Type.Optional(typebox_1.Type.Union(skillCustomEntityTypes)),
        next_action: typebox_1.Type.Optional(typebox_1.Type.String({
            description: 'The next action property is useful when a skill needs to follow a specific order of actions, it helps to connect actions in a specific order to feed the context with data.'
        }))
    }, { additionalProperties: false })),
    answers: typebox_1.Type.Optional(typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Array(answerTypes))),
    entities: typebox_1.Type.Optional(typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.String())),
    resolvers: typebox_1.Type.Optional(typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Object({
        intents: global_data_schemas_1.globalResolverSchemaObject.properties.intents
    }, { additionalProperties: false }), {
        description: 'You can see resolvers as utterance samples that are converted (resolved) to a value of your choice. They are very handy when skills expect specific utterances and then according to these utterances attribute a value that can be handled by the skill. If a skill action expects to receive a resolver, then Leon will convert the value for you and this value will be usable from the skill action code. Any value can be passed to resolvers which allow a large possibilities of usages.'
    }))
}));
