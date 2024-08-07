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

function generateRandomUser() {
    const randomNumber = Math.floor(Math.random() * 1000000);
    return {
        name: `Test User ${randomNumber}`,
        email: `testuser${randomNumber}@example.com`,
        password: "password",
    };
}

export default function () {
    let registerUrl = 'http://localhost:8080/api/v1/auth/register';
    let user = generateRandomUser();
    let registerPayload = JSON.stringify(user);

    let params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let res = http.post(registerUrl, registerPayload, params);

    check(res, {
        'is status 200': (r) => r.status === 200,
        'is error false': (r) => JSON.parse(r.body).error === false,
    });

    sleep(1);
}
