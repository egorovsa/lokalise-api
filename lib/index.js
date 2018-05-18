(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ts/api/languages.ts":
/*!*********************************!*\
  !*** ./src/ts/api/languages.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __webpack_require__(/*! ../services/request */ "./src/ts/services/request.ts");
var Languages = (function (_super) {
    __extends(Languages, _super);
    function Languages(token) {
        return _super.call(this, token) || this;
    }
    Languages.prototype.listSystemLanguages = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.get('language/listall')];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Languages.prototype.list = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.get('language/list', {
                            id: id
                        })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Languages.prototype.add = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('language/add', data)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Languages.prototype.setProperties = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('language/add', data)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Languages.prototype.remove = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('language/remove', data)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    return Languages;
}(request_1.Request));
exports.Languages = Languages;


/***/ }),

/***/ "./src/ts/api/projects.ts":
/*!********************************!*\
  !*** ./src/ts/api/projects.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __webpack_require__(/*! ../services/request */ "./src/ts/services/request.ts");
var extract = __webpack_require__(/*! extract-zip */ "extract-zip");
var os = __webpack_require__(/*! os */ "os");
var path = __webpack_require__(/*! path */ "path");
var http = __webpack_require__(/*! https */ "https");
var fs = __webpack_require__(/*! fs */ "fs");
var ExportEmpty;
(function (ExportEmpty) {
    ExportEmpty["empty"] = "empty";
    ExportEmpty["base"] = "base";
    ExportEmpty["skip"] = "skip";
})(ExportEmpty = exports.ExportEmpty || (exports.ExportEmpty = {}));
var ExportSort;
(function (ExportSort) {
    ExportSort["first_added"] = "first_added";
    ExportSort["last_added"] = "last_added";
    ExportSort["last_updated"] = "last_updated";
    ExportSort["a_z"] = "a_z";
    ExportSort["z_a"] = "z_a";
})(ExportSort = exports.ExportSort || (exports.ExportSort = {}));
var JavaPropertiesEncoding;
(function (JavaPropertiesEncoding) {
    JavaPropertiesEncoding["utf8"] = "utf-8";
    JavaPropertiesEncoding["latin1"] = "latin-1";
})(JavaPropertiesEncoding = exports.JavaPropertiesEncoding || (exports.JavaPropertiesEncoding = {}));
var Projects = (function (_super) {
    __extends(Projects, _super);
    function Projects(token) {
        return _super.call(this, token) || this;
    }
    Projects.prototype.list = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.get('project/list')];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.add = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('project/add', data)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('project/remove', { id: id })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.import = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data.file = fs.createReadStream(path.resolve(data.file));
                        return [4, this.post('project/import', data)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.export = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('project/export', data)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.uploadScreenShot = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('project/screenshot', data)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.createSnapshot = function (id, title) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('project/export', {
                            id: id,
                            title: title
                        })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.empty = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('project/export', {
                            id: id
                        })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Projects.prototype.exportToPath = function (filesPath, data) {
        return __awaiter(this, void 0, void 0, function () {
            var tmpDir, exportData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tmpDir = os.tmpdir();
                        return [4, this.export(data)];
                    case 1:
                        exportData = _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (exportData.response.code === '200') {
                                    var tempFilePath_1 = path.resolve(tmpDir, data.id + '.zip');
                                    var file_1 = fs.createWriteStream(tempFilePath_1);
                                    http.get(exportData.bundle.full_file, function (res) {
                                        res.pipe(file_1);
                                        res.on('end', function () {
                                            extract(tempFilePath_1, { dir: path.resolve(filesPath) }, function () {
                                                resolve(exportData);
                                            });
                                        });
                                    });
                                }
                                else {
                                    console.error('Export error: ' + exportData.response.code + ' - ' + exportData.response.message);
                                    reject(exportData.response);
                                }
                            })];
                }
            });
        });
    };
    return Projects;
}(request_1.Request));
exports.Projects = Projects;


/***/ }),

/***/ "./src/ts/api/strings.ts":
/*!*******************************!*\
  !*** ./src/ts/api/strings.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __webpack_require__(/*! ../services/request */ "./src/ts/services/request.ts");
var Strings = (function (_super) {
    __extends(Strings, _super);
    function Strings(token) {
        return _super.call(this, token) || this;
    }
    Strings.prototype.list = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('string/list/', params)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Strings.prototype.add = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('string/set', params)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Strings.prototype.remove = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.post('string/list/', params)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    return Strings;
}(request_1.Request));
exports.Strings = Strings;


/***/ }),

/***/ "./src/ts/index.ts":
/*!*************************!*\
  !*** ./src/ts/index.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var projects_1 = __webpack_require__(/*! ./api/projects */ "./src/ts/api/projects.ts");
