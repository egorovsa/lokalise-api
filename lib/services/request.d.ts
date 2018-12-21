export interface LokaliseResponse {
    code: string;
    message: string;
    status: string;
}
export interface DefaultResponse {
    response: LokaliseResponse;
}
export declare class Request {
    readonly token: string;
    constructor(token: string);
    protected arrayPropsToJson<T extends {
        [key: string]: any;
    }>(data: T): T;
    protected get<T, U>(url: string, data?: U): Promise<T>;
    protected post<T, U>(url: string, data?: U): Promise<T>;
}
