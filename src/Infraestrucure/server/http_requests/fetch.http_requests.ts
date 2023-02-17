import axios from 'axios';
import Logger from '../../../common/configs/winston.logs';
import { requestFetch, responseType } from './types.http_request';
let intiHeaders: {
  'Content-Type'?: string
  'Cache-Control'?: string
} = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
};
export default async function fetchData({
    url,
    method,
    body,
    params,
    query,
    headers
}: requestFetch): Promise<responseType> {
    try {
        intiHeaders = {
            ...intiHeaders,
            ...(headers && headers)
        };

        const instance = axios.create({
            baseURL: url,
            headers: intiHeaders,
            withCredentials: true
        });
        const complet_url = url + `${params ? `/${params}` : ''}` + `${query ? `?${query}` : ''}`;
        const response = await instance({
            method,
            url: complet_url,
            ...(body && { body })
        });
        if (response.status === 200 || response.status === 201) {
            return {
                status: response.status,
                isValid: true,
                data: response?.data || {}
            };
        }
        return {
            isValid: false,
            status: response.status
        };
    } catch (e: any) {
        Logger.error(e);
        return {
            isValid: false,
            status: e.message
        };
    }
}
