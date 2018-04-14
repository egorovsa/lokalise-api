export interface LokaliseResponse {
    status: string;
    code: string;
    message: string;
}
export interface DefaultResponse {
    response: LokaliseResponse;
}
export declare class Request {
    readonly token: string;
    constructor(token: string);
    protected get<T, U>(url: string, data?: U): Promise<T>;
    protected post<T, U>(url: string, data?: U): Promise<T>;
    protected arrayPropsToJson<T extends {
        [key: string]: any;
    }>(data: T): T;
}
