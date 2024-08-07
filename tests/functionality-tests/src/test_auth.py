import unittest
import httpx
import random

class TestAuth(unittest.TestCase):

    BASE_URL = 'http://localhost:8080/api/v1/auth'
    AUTH_TEST_USER_EMAIL = "validUser@example.com"
    AUTH_TEST_USER_PASSWORD = "correctPassword"

    @classmethod
    def setUpClass(cls):
        """
        Run once for the class setup
        """
        # Attempt to create a user that will be used across tests
        test_user = {
            'name': 'Test User',
            'email': cls.AUTH_TEST_USER_EMAIL,
            'password': cls.AUTH_TEST_USER_PASSWORD
        }
        response = httpx.post(f'{cls.BASE_URL}/register', json=test_user)
        if response.status_code not in [200, 422]:
            raise Exception(f"Failed to create/setup test user. Response: {response.status_code} {response.text}")

    def test_successful_login(self):
        """
        Verifies that a valid login is accepted
        """
        response = httpx.post(f'{self.BASE_URL}/login', json={
            'email': self.AUTH_TEST_USER_EMAIL,
            'password': self.AUTH_TEST_USER_PASSWORD
        })

        self.assertEqual(200, response.status_code)
        json_response = response.json()
        self.assertEqual(json_response["error"], False)
        self.assertEqual(json_response["payload"]["jwt"] is not None, True)

    def test_register_new_user(self):
        """
        Verifies that registering a new user works
        """
        # Generate random user email with lots of entropy
        username = str(random.randint(0, 11111111111111))
        domain = str(random.randint(0, 11111111111111))
        response = httpx.post(f'{self.BASE_URL}/register', json={
            'name': 'New User',
            'email': f'{username}@{domain}.com',
            'password': 'newUserPassword'
        })

        self.assertEqual(200, response.status_code)
        self.assertEqual(response.json()["error"], False)

    def test_register_existing_user(self):
        """
        Verifies that registering an already registered user fails
        """
        response = httpx.post(f'{self.BASE_URL}/register', json={
            'name': 'Existing User',
            'email': self.AUTH_TEST_USER_EMAIL,
            'password': self.AUTH_TEST_USER_PASSWORD
        })

        self.assertNotEqual(200, response.status_code)
        self.assertEqual(422, response.status_code)

    def test_login_with_wrong_email(self):
        """
        Verifies that login with a wrong email is rejected
        """
        response = httpx.post(f'{self.BASE_URL}/login', json={
            'email': self.AUTH_TEST_USER_EMAIL + ".au",
            'password': self.AUTH_TEST_USER_PASSWORD
        })

        self.assertNotEqual(200, response.status_code)

    def test_login_with_wrong_password(self):
        """
        Verifies that login with a wrong password is rejected
        """
        response = httpx.post(f'{self.BASE_URL}/login', json={
            'email': self.AUTH_TEST_USER_EMAIL,
            'password': 'wrongPassword'
        })

        self.assertNotEqual(200, response.status_code)

    def test_health_check(self):
        """
        Verifies that the health check endpoint is functioning
        """
        response = httpx.get(f'{self.BASE_URL}/health')

        self.assertEqual(200, response.status_code)
        self.assertEqual(response.json()['error'], False)
