"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VOICE_CONFIG_PATH = exports.MODELS_PATH = exports.GLOBAL_DATA_PATH = exports.SKILLS_PATH = exports.BIN_PATH = exports.IS_TELEMETRY_ENABLED = exports.TCP_SERVER_PORT = exports.TCP_SERVER_HOST = exports.HTTP_API_LANG = exports.HTTP_API_KEY = exports.HAS_OVER_HTTP = exports.TTS_PROVIDER = exports.HAS_TTS = exports.STT_PROVIDER = exports.HAS_STT = exports.HAS_AFTER_SPEECH = exports.TIME_ZONE = exports.PORT = exports.HOST = exports.LANG = exports.IS_TESTING_ENV = exports.IS_DEVELOPMENT_ENV = exports.IS_PRODUCTION_ENV = exports.LEON_NODE_ENV = exports.FR_SPACY_MODEL_VERSION = exports.FR_SPACY_MODEL_NAME = exports.EN_SPACY_MODEL_VERSION = exports.EN_SPACY_MODEL_NAME = exports.LEON_VERSION = exports.NODEJS_BRIDGE_BIN_PATH = exports.PYTHON_BRIDGE_BIN_PATH = exports.TCP_SERVER_BIN_PATH = exports.TCP_SERVER_BIN_NAME = exports.PYTHON_BRIDGE_BIN_NAME = exports.NODEJS_BRIDGE_BIN_NAME = exports.TCP_SERVER_VERSION = exports.PYTHON_BRIDGE_VERSION = exports.NODEJS_BRIDGE_VERSION = exports.TCP_SERVER_SRC_PATH = exports.PYTHON_BRIDGE_SRC_PATH = exports.NODEJS_BRIDGE_SRC_PATH = exports.TCP_SERVER_DIST_PATH = exports.PYTHON_BRIDGE_DIST_PATH = exports.NODEJS_BRIDGE_DIST_PATH = exports.TCP_SERVER_ROOT_PATH = exports.PYTHON_BRIDGE_ROOT_PATH = exports.NODEJS_BRIDGE_ROOT_PATH = exports.BRIDGES_PATH = exports.BINARIES_FOLDER_NAME = exports.GITHUB_URL = void 0;
exports.IS_GITPOD = exports.INSTANCE_ID = exports.MINIMUM_REQUIRED_RAM = exports.LEON_FILE_PATH = exports.TMP_PATH = exports.SERVER_PATH = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const system_helper_1 = require("./helpers/system-helper");
dotenv_1.default.config();
const PRODUCTION_ENV = 'production';
const DEVELOPMENT_ENV = 'development';
const TESTING_ENV = 'testing';
exports.GITHUB_URL = 'https://github.com/leon-ai/leon';
/**
 * Binaries / distribution
 */
exports.BINARIES_FOLDER_NAME = system_helper_1.SystemHelper.getBinariesFolderName();
exports.BRIDGES_PATH = node_path_1.default.join(process.cwd(), 'bridges');
exports.NODEJS_BRIDGE_ROOT_PATH = node_path_1.default.join(exports.BRIDGES_PATH, 'nodejs');
exports.PYTHON_BRIDGE_ROOT_PATH = node_path_1.default.join(exports.BRIDGES_PATH, 'python');
exports.TCP_SERVER_ROOT_PATH = node_path_1.default.join(process.cwd(), 'tcp_server');
exports.NODEJS_BRIDGE_DIST_PATH = node_path_1.default.join(exports.NODEJS_BRIDGE_ROOT_PATH, 'dist');
exports.PYTHON_BRIDGE_DIST_PATH = node_path_1.default.join(exports.PYTHON_BRIDGE_ROOT_PATH, 'dist');
exports.TCP_SERVER_DIST_PATH = node_path_1.default.join(exports.TCP_SERVER_ROOT_PATH, 'dist');
exports.NODEJS_BRIDGE_SRC_PATH = node_path_1.default.join(exports.NODEJS_BRIDGE_ROOT_PATH, 'src');
exports.PYTHON_BRIDGE_SRC_PATH = node_path_1.default.join(exports.PYTHON_BRIDGE_ROOT_PATH, 'src');
exports.TCP_SERVER_SRC_PATH = node_path_1.default.join(exports.TCP_SERVER_ROOT_PATH, 'src');
const NODEJS_BRIDGE_VERSION_FILE_PATH = node_path_1.default.join(exports.NODEJS_BRIDGE_SRC_PATH, 'version.ts');
const PYTHON_BRIDGE_VERSION_FILE_PATH = node_path_1.default.join(exports.PYTHON_BRIDGE_SRC_PATH, 'version.py');
const TCP_SERVER_VERSION_FILE_PATH = node_path_1.default.join(exports.TCP_SERVER_SRC_PATH, 'version.py');
_a = node_fs_1.default
    .readFileSync(NODEJS_BRIDGE_VERSION_FILE_PATH, 'utf8')
    .split("'"), exports.NODEJS_BRIDGE_VERSION = _a[1];
