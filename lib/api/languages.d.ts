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
export declare class Languages extends Request {
    constructor(token: string);
    add(data: AddRemoveLanguagesParams): Promise<DefaultResponse>;
    list(id: string): Promise<ProjectLanguagesList>;
    listSystemLanguages(): Promise<SystemLanguagesResponse>;
    remove(data: AddRemoveLanguagesParams): Promise<DefaultResponse>;
    setProperties(data: SetLanguagesParams): Promise<DefaultResponse>;
}
