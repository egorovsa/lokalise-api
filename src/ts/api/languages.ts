import {DefaultResponse, Request} from "../services/request";

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

export class Languages extends Request {
	constructor(token: string) {
		super(token);
	}

	public async listSystemLanguages(): Promise<SystemLanguagesResponse> {
		return await this.get<SystemLanguagesResponse, any>('language/listall');
	}

	public async list(id: string): Promise<ProjectLanguagesList> {
		return await this.get<ProjectLanguagesList, any>('language/list', {
			id: id
		});
	}

	public async add(data: AddRemoveLanguagesParams): Promise<DefaultResponse> {
		return await this.post<DefaultResponse, AddRemoveLanguagesParams>('language/add', data);
	}

	public async setProperties(data: SetLanguagesParams): Promise<DefaultResponse> {
		return await this.post<DefaultResponse, SetLanguagesParams>('language/add', data);
	}

	public async remove(data: AddRemoveLanguagesParams): Promise<DefaultResponse> {
		return await this.post<DefaultResponse, AddRemoveLanguagesParams>('language/remove', data);
	}
}