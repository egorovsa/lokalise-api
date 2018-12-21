import { Languages } from './api/languages';
import { Projects } from './api/projects';
import { Strings } from './api/strings';
export declare const enum PluralFormat {
    generic = "generic",
    json_string = "json_string",
    icu = "icu",
    array = "array",
    i18next = "i18next",
    symfony = "symfony",
}
export declare const enum PlaceholderFormat {
    i18n = "i18n",
    printf = "printf",
    ios = "ios",
    icu = "icu",
    net = "net",
    symfony = "symfony",
}
export declare const enum FileFormat {
    android_sdk = "android_sdk",
    ios_sdk = "ios_sdk",
    xml = "xml",
    strings = "strings",
    csv = "csv",
    xlsx = "xlsx",
    po = "po",
    properties = "properties",
    json = "json",
    xliff = "xliff",
    plist = "plist",
    resx = "resx",
    js = "js",
    react_native = "react_native",
    symfony_xliff = "symfony_xliff",
    xlf = "xlf",
    php = "php",
    ini = "ini",
    ruby_yaml = "ruby_yaml",
    yaml = "yaml",
    stf = "stf",
    ts = "ts",
}
export declare const enum PlatformBitMask {
    IOS = 1,
    Android = 2,
    Web = 4,
    Other = 16,
}
export declare class LokaliseAPI {
    languages: Languages;
    projects: Projects;
    strings: Strings;
    constructor(token: string);
}
