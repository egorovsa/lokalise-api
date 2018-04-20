import { Projects } from "./api/projects";
import { Strings } from "./api/strings";
import { Languages } from "./api/languages";
export declare enum PluralFormat {
    generic = "generic",
    json_string = "json_string",
    icu = "icu",
    array = "array",
    i18next = "i18next",
    symfony = "symfony",
}
export declare enum PlaceholderFormat {
    i18n = "i18n",
    printf = "printf",
    ios = "ios",
    icu = "icu",
    net = "net",
    symfony = "symfony",
}
export declare enum FileFormat {
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
export declare enum PlatformBitMask {
    IOS = 1,
    Android = 2,
    Web = 4,
    Other = 16,
}
export declare class LokaliseAPI {
    projects: Projects;
    strings: Strings;
    languages: Languages;
    constructor(token: string);
}
