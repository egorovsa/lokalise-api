import { DefaultResponse, LokaliseResponse, Request } from '../services/request';
import { PlaceholderFormat, PlatformBitMask, PluralFormat } from '..';
export interface LocaleKey {
    context: string;
    created_at: string;
    fuzzy: string;
    is_archived: string;
    is_hidden: string;
    key: string;
    modified_at: string;
    platform_mask: PlatformBitMask;
    plural_key: string;
    tags?: string[];
    translation: string;
}
export interface LocaleKeyAppend extends LocaleKey {
    filename_web: string;
    hidden: number;
    plural: string;
    translations: {
        [locale: string]: string;
    };
}
export interface StringsList {
    response: LokaliseResponse;
    strings: {
        [lang: string]: LocaleKey[];
    };
}
export interface StringsListParams {
    icu_numeric?: boolean;
    id: string;
    keys?: object[];
    langs?: object[];
    placeholder_format?: PlaceholderFormat;
    platform_mask?: PlatformBitMask;
    plural_format?: PluralFormat;
    tags?: object[];
}
export interface AddKeysParams {
    data: LocaleKeyAppend[];
    id: number;
}
export interface AddKeysResponse {
    response: LokaliseResponse;
    result: {
        inserted: string;
        updated: string;
    };
}
export interface RemoveKeysParams {
    id: number;
    keys: string[];
}
export declare class Strings extends Request {
    constructor(token: string);
    add(params: AddKeysParams): Promise<AddKeysResponse>;
    list(params: StringsListParams): Promise<StringsList>;
    remove(params: RemoveKeysParams): Promise<DefaultResponse>;
}
