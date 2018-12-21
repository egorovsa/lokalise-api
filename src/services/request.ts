import * as request from 'request';
import * as superagent from 'superagent';

const LOKALISE_API_URL = 'https://api.lokalise.co/api/';

export interface LokaliseResponse {
    code: string;
    message: string;
    status: string;
}

export interface DefaultResponse {
    response: LokaliseResponse;
}

export class Request {
    constructor(readonly token: string) {
    }

    protected arrayPropsToJson<T extends { [key: string]: any }>(data: T): T {
        const typesArray: string[] = [
            'langs',
            'filter',
            'include_pids',
            'include_tags',
            'exclude_tags',
            'tags',
            'key_ids',
            'iso',
            'keys',
            'data'
        ];

        for (const key in data) {
            if (typesArray.indexOf(key) > -1) {
                data[key] = JSON.stringify(data[key]);
            }
        }

        return data;
    }

    protected get<T, U>(url: string, data?: U): Promise<T> {
        return new Promise<T>(
            (resolve: (res: any) => void, reject: (res: any) => void): void => {
                superagent.get(LOKALISE_API_URL + url)
                    .query({...{api_token: this.token}, ...data as {}})
                    .end((err, res) => {
                        if (!err) {
                            resolve(res.body);
                        } else {
                            reject(res);
                        }
                    });
            }
        );
    }

    protected post<T, U>(url: string, data?: U): Promise<T> {
        data = this.arrayPropsToJson<U>(data);

        return new Promise<T>(
            (resolve: (res: any) => void, reject: (res: any) => void): void => {
                request.post(
                    {
                        url: LOKALISE_API_URL + url,
                        formData: {...{api_token: this.token}, ...data as {}}
                    },
                    (err: any, res: request.Response, body: string) => {
                        if (!err) {
                            resolve(JSON.parse(body));
                        } else {
                            reject(res);
                        }
                    }
                );
            }
        );
    }
}
