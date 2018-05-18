import { DefaultResponse, LokaliseResponse, Request } from '../services/request';
import { FileFormat, PlaceholderFormat, PluralFormat } from '../index';
import * as Stream from 'stream';

const extract = require('extract-zip');
const os = require('os');
const path = require('path');
const http = require('https');
const fs = require('fs');

export enum ExportEmpty {
    empty = 'empty',
    base = 'base',
    skip = 'skip'
}

export enum ExportSort {
    first_added = 'first_added',
    last_added = 'last_added',
    last_updated = 'last_updated',
    a_z = 'a_z',
    z_a = 'z_a'
}

export enum JavaPropertiesEncoding {
    utf8 = 'utf-8',
    latin1 = 'latin-1'
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
        id: number
    };
    response: LokaliseResponse;
}

export interface ExportProjectParams {
    id: number;
    type: FileFormat;
    langs?: string[];
    use_original?: 0 | 1;
    filter?: string[];
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
    java_properties_separator?: '=' | ':';
    no_language_folders?: 0 | 1;
    triggers?: string[];
    plural_format?: PluralFormat;
    icu_numeric?: 0 | 1;
    placeholder_format?: PlaceholderFormat;
}

export interface ExportResponse {
    bundle: {
        file: string,
        full_file: string
    };
    response: LokaliseResponse;
}

export interface ImportData {
    id: string;
    file: FileFormat;
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

export class Projects extends Request {
    constructor(token: string) {
        super(token);
    }

    public async list(): Promise<ProjectsList> {
        return await this.get<ProjectsList, Object>('project/list');
    }

    public async add(data: AddProjectParams): Promise<AddProjectResponse> {
        return await this.post<AddProjectResponse, AddProjectParams>('project/add', data);
    }

    public async remove(id: string): Promise<DefaultResponse> {
        return await this.post<DefaultResponse, Object>('project/remove', {id: id});
    }

    public async import(data: ImportData): Promise<ProjectImportResponse> {
        data.file = fs.createReadStream(path.resolve(data.file));

        return await this.post<ProjectImportResponse, ImportData>('project/import', data);
    }

    public async export(data: ExportProjectParams): Promise<ExportResponse> {
        return await this.post<ExportResponse, ExportProjectParams>('project/export', data);
    }

    public async uploadScreenShot(data: UploadScreenshot): Promise<DefaultResponse> {
        return await this.post<DefaultResponse, UploadScreenshot>('project/screenshot', data);
    }

    public async createSnapshot(id: string, title: string): Promise<DefaultResponse> {
        return await this.post<DefaultResponse, Object>('project/export', {
            id: id,
            title: title
        });
    }

    public async empty(id: string): Promise<DefaultResponse> {
        return await this.post<DefaultResponse, Object>('project/export', {
            id: id
        });
    }

    public async exportToPath(filesPath: string, data: ExportProjectParams): Promise<ExportResponse> {
        let tmpDir = os.tmpdir();
        let exportData: ExportResponse = await this.export(data);

        return new Promise<ExportResponse>(
            (resolve: (data: ExportResponse) => void,
             reject: (data: LokaliseResponse) => void
            ) => {
                if (exportData.response.code === '200') {
                    const tempFilePath = path.resolve(tmpDir, data.id + '.zip');
                    const file = fs.createWriteStream(tempFilePath);

                    http.get(exportData.bundle.full_file, (res: Stream) => {
                        res.pipe(file);

                        res.on('end', () => {
                            extract(tempFilePath, {dir: path.resolve(filesPath)}, () => {
                                resolve(exportData);
                            });
                        });
                    });
                } else {
                    console.error('Export error: ' + exportData.response.code + ' - ' + exportData.response.message);
                    reject(exportData.response);
                }
            });
    }
}