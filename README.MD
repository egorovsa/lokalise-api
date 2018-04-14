# lokalise
lokalise.co API client service

## How to install

```
$ npm i lokalise-api

or

$ yarn add lokalise-api
```

### To find out more about API params look at the Lokasize API documentation

https://lokalise.co/apidocs

## How to use

```
    const lokalise = new LokaliseAPI.LokaliseAPI(CONFIG.TEST_TOKEN);

    lokalise.projects.add({
    	name: 'Test project',
    	description: 'Test project description',
    	base_lang: 'en'
    }).then((data) => {

    	if (data.response.code === '200') {
    		lokalise.projects.import({
    			id: data.project.id,
    			file: __dirname + "/test-en.json",
    			lang_iso: 'en',
    			replace: 1
    		}).then((data1) => {

    			console.log(data1);

    			lokalise.projects.remove(data.project.id).then((data2) => {
    				console.log(data2);
    			});
    		});
    	}
    });
```

### LokaliseAPI methods

#### Projects methods

 ```
     const lokalise = new LokaliseAPI.LokaliseAPI(CONFIG.TEST_TOKEN);

     lokalise.projects.list(): Promise<ProjectsList>

     lokalise.projects.add(data: AddProjectParams): Promise<AddProjectResponse>

     lokalise.projects.remove(id: string): Promise<DefaultResponse>

     lokalise.projects.import(data: ImportData): Promise<ProjectImportResponse>

     lokalise.projects.export(data: ExportProjectParams): Promise<ExportResponse>

     lokalise.projects.uploadScreenShot(data: UploadScreenshot): Promise<DefaultResponse> {

     lokalise.projects.createSnapshot(id: string, title: string): Promise<DefaultResponse>

     lokalise.projects.empty(id: string): Promise<DefaultResponse>

     lokalise.projects.exportToPath(filesPath: string, data: ExportProjectParams): Promise<ExportResponse>
 ```

#### Languages methods

 ```
    const lokalise = new LokaliseAPI.LokaliseAPI(CONFIG.TEST_TOKEN);

    lokalise.languages.list(id: string): Promise<ProjectLanguagesList>

    lokalise.languages.add(data: AddRemoveLanguagesParams): Promise<DefaultResponse>

    lokalise.languages.setProperties(data: SetLanguagesParams): Promise<DefaultResponse>

    lokalise.languages.remove(data: AddRemoveLanguagesParams): Promise<DefaultResponse>

 ```

#### Strings methods

  ```
    const lokalise = new LokaliseAPI.LokaliseAPI(CONFIG.TEST_TOKEN);

    lokalise.strings.list(params: StringsListParams): Promise<StringsList>

    lokalise.strings.add(params: AddKeysParams): Promise<AddKeysResponse>

    lokalise.strings.remove(params: RemoveKeysParams): Promise<DefaultResponse>
  ```

#### Lokalise enum's you might use

```
    LokaliseAPI.PluralFormat = {
        generic = "generic",
        json_string = "json_string",
        icu = "icu",
        array = "array",
        i18next = "i18next",
        symfony = "symfony",
    }

    LokaliseAPI.PlaceholderFormat = {
        printf = "printf",
        ios = "ios",
        icu = "icu",
        net = "net",
        symfony = "symfony"
    }

    LokaliseAPI.FileFormat = {
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

    LokaliseAPI.PlatformBitMask = {
        IOS = 1,
        Android = 2,
        Web = 4,
        Other = 16
    }

```


#### Project's interfaces

```
    export enum ExportEmpty {
        empty = "empty",
        base = "base",
        skip = "skip"
    }

    export enum ExportSort {
        first_added = "first_added",
        last_added = "last_added",
        last_updated = "last_updated",
        a_z = "a_z",
        z_a = "z_a"
    }

    export enum JavaPropertiesEncoding {
        utf8 = "utf-8",
        latin1 = "latin-1"
    }

    export interface ProjectsListObject {
        id: string
        name: string
        desc: string
        created: string,
        owner: string
    }

    export interface ProjectsList {
        projects: ProjectsListObject[],
        response: LokaliseResponse
    }

    export interface AddProjectParams {
        name: string,
        description?: string,
        base_lang?: string
    }

    export interface AddProjectResponse {
        project: {
            id: number
        },
        response: LokaliseResponse
    }

    export interface ExportProjectParams {
        id: number
        type: FileFormat
        langs?: string[]
        use_original?: 0 | 1
        filter?: any
        bundle_structure?: string
        directory_prefix?: string
        webhook_url?: string
        export_all?: 0 | 1
        export_empty?: ExportEmpty
        include_comments?: 0 | 1
        include_pids?: string[]
        include_tags?: string[]
        export_sort?: ExportSort
        replace_breaks?: 0 | 1
        yaml_include_root?: 0 | 1
        json_unescaped_slashes?: 0 | 1
        java_properties_encoding?: JavaPropertiesEncoding
        java_properties_separator?: "=" | ":"
        no_language_folders?: 0 | 1
        triggers?: any
        plural_format?: PluralFormat
        icu_numeric?: 0 | 1
        placeholder_format?: PlaceholderFormat
    }

    export interface ExportResponse {
        bundle: {
            file: string,
            full_file: string
        },
        response: LokaliseResponse
    }

    export interface ImportData {
        id: string
        file: any
        lang_iso: string
        replace?: 0 | 1
        convert_placeholders?: 0 | 1
        icu_plurals?: 0 | 1
        fill_empty?: 0 | 1
        distinguish?: 0 | 1
        use_trans_mem?: 0 | 1
        hidden?: 0 | 1
        tags?: string[]
        filename?: string
        replace_breaks?: 0 | 1
    }

    export interface ProjectImportResponse {
        result: {
            skipped: number,
            inserted: number,
            updated: number
        },
        response: LokaliseResponse
    }

    export interface UploadScreenshot {
        id: string,
        screenshot: string,
        autotag: 0 | 1,
        key_ids: string[]
    }
```

#### Language's interfaces

```
    export interface Language {
        iso: string
        name: string
        rtl: string
    }

    export interface ProjectLanguage extends Language {
        words: string,
        is_default: string
    }

    export interface SystemLanguagesResponse {
        languages: Language[],
        response: DefaultResponse
    }

    export interface ProjectLanguagesList {
        languages: ProjectLanguage[],
        response: DefaultResponse
    }

    export interface AddRemoveLanguagesParams {
        id: string,
        iso: string[]
    }

    export interface SetLanguagesParams {
        id: string
        original_iso: string
        custom_iso?: string
        custom_name?: string
    }
```

#### String's interfaces

```
    export interface LocaleKey {
    	key: string
    	platform_mask: PlatformBitMask
    	context: string
    	translation: string
    	plural_key: string
    	is_hidden: string
    	created_at: string
    	tags?: string[]
    	modified_at: string
    	fuzzy: string
    	is_archived: string
    }

    export interface LocaleKeyAppend extends LocaleKey {
    	filename_web: string,
    	hidden: number,
    	translations: { [locale: string]: string },
    	plural: string
    }

    export interface StringsList {
    	strings: { [lang: string]: LocaleKey[] }
    	response: LokaliseResponse
    }

    export interface StringsListParams {
    	id: string
    	langs?: object[]
    	platform_mask?: PlatformBitMask
    	keys?: object[]
    	tags?: object[]
    	plural_format?: PluralFormat
    	icu_numeric?: boolean
    	placeholder_format?: PlaceholderFormat
    }

    export interface AddKeysParams {
    	id: number,
    	data: LocaleKeyAppend[]
    }

    export interface AddKeysResponse {
    	result: {
    		inserted: string,
    		updated: string
    	},
    	response: LokaliseResponse
    }

    export interface RemoveKeysParams {
    	id: number,
    	keys: string[]
    }
```