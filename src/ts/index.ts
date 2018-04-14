import {Projects} from "./api/projects";
import {Strings} from "./api/strings";
import {Languages} from "./api/languages";

export enum PluralFormat {
	generic = "generic",
	json_string = "json_string",
	icu = "icu",
	array = "array",
	i18next = "i18next",
	symfony = "symfony",
}

export enum PlaceholderFormat {
	printf = "printf",
	ios = "ios",
	icu = "icu",
	net = "net",
	symfony = "symfony"
}

export enum FileFormat {
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
	ts = "ts"
}

export enum PlatformBitMask {
	IOS = 1,
	Android = 2,
	Web = 4,
	Other = 16
}

export class LokaliseAPI {
	public projects: Projects;
	public strings: Strings;
	public languages: Languages;

	constructor(token: string) {
		this.projects = new Projects(token);
		this.languages = new Languages(token);
		this.strings = new Strings(token);
	}
}
