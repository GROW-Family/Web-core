export const REQ_API_TIMEOUT: number = 60000;
export const sourceVersion = 1;

export const cookieProps = {
    get: {
        '0': 'sourceVersion',
        '1': 'access_token',
        '2': 'refresh_token',
        '3': 'created_date',
        '4': 'origin',
    },
    set: {
        sourceVersion: '0',
        access_token: '1',
        refresh_token: '2',
        created_date: '3',
        origin: '4',
    },
};