import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 20 },
        { duration: '30s', target: 100 },
        { duration: '1m', target: 200 },
        { duration: '30s', target: 0 },
    ],
};

// create the test user account
export function setup() {
    let registerUrl = 'http://localhost:8080/api/v1/auth/register';

    let registerPayload = JSON.stringify({
        name: "k6 Test User",
        email: "validUser@example.com",
        password: "correctPassword",
    });

    let params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let res = http.post(registerUrl, registerPayload, params);

    check(res, {
        'is status 200 or 422': (r) => r.status === 200 || r.status === 422,
    });

    return {
        email: JSON.parse(registerPayload).email,
        password: JSON.parse(registerPayload).password,
    };
}

export default function (data) {
    let loginUrl = 'http://localhost:8080/api/v1/auth/login';

    let payload = JSON.stringify({
        email: data.email,
        password: data.password,
    });

    let params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let loginRes = http.post(loginUrl, payload, params);

    check(loginRes, {
        'is status 200': (r) => r.status === 200,
        'is auth error false': (r) => JSON.parse(r.body).error === false,
        'is jwt token present': (r) => JSON.parse(r.body).payload.jwt !== undefined,
    });

    sleep(1);
}
