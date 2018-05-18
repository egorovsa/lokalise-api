import { DefaultResponse, Request } from '../services/request';
export interface Language {
    iso: string;
    name: string;
    rtl: string;
}
export interface ProjectLanguage extends Language {
    words: string;
    is_default: string;
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
    id: string;
    original_iso: string;
    custom_iso?: string;
    custom_name?: string;
}
export declare class Languages extends Request {
    constructor(token: string);
    listSystemLanguages(): Promise<SystemLanguagesResponse>;
    list(id: string): Promise<ProjectLanguagesList>;
    add(data: AddRemoveLanguagesParams): Promise<DefaultResponse>;
    setProperties(data: SetLanguagesParams): Promise<DefaultResponse>;
    remove(data: AddRemoveLanguagesParams): Promise<DefaultResponse>;
}
