import { DefaultResponse, Request } from '../services/request';

export interface Language {
    iso: string;
    name: string;
    rtl: string;
}

export interface ProjectLanguage extends Language {
    is_default: string;
    words: string;
}

export interface SystemLanguagesResponse {
    languages: Language[];
    response: DefaultResponse;
}

export interface ProjectLanguagesList {
    languages: ProjectLanguage[];
    response: DefaultResponse;
}

export interface AddRemoveLanguagesParams {
    id: string;
    iso: string[];
}

export interface SetLanguagesParams {
    custom_iso?: string;
    custom_name?: string;
    id: string;
    original_iso: string;
}

export class Languages extends Request {
    constructor(token: string) {
        super(token);
    }

    public async add(data: AddRemoveLanguagesParams): Promise<DefaultResponse> {
        return this.post<DefaultResponse, AddRemoveLanguagesParams>('language/add', data);
    }

    public async list(id: string): Promise<ProjectLanguagesList> {
        return this.get<ProjectLanguagesList, object>('language/list', {
            id
        });
    }

    public async listSystemLanguages(): Promise<SystemLanguagesResponse> {
        return this.get<SystemLanguagesResponse, object>('language/listall');
    }

    public async remove(data: AddRemoveLanguagesParams): Promise<DefaultResponse> {
        return this.post<DefaultResponse, AddRemoveLanguagesParams>('language/remove', data);
    }

    public async setProperties(data: SetLanguagesParams): Promise<DefaultResponse> {
        return this.post<DefaultResponse, SetLanguagesParams>('language/add', data);
    }
}