var strings_1 = __webpack_require__(/*! ./api/strings */ "./src/ts/api/strings.ts");
var languages_1 = __webpack_require__(/*! ./api/languages */ "./src/ts/api/languages.ts");
var PluralFormat;
(function (PluralFormat) {
    PluralFormat["generic"] = "generic";
    PluralFormat["json_string"] = "json_string";
    PluralFormat["icu"] = "icu";
    PluralFormat["array"] = "array";
    PluralFormat["i18next"] = "i18next";
    PluralFormat["symfony"] = "symfony";
})(PluralFormat = exports.PluralFormat || (exports.PluralFormat = {}));
var PlaceholderFormat;
(function (PlaceholderFormat) {
    PlaceholderFormat["i18n"] = "i18n";
    PlaceholderFormat["printf"] = "printf";
    PlaceholderFormat["ios"] = "ios";
    PlaceholderFormat["icu"] = "icu";
    PlaceholderFormat["net"] = "net";
    PlaceholderFormat["symfony"] = "symfony";
})(PlaceholderFormat = exports.PlaceholderFormat || (exports.PlaceholderFormat = {}));
var FileFormat;
(function (FileFormat) {
    FileFormat["android_sdk"] = "android_sdk";
    FileFormat["ios_sdk"] = "ios_sdk";
    FileFormat["xml"] = "xml";
    FileFormat["strings"] = "strings";
    FileFormat["csv"] = "csv";
    FileFormat["xlsx"] = "xlsx";
    FileFormat["po"] = "po";
    FileFormat["properties"] = "properties";
    FileFormat["json"] = "json";
    FileFormat["xliff"] = "xliff";
    FileFormat["plist"] = "plist";
    FileFormat["resx"] = "resx";
    FileFormat["js"] = "js";
    FileFormat["react_native"] = "react_native";
    FileFormat["symfony_xliff"] = "symfony_xliff";
    FileFormat["xlf"] = "xlf";
    FileFormat["php"] = "php";
    FileFormat["ini"] = "ini";
    FileFormat["ruby_yaml"] = "ruby_yaml";
    FileFormat["yaml"] = "yaml";
    FileFormat["stf"] = "stf";
    FileFormat["ts"] = "ts";
})(FileFormat = exports.FileFormat || (exports.FileFormat = {}));
var PlatformBitMask;
(function (PlatformBitMask) {
    PlatformBitMask[PlatformBitMask["IOS"] = 1] = "IOS";
    PlatformBitMask[PlatformBitMask["Android"] = 2] = "Android";
    PlatformBitMask[PlatformBitMask["Web"] = 4] = "Web";
    PlatformBitMask[PlatformBitMask["Other"] = 16] = "Other";
})(PlatformBitMask = exports.PlatformBitMask || (exports.PlatformBitMask = {}));
var LokaliseAPI = (function () {
    function LokaliseAPI(token) {
        this.projects = new projects_1.Projects(token);
        this.languages = new languages_1.Languages(token);
        this.strings = new strings_1.Strings(token);
    }
    return LokaliseAPI;
}());
exports.LokaliseAPI = LokaliseAPI;


/***/ }),

/***/ "./src/ts/services/request.ts":
/*!************************************!*\
  !*** ./src/ts/services/request.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var superagent = __webpack_require__(/*! superagent */ "superagent");
var request = __webpack_require__(/*! request */ "request");
var LOKALISE_API_URL = 'https://api.lokalise.co/api/';
var Request = (function () {
    function Request(token) {
        this.token = token;
    }
    Request.prototype.get = function (url, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            superagent.get(LOKALISE_API_URL + url)
                .query(__assign({ api_token: _this.token }, data))
                .end(function (err, res) {
                if (!err) {
                    resolve(res.body);
                }
                else {
                    reject(res);
                }
            });
        });
    };
    Request.prototype.post = function (url, data) {
        var _this = this;
        data = this.arrayPropsToJson(data);
        return new Promise(function (resolve, reject) {
            request.post({
                url: LOKALISE_API_URL + url,
                formData: __assign({ api_token: _this.token }, data)
            }, function (err, res, body) {
                if (!err) {
                    resolve(JSON.parse(body));
                }
                else {
                    reject(res);
                }
            });
        });
    };
    Request.prototype.arrayPropsToJson = function (data) {
        for (var key in data) {
            if (key === 'langs' ||
                key === 'filter' ||
                key === 'include_pids' ||
                key === 'include_tags' ||
                key === 'exclude_tags' ||
                key === 'tags' ||
                key === 'key_ids' ||
                key === 'iso' ||
                key === 'keys' ||
                key === 'data') {
                data[key] = JSON.stringify(data[key]);
            }
        }
        return data;
    };
    return Request;
}());
exports.Request = Request;


/***/ }),

/***/ "extract-zip":
/*!******************************!*\
  !*** external "extract-zip" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("extract-zip");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "request":
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),

/***/ "superagent":
/*!*****************************!*\
  !*** external "superagent" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("superagent");

/***/ })

/******/ })));
//# sourceMappingURL=index.js.map