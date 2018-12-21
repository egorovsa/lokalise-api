import * as Stream from 'stream';
import { DefaultResponse, LokaliseResponse, Request } from '../services/request';
import { FileFormat, PlaceholderFormat, PluralFormat } from '..';

const extract = require('extract-zip');
const os = require('os');
const path = require('path');
const http = require('https');
const fs = require('fs');

export const enum ExportEmpty {
    empty = 'empty',
    base = 'base',
    skip = 'skip'
}

export const enum ExportSort {
    first_added = 'first_added',
    last_added = 'last_added',
    last_updated = 'last_updated',
    a_z = 'a_z',
    z_a = 'z_a'
}

export const enum JavaPropertiesEncoding {
    utf8 = 'utf-8',
    latin1 = 'latin-1'
}

export interface ProjectsListObject {
    created: string;
    desc: string;
    id: string;
    name: string;
    owner: string;
}

export interface ProjectsList {
    projects: ProjectsListObject[];
    response: LokaliseResponse;
}

export interface AddProjectParams {
    base_lang?: string;
    description?: string;
    name: string;
}

export interface AddProjectResponse {
    project: {
        id: number
    };
    response: LokaliseResponse;
}

export interface ExportProjectParams {
    bundle_structure?: string;
    directory_prefix?: string;
    export_all?: 0 | 1;
    export_empty?: ExportEmpty;
    export_sort?: ExportSort;
    filter?: string[];
    icu_numeric?: 0 | 1;
    id: number;
    include_comments?: 0 | 1;
    include_pids?: string[];
    include_tags?: string[];
    java_properties_encoding?: JavaPropertiesEncoding;
    java_properties_separator?: '=' | ':';
    json_unescaped_slashes?: 0 | 1;
    langs?: string[];
    no_language_folders?: 0 | 1;
    placeholder_format?: PlaceholderFormat;
    plural_format?: PluralFormat;
    replace_breaks?: 0 | 1;
    triggers?: string[];
    type: FileFormat;
    use_original?: 0 | 1;
    webhook_url?: string;
    yaml_include_root?: 0 | 1;
}

export interface ExportResponse {
    bundle: {
        file: string,
        full_file: string
    };
    response: LokaliseResponse;
}

export interface ImportData {
    convert_placeholders?: 0 | 1;
    distinguish?: 0 | 1;
    file: FileFormat;
    filename?: string;
    fill_empty?: 0 | 1;
    hidden?: 0 | 1;
    icu_plurals?: 0 | 1;
    id: string;
    lang_iso: string;
    replace?: 0 | 1;
    replace_breaks?: 0 | 1;
    tags?: string[];
    use_trans_mem?: 0 | 1;
}

export interface ProjectImportResponse {
    response: LokaliseResponse;
    result: {
        inserted: number;
        skipped: number;
        updated: number;
    };
}

export interface UploadScreenshot {
    autotag: 0 | 1;
    id: string;
    key_ids: string[];
    screenshot: string;
}

export class Projects extends Request {
    constructor(token: string) {
        super(token);
    }

    public async add(data: AddProjectParams): Promise<AddProjectResponse> {
        return this.post<AddProjectResponse, AddProjectParams>('project/add', data);
    }

    public async createSnapshot(id: string, title: string): Promise<DefaultResponse> {
        return this.post<DefaultResponse, object>('project/export', {
            id,
            title
        });
    }

    public async empty(id: string): Promise<DefaultResponse> {
        return this.post<DefaultResponse, object>('project/export', {
            id
        });
    }

    public async export(data: ExportProjectParams): Promise<ExportResponse> {
        return this.post<ExportResponse, ExportProjectParams>('project/export', data);
    }

    public async exportToPath(filesPath: string, data: ExportProjectParams): Promise<ExportResponse> {
        const tmpDir = os.tmpdir();
        const exportData: ExportResponse = await this.export(data);

        return new Promise<ExportResponse>(
            (
                resolve: (data: ExportResponse) => void,
                reject: (data: LokaliseResponse) => void
            ): void => {
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
                    /* tslint:disable:no-console */
                    console.error(`Export error:  ${exportData.response.code} - ${exportData.response.message}`);
                    /* tslint:enable*/
                    reject(exportData.response);
                }
            });
    }

    public async import(data: ImportData): Promise<ProjectImportResponse> {
        data.file = fs.createReadStream(path.resolve(data.file));

        return this.post<ProjectImportResponse, ImportData>('project/import', data);
    }

    public async list(): Promise<ProjectsList> {
        return this.get<ProjectsList, object>('project/list');
    }

    public async remove(id: string): Promise<DefaultResponse> {
        return this.post<DefaultResponse, object>('project/remove', {id});
    }

    public async uploadScreenShot(data: UploadScreenshot): Promise<DefaultResponse> {
        return this.post<DefaultResponse, UploadScreenshot>('project/screenshot', data);
    }
}
