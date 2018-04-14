import { DefaultResponse, LokaliseResponse, Request } from "../services/request";
import { FileFormat, PlaceholderFormat, PluralFormat } from "../index";
export declare enum ExportEmpty {
    empty = "empty",
    base = "base",
    skip = "skip",
}
export declare enum ExportSort {
    first_added = "first_added",
    last_added = "last_added",
    last_updated = "last_updated",
    a_z = "a_z",
    z_a = "z_a",
}
export declare enum JavaPropertiesEncoding {
    utf8 = "utf-8",
    latin1 = "latin-1",
}
export interface ProjectsListObject {
    id: string;
    name: string;
    desc: string;
    created: string;
    owner: string;
}
export interface ProjectsList {
    projects: ProjectsListObject[];
    response: LokaliseResponse;
}
export interface AddProjectParams {
    name: string;
    description?: string;
    base_lang?: string;
}
export interface AddProjectResponse {
    project: {
        id: number;
    };
    response: LokaliseResponse;
}
export interface ExportProjectParams {
    id: number;
    type: FileFormat;
    langs?: string[];
    use_original?: 0 | 1;
    filter?: any;
    bundle_structure?: string;
    directory_prefix?: string;
    webhook_url?: string;
    export_all?: 0 | 1;
    export_empty?: ExportEmpty;
    include_comments?: 0 | 1;
    include_pids?: string[];
    include_tags?: string[];
    export_sort?: ExportSort;
    replace_breaks?: 0 | 1;
    yaml_include_root?: 0 | 1;
    json_unescaped_slashes?: 0 | 1;
    java_properties_encoding?: JavaPropertiesEncoding;
    java_properties_separator?: "=" | ":";
    no_language_folders?: 0 | 1;
    triggers?: any;
    plural_format?: PluralFormat;
    icu_numeric?: 0 | 1;
    placeholder_format?: PlaceholderFormat;
}
export interface ExportResponse {
    bundle: {
        file: string;
        full_file: string;
    };
    response: LokaliseResponse;
}
export interface ImportData {
    id: string;
    file: any;
    lang_iso: string;
    replace?: 0 | 1;
    convert_placeholders?: 0 | 1;
    icu_plurals?: 0 | 1;
    fill_empty?: 0 | 1;
    distinguish?: 0 | 1;
    use_trans_mem?: 0 | 1;
    hidden?: 0 | 1;
    tags?: string[];
    filename?: string;
    replace_breaks?: 0 | 1;
}
export interface ProjectImportResponse {
    result: {
        skipped: number;
        inserted: number;
        updated: number;
    };
    response: LokaliseResponse;
}
export interface UploadScreenshot {
    id: string;
    screenshot: string;
    autotag: 0 | 1;
    key_ids: string[];
}
export declare class Projects extends Request {
    constructor(token: string);
    list(): Promise<ProjectsList>;
    add(data: AddProjectParams): Promise<AddProjectResponse>;
    remove(id: string): Promise<DefaultResponse>;
    import(data: ImportData): Promise<ProjectImportResponse>;
    export(data: ExportProjectParams): Promise<ExportResponse>;
    uploadScreenShot(data: UploadScreenshot): Promise<DefaultResponse>;
    createSnapshot(id: string, title: string): Promise<DefaultResponse>;
    empty(id: string): Promise<DefaultResponse>;
    exportToPath(filesPath: string, data: ExportProjectParams): Promise<ExportResponse>;
}
