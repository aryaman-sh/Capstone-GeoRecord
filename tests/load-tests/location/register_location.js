import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 20 },
        { duration: '30s', target: 50 },
        { duration: '1m', target: 100 },
        { duration: '30s', target: 0 },
    ],
};

const BASE_URL = 'http://localhost:8080/api/v1';

function generateNewLocation() {
    const coordinates = [
        [
            [153.0119950443189, -27.497387003891646],
            [153.0120549475585, -27.49759104626839],
            [153.01274742902132, -27.49814790999777],
            [153.01293432713146, -27.498154286282848],
            [153.01396945513324, -27.497894983691673],
            [153.014101242261, -27.497792962831333],
            [153.01435523200206, -27.49693215806557],
            [153.0142953287624, -27.496768498126123],
            [153.0119950443189, -27.497387003891646],
        ],
    ];

    return {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: coordinates,
        },
        properties: {
            name: `Test Location ${Math.random() * 1000}`,
        },
    };
}

export function setup() {
  const credentials = {
      name: 'K6 Test User',
      email: `k6testuser+${Math.random().toString(36).substring(7)}@example.com`,
      password: 'password',
  };
  const registerResponse = http.post(
      `${BASE_URL}/auth/register`,
      JSON.stringify(credentials),
      {
          headers: {
              'Content-Type': 'application/json',
          },
      }
  );

  const authToken = JSON.parse(registerResponse.body).payload.jwt;

  return {token: authToken};

}

export default function (data) {
    const newLocation = generateNewLocation();
    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`,
        },
    };

    let res = http.post(`${BASE_URL}/location`, JSON.stringify(newLocation), params);

    check(res, {
        'is status 200': (r) => r.status === 200,
        'is error false': (r) => JSON.parse(r.body).error === false,
    });

    sleep(1);
}
