import * as superagent from 'superagent';
import * as request from 'request';

const LOKALISE_API_URL = 'https://api.lokalise.co/api/';

export interface LokaliseResponse {
    status: string,
    code: string,
    message: string,
}

export interface DefaultResponse {
    response: LokaliseResponse,
}

export class Request {
    constructor(readonly token: string) {
    }

    protected get<T, U>(url: string, data?: U): Promise<T> {
        return new Promise<T>((resolve: Function, reject: Function) => {
            superagent.get(LOKALISE_API_URL + url)
                .query({...{api_token: this.token}, ...data as {}})
                .end((err, res) => {
                    if (!err) {
                        resolve(res.body);
                    } else {
                        reject(res);
                    }
                });
        });
    }

    protected post<T, U>(url: string, data?: U): Promise<T> {
        data = this.arrayPropsToJson<U>(data);

        return new Promise<T>((resolve: Function, reject: Function) => {
            request.post({
                url: LOKALISE_API_URL + url,
                formData: {...{api_token: this.token}, ...data as {}}
            }, (err: any, res: request.Response, body: string) => {
                if (!err) {
                    resolve(JSON.parse(body));
                } else {
                    reject(res);
                }
            });
        });
    }

    protected arrayPropsToJson<T extends { [key: string]: any }>(data: T): T {
        for (let key in data) {
            if (
                key === 'langs' ||
                key === 'filter' ||
                key === 'include_pids' ||
                key === 'include_tags' ||
                key === 'exclude_tags' ||
                key === 'tags' ||
                key === 'key_ids' ||
                key === 'iso' ||
                key === 'keys' ||
                key === 'data'
            ) {
                data[key] = JSON.stringify(data[key]);
            }
        }

        return data;
    }
}