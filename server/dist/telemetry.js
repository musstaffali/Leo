"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Telemetry = void 0;
const node_os_1 = __importDefault(require("node:os"));
const axios_1 = __importDefault(require("axios"));
const os_name_1 = __importDefault(require("os-name"));
const getos_1 = __importDefault(require("getos"));
const constants_1 = require("./constants");
const system_helper_1 = require("./helpers/system-helper");
const skill_domain_helper_1 = require("./helpers/skill-domain-helper");
const log_helper_1 = require("./helpers/log-helper");
var EventNames;
(function (EventNames) {
    EventNames["Heartbeat"] = "HEARTBEAT";
    EventNames["Stopped"] = "STOPPED";
})(EventNames || (EventNames = {}));
class Telemetry {
    static async postInstall() {
        try {
            const { data } = await this.axios.post('/on-post-install', {
                instanceID: this.instanceID,
                isGitpod: constants_1.IS_GITPOD
            });
            return data;
        }
        catch (e) {
            return {};
        }
    }
    static async start() {
        if (constants_1.IS_TELEMETRY_ENABLED) {
            try {
                const platform = node_os_1.default.platform();
                const data = {
                    isProduction: constants_1.IS_PRODUCTION_ENV,
                    isGitpod: constants_1.IS_GITPOD,
                    language: constants_1.LANG,
                    sttProvider: constants_1.STT_PROVIDER,
                    ttsProvider: constants_1.TTS_PROVIDER,
                    coreVersion: constants_1.LEON_VERSION,
                    nodeJSBridgeVersion: constants_1.NODEJS_BRIDGE_VERSION,
                    pythonBridgeVersion: constants_1.PYTHON_BRIDGE_VERSION,
                    tcpServerVersion: constants_1.TCP_SERVER_VERSION,
                    environment: {
                        osDetails: {
                            type: node_os_1.default.type(),
                            platform,
                            arch: node_os_1.default.arch(),
                            cpus: node_os_1.default.cpus().length,
                            release: node_os_1.default.release(),
                            osName: (0, os_name_1.default)(),
                            distro: null
                        },
                        totalRAMInGB: system_helper_1.SystemHelper.getTotalRAM(),
                        freeRAMInGB: system_helper_1.SystemHelper.getFreeRAM(),
                        nodeVersion: system_helper_1.SystemHelper.getNodeJSVersion(),
                        npmVersion: system_helper_1.SystemHelper.getNPMVersion()
                    }
                };
                if (platform === 'linux') {
                    (0, getos_1.default)(async (e, os) => {
                        if (e) {
                            /* */
                        }
                        data.environment.osDetails.distro = os;
                        try {
                            await this.axios.post('/on-start', {
                                instanceID: this.instanceID,
                                data
                            });
                        }
                        catch (e) {
                            if (constants_1.IS_DEVELOPMENT_ENV) {
                                log_helper_1.LogHelper.title('Telemetry');
                                log_helper_1.LogHelper.warning(`Failed to send start data to telemetry service: ${e}`);
                            }
                        }
                    });
                }
                else {
                    await this.axios.post('/on-start', {
                        instanceID: this.instanceID,
                        data
                    });
                }
            }
            catch (e) {
                if (constants_1.IS_DEVELOPMENT_ENV) {
                    log_helper_1.LogHelper.title('Telemetry');
                    log_helper_1.LogHelper.warning(`Failed to send start data to telemetry service: ${e}`);
                }
            }
        }
    }
    static async utterance(processedData) {
        if (constants_1.IS_TELEMETRY_ENABLED) {
            try {
                if (processedData?.classification) {
                    const { classification: { domain: triggeredDomain, skill: triggeredSkill, action: triggeredAction, confidence: probability }, utterance, entities } = processedData;
                    const skill = await skill_domain_helper_1.SkillDomainHelper.getSkillInfo(triggeredDomain, triggeredSkill);
                    await this.axios.post('/on-utterance', {
                        instanceID: this.instanceID,
                        data: {
                            triggeredDomain: triggeredDomain || null,
                            triggeredSkill: triggeredSkill || null,
                            triggeredAction: triggeredAction || null,
                            probability,
                            language: processedData?.lang || null,
                            processingTime: processedData?.processingTime || 0,
                            executionTime: processedData?.executionTime || 0,
                            nluProcessingTime: processedData?.nluProcessingTime || 0,
                            value: this.anonymizeEntities(utterance, entities) || utterance,
                            triggeredSkillVersion: skill.version || null,
                            triggeredSkillBridge: skill.bridge || null
                        }
                    });
                }
                else if (JSON.stringify(processedData) !== JSON.stringify({})) {
                    // Not in a skill loop
                    await this.axios.post('/on-utterance', {
                        instanceID: this.instanceID,
                        data: {
                            language: processedData?.lang || null,
                            value: processedData?.utterance
                        }
                    });
                }
            }
            catch (e) {
                if (constants_1.IS_DEVELOPMENT_ENV) {
                    log_helper_1.LogHelper.title('Telemetry');
                    log_helper_1.LogHelper.warning(`Failed to send utterance data to telemetry service: ${e}`);
                }
            }
        }
    }
    static async error(error) {
        if (constants_1.IS_TELEMETRY_ENABLED) {
            try {
                await this.axios.post('/on-error', {
                    instanceID: this.instanceID,
                    error: system_helper_1.SystemHelper.sanitizeUsername(error)
                });
            }
            catch (e) {
                if (constants_1.IS_DEVELOPMENT_ENV) {
                    log_helper_1.LogHelper.title('Telemetry');
                    log_helper_1.LogHelper.warning(`Failed to send error to telemetry service: ${e}`);
                }
            }
        }
    }
    static async stop() {
        if (constants_1.IS_TELEMETRY_ENABLED) {
            try {
                await this.sendEvent(EventNames.Stopped);
            }
            catch (e) {
                if (constants_1.IS_DEVELOPMENT_ENV) {
                    log_helper_1.LogHelper.title('Telemetry');
                    log_helper_1.LogHelper.warning(`Failed to send stop event to telemetry service: ${e}`);
                }
            }
        }
    }
    static async heartbeat() {
        if (constants_1.IS_TELEMETRY_ENABLED) {
            try {
                await this.sendEvent(EventNames.Heartbeat);
            }
            catch (e) {
                if (constants_1.IS_DEVELOPMENT_ENV) {
                    log_helper_1.LogHelper.title('Telemetry');
                    log_helper_1.LogHelper.warning(`Failed to send heartbeat event to telemetry service: ${e}`);
                }
            }
        }
    }
    static async sendEvent(eventName) {
        if (constants_1.IS_TELEMETRY_ENABLED) {
            try {
                await this.axios.post('/on-event', {
                    instanceID: this.instanceID,
                    eventName
                });
            }
            catch (e) {
                if (constants_1.IS_DEVELOPMENT_ENV) {
                    log_helper_1.LogHelper.title('Telemetry');
                    log_helper_1.LogHelper.warning(`Failed to send event to telemetry service: ${e}`);
                }
            }
        }
    }
    static anonymizeEntities(utterance, entities) {
        entities.forEach((entity) => {
            utterance = utterance.replace(entity.sourceText, `{${entity.entity}}`);
        });
        return utterance;
    }
}
exports.Telemetry = Telemetry;
_a = Telemetry;
Telemetry.serviceURL = 'https://telemetry.getleon.ai';
// private static readonly serviceURL = 'http://localhost:3000'
Telemetry.instanceID = constants_1.INSTANCE_ID;
Telemetry.axios = axios_1.default.create({
    baseURL: _a.serviceURL,
    timeout: 7000
});