_b = node_fs_1.default
    .readFileSync(PYTHON_BRIDGE_VERSION_FILE_PATH, 'utf8')
    .split("'"), exports.PYTHON_BRIDGE_VERSION = _b[1];
_c = node_fs_1.default
    .readFileSync(TCP_SERVER_VERSION_FILE_PATH, 'utf8')
    .split("'"), exports.TCP_SERVER_VERSION = _c[1];
exports.NODEJS_BRIDGE_BIN_NAME = 'leon-nodejs-bridge.js';
exports.PYTHON_BRIDGE_BIN_NAME = 'leon-python-bridge';
exports.TCP_SERVER_BIN_NAME = 'leon-tcp-server';
exports.TCP_SERVER_BIN_PATH = node_path_1.default.join(exports.TCP_SERVER_DIST_PATH, exports.BINARIES_FOLDER_NAME, exports.TCP_SERVER_BIN_NAME);
exports.PYTHON_BRIDGE_BIN_PATH = node_path_1.default.join(exports.PYTHON_BRIDGE_DIST_PATH, exports.BINARIES_FOLDER_NAME, exports.PYTHON_BRIDGE_BIN_NAME);
exports.NODEJS_BRIDGE_BIN_PATH = `${node_path_1.default.join(process.cwd(), 'node_modules', 'tsx', 'dist', 'cli.mjs')} ${node_path_1.default.join(exports.NODEJS_BRIDGE_DIST_PATH, 'bin', exports.NODEJS_BRIDGE_BIN_NAME)}`;
exports.LEON_VERSION = process.env['npm_package_version'];
/**
 * spaCy models
 * Find new spaCy models: https://github.com/explosion/spacy-models/releases
 */
exports.EN_SPACY_MODEL_NAME = 'en_core_web_trf';
exports.EN_SPACY_MODEL_VERSION = '3.4.0';
exports.FR_SPACY_MODEL_NAME = 'fr_core_news_md';
exports.FR_SPACY_MODEL_VERSION = '3.4.0';
/**
 * Environments
 */
exports.LEON_NODE_ENV = process.env['LEON_NODE_ENV'] || PRODUCTION_ENV;
exports.IS_PRODUCTION_ENV = exports.LEON_NODE_ENV === PRODUCTION_ENV;
exports.IS_DEVELOPMENT_ENV = exports.LEON_NODE_ENV === DEVELOPMENT_ENV;
exports.IS_TESTING_ENV = exports.LEON_NODE_ENV === TESTING_ENV;
/**
 * Leon environment preferences
 */
exports.LANG = process.env['LEON_LANG'];
exports.HOST = process.env['LEON_HOST'];
exports.PORT = Number(process.env['LEON_PORT']);
exports.TIME_ZONE = process.env['LEON_TIME_ZONE'];
exports.HAS_AFTER_SPEECH = process.env['LEON_AFTER_SPEECH'] === 'true';
exports.HAS_STT = process.env['LEON_STT'] === 'true';
exports.STT_PROVIDER = process.env['LEON_STT_PROVIDER'];
exports.HAS_TTS = process.env['LEON_TTS'] === 'true';
exports.TTS_PROVIDER = process.env['LEON_TTS_PROVIDER'];
exports.HAS_OVER_HTTP = process.env['LEON_OVER_HTTP'] === 'true';
exports.HTTP_API_KEY = process.env['LEON_HTTP_API_KEY'];
exports.HTTP_API_LANG = process.env['LEON_HTTP_API_LANG'];
exports.TCP_SERVER_HOST = process.env['LEON_PY_TCP_SERVER_HOST'];
exports.TCP_SERVER_PORT = Number(process.env['LEON_PY_TCP_SERVER_PORT']);
exports.IS_TELEMETRY_ENABLED = process.env['LEON_TELEMETRY'] === 'true';
/**
 * Paths
 */
exports.BIN_PATH = node_path_1.default.join(process.cwd(), 'bin');
exports.SKILLS_PATH = node_path_1.default.join(process.cwd(), 'skills');
exports.GLOBAL_DATA_PATH = node_path_1.default.join(process.cwd(), 'core', 'data');
exports.MODELS_PATH = node_path_1.default.join(exports.GLOBAL_DATA_PATH, 'models');
exports.VOICE_CONFIG_PATH = node_path_1.default.join(process.cwd(), 'core', 'config', 'voice');
exports.SERVER_PATH = node_path_1.default.join(process.cwd(), 'server', exports.IS_PRODUCTION_ENV ? 'dist' : 'src');
exports.TMP_PATH = node_path_1.default.join(exports.SERVER_PATH, 'tmp');
exports.LEON_FILE_PATH = node_path_1.default.join(process.cwd(), 'leon.json');
/**
 * Misc
 */
exports.MINIMUM_REQUIRED_RAM = 4;
exports.INSTANCE_ID = node_fs_1.default.existsSync(exports.LEON_FILE_PATH)
    ? JSON.parse(node_fs_1.default.readFileSync(exports.LEON_FILE_PATH, 'utf8')).instanceID
    : null;
exports.IS_GITPOD = process.env['GITPOD_WORKSPACE_URL'] !== undefined;
