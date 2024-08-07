import unittest
import httpx
from uuid import uuid4
import json

class TestAPIMicroservice(unittest.TestCase):

    UQ_COORDINATES = [
              [
                [
                  153.0119950443189,
                  -27.497387003891646
                ],
                [
                  153.0120549475585,
                  -27.49759104626839
                ],
                [
                  153.01274742902132,
                  -27.49814790999777
                ],
                [
                  153.01293432713146,
                  -27.498154286282848
                ],
                [
                  153.01396945513324,
                  -27.497894983691673
                ],
                [
                  153.014101242261,
                  -27.497792962831333
                ],
                [
                  153.01435523200206,
                  -27.49693215806557
                ],
                [
                  153.0142953287624,
                  -27.496768498126123
                ],
                [
                  153.0119950443189,
                  -27.497387003891646
                ]
              ]
            ]

    QUT_COORDINATES = [
        [
            [
                153.02615877986085,
                -27.475821971773165
            ],
            [
                153.02585324635976,
                -27.475942447722474
            ],
            [
                153.0284672552031,
                -27.479466310966494
            ],
            [
                153.02914621853802,
                -27.479677136817443
            ],
            [
                153.03002887087553,
                -27.47970725476381
            ],
            [
                153.03060598971012,
                -27.47934583887062
            ],
            [
                153.03118310854467,
                -27.478894067336746
            ],
            [
                153.03159048654607,
                -27.478351939049652
            ],
            [
                153.03179417554674,
                -27.47774957115886
            ],
            [
                153.03176022738126,
                -27.47681589441767
            ],
            [
                153.0307417823778,
                -27.472237752016262
            ],
            [
                153.02615877986085,
                -27.475821971773165
            ]
        ]
    ]
    BASE_URL = 'http://localhost:8080/api/v1'
    TOKEN = ''  # Placeholder for the JWT
    QUT_LOCATION_ID = '' # Placeholder
    QUT_LOCATION_NAME = 'QUTafe'
    QUT_BOUNDING_BOX = '153.02294193485199,-27.481347971326237,153.03574143627102,-27.47035389480529'

    @classmethod
    def setUpClass(cls):
        """
        Create required data for tests
        """
        auth_response = httpx.post(f'{cls.BASE_URL}/auth/register', json={
            'name': 'Test User',
            'email': 'validUser@example.com',
            'password': 'correctPassword'
        })
        if auth_response.status_code == 200 :
            cls.TOKEN = auth_response.json()["payload"]["jwt"]
        elif auth_response.status_code == 422:
            auth_response = httpx.post(f'{cls.BASE_URL}/auth/login', json={
                'email': 'validUser@example.com',
                'password': 'correctPassword'
            })
            cls.TOKEN = auth_response.json()["payload"]["jwt"]
        else:
            raise Exception(f"Authentication failed. Cannot proceed with tests. Response: {auth_response.status_code} {auth_response.text}")

        # Create a location (QUT) to use in tests
        new_location = {
            "type": "Feature",
            "geometry": {
            "type": "Polygon",
            "coordinates": cls.QUT_COORDINATES
            },
            "properties": {
            "name": cls.QUT_LOCATION_NAME
            }
        }

        location_response = httpx.post(
            f'{cls.BASE_URL}/location',
            json=new_location,
            headers={'Authorization': f'Bearer {cls.TOKEN}'}
        )

        print(location_response)
        location_json = location_response.json()
        if location_json["error"] == False:
            cls.QUT_LOCATION_ID = location_json["payload"]["location_id"]
        else:
            raise Exception(f"Failed to setup test location. Cannot proceed with tests. Response: {auth_response.status_code} {auth_response.text}")


    def test_register_location(self):
        """
        Test the registration of a new location
        """

        # Register UQ as a location
        new_location = {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": self.UQ_COORDINATES
          },
          "properties": {
            "name": "The Great Court"
          }
        }
        response = httpx.post(
            f'{self.BASE_URL}/location',
            json=new_location,
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        self.assertEqual(200, response.status_code, msg="Failed to create a location")
        self.assertFalse(response.json()["error"], msg="Error flag should be False")

    def test_register_invalid_location_1(self):
        """
        Attempt to register a location without providing a polygon defining where it is
        """

        # Register UQ as a location
        new_location = {
            "type": "Feature",
            "geometry": {
            "type": "Polygon",
            },
            "properties": {
            "name": "The Great Court"
            }
        }
        response = httpx.post(
            f'{self.BASE_URL}/location',
            json=new_location,
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        self.assertNotEqual(200, response.status_code, msg="Invalid location was accepted")
        self.assertTrue(response.json()["error"], msg="Error flag should be True")

    def test_register_invalid_location_2(self):
        """
        Attempt to register a location without providing a name for it
        """

        # Register UQ as a location
        new_location = {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": self.UQ_COORDINATES
          },
          "properties": {
          }
        }

        response = httpx.post(
            f'{self.BASE_URL}/location',
            json=new_location,
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        self.assertNotEqual(200, response.status_code, msg="Invalid location was accepted")
        self.assertTrue(response.json()["error"], msg="Error flag should be True")




    def test_register_location_invalid_token(self):
        """
        Attempt to register a valid location with an invalid auth token
        """

        # Register UQ as a location
        new_location = {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": self.UQ_COORDINATES
          },
          "properties": {
            "name": "The Great Court"
          }
        }
        response = httpx.post(
            f'{self.BASE_URL}/location',
            json=new_location,
            headers={'Authorization': f'Bearer InvalidJWT'}
        )

        self.assertNotEqual(200, response.status_code, msg="Invalid location was accepted")
        self.assertTrue(response.json()["error"], msg="Error flag should be True")

    def test_get_location(self):
        """
        Test the retreival of an existing location
        """

        response = httpx.get(
            f'{self.BASE_URL}/location/{self.QUT_LOCATION_ID}',
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        self.assertEqual(200, response.status_code, msg="Failed to get a location")
        self.assertFalse(response.json()["error"], msg="Error flag should be False")
        self.assertEqual(response.json()["payload"]["properties"]["id"], self.QUT_LOCATION_ID)
        self.assertEqual(response.json()["payload"]["properties"]["name"], self.QUT_LOCATION_NAME)

    def test_get_location_coordinates(self):
        """
        Test that the correct coordinates are returned when a location is requested
        """

        response = httpx.get(
            f'{self.BASE_URL}/location/{self.QUT_LOCATION_ID}',
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        self.assertEqual(200, response.status_code, msg="Failed to get a location")
        self.assertFalse(response.json()["error"], msg="Error flag should be False")
        coordinates = json.loads(response.json()["payload"]["geometry"])["coordinates"]
        for api_pair, correct_pair in zip(coordinates[0], self.QUT_COORDINATES[0]):
            api_x, api_y = api_pair
            correct_x, correct_y = correct_pair
            self.assertAlmostEqual(api_x, correct_x)
            self.assertAlmostEqual(api_y, correct_y)

    def test_get_invalid_location(self):
        """
        Test the retreival of an invalid location
        """
        invalid_id = str(uuid4())

        response = httpx.get(
            f'{self.BASE_URL}/location/{invalid_id}',
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        self.assertEqual(404, response.status_code, msg="Invalid location ID was accepted")
        self.assertTrue(response.json()["error"], msg="Error flag should be False")


    def test_get_location_invalid_token(self):
        """
        Test the retreival of an a valid location but with an invalid auth token
        """
        invalid_id = str(uuid4())

        response = httpx.get(
            f'{self.BASE_URL}/location/{self.QUT_LOCATION_ID}',
            headers={'Authorization': f'Bearer InvalidJWT'}
        )

        self.assertEqual(403, response.status_code, msg="Invalid token was accepted")
        self.assertTrue(response.json()["error"], msg="Error flag should be true")



    def test_location_query(self):
        """
        Query all location in a bounding box around QUT, ensure that QUT is returned as the result
        """

        response = httpx.get(
            f'{self.BASE_URL}/location/query/{self.QUT_BOUNDING_BOX}',
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        self.assertEqual(200, response.status_code, msg="Failed to query QUT in bounding box")
        self.assertFalse(response.json()["error"], msg="Error flag should be False")
        self.assertEqual(response.json()["payload"]["features"][0]["properties"]["name"], self.QUT_LOCATION_NAME)

    def test_location_query_invalid_token(self):
        """
        Make a valid location query with an invalid JWT
        """

        response = httpx.get(
            f'{self.BASE_URL}/location/query/{self.QUT_BOUNDING_BOX}',
            headers={'Authorization': f'Bearer InvalidJWT'}
        )

        self.assertNotEqual(200, response.status_code)
        self.assertTrue(response.json()["error"], msg="Error flag should be True")


    def test_location_query_invalid_bbox_1(self):
        """
        Make a location query with an invalid bounding box
        """

        # South coordinate is greater than north
        response = httpx.get(
            f'{self.BASE_URL}/location/query/153.02294193485199,27.481347971326237,153.03574143627102,-27.47035389480529',
            headers={'Authorization': f'Bearer InvalidJWT'}
        )

        self.assertNotEqual(200, response.status_code)
        self.assertTrue(response.json()["error"], msg="Error flag should be True")

    def test_location_query_invalid_bbox_2(self):
        """
        Make a location query with an invalid bounding box
        """

        # BBOX is empty
        response = httpx.get(
            f'{self.BASE_URL}/location/query/,,,',
            headers={'Authorization': f'Bearer InvalidJWT'}
        )

        self.assertNotEqual(200, response.status_code)
        self.assertTrue(response.json()["error"], msg="Error flag should be True")

    def test_location_query_invalid_bbox_3(self):
        """
        Make a location query with an invalid bounding box
        """

        # BBOX is junk
        response = httpx.get(
            f'{self.BASE_URL}/location/query/skibidi toilet',
            headers={'Authorization': f'Bearer InvalidJWT'}
        )

        self.assertNotEqual(200, response.status_code)
        self.assertTrue(response.json()["error"], msg="Error flag should be True")

    def test_search_locations_success(self):
        """
        Test searching for a location by name to ensure it returns the expected location details.
        """
        search_query = 'QUTafe'
        response = httpx.get(
            f'{self.BASE_URL}/search/?query={search_query}',
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        self.assertEqual(200, response.status_code, msg="Failed to search for existing locations")
        search_results = response.json()["payload"]
        self.assertTrue(any(location['name'] == self.QUT_LOCATION_NAME for location in search_results), msg="Search did not return the expected location")

    def test_search_locations_partial_match(self):
        """
        Test searching for a location by a partial fragment of its name to ensure it returns the expected location details.
        """
        search_query = 'QUT'
        response = httpx.get(
            f'{self.BASE_URL}/search/?query={search_query}',
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        self.assertEqual(200, response.status_code, msg="Failed to search for existing locations")
        search_results = response.json()["payload"]
        self.assertTrue(any(location['name'] == self.QUT_LOCATION_NAME for location in search_results), msg="Search did not return the expected location")

    def test_search_locations_no_match(self):
        """
        Test searching for a location that does not exist to ensure it handles it gracefully.
        """
        search_query = 'NonExistentLocation'
        response = httpx.get(
            f'{self.BASE_URL}/search/?query={search_query}',
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )
        self.assertEqual(404, response.status_code, msg="Did not handle non-existent location search properly")
        self.assertTrue(response.json()["error"], msg="Error flag should be False for non-existent search")

    def test_search_locations_no_query(self):
        """
        Test the search endpoint without providing a query parameter
        """
        response = httpx.get(
            f'{self.BASE_URL}/search/',
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        self.assertNotEqual(200, response.status_code, msg="Should not search successfully without a query parameter")

    def test_create_thread(self):
        """
        Test the successful creation of a thread
        """
        new_thread = {
            "location_id": self.QUT_LOCATION_ID,
            "title": "QUT Thread Title",
            "descript": "Description of the QUT thread"
        }
        response = httpx.post(
            f'{self.BASE_URL}/threads/{self.QUT_LOCATION_ID}',
            json=new_thread,
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        self.assertEqual(201, response.status_code, msg="Failed to create a new thread")
        self.assertFalse(response.json()["error"], msg="Error flag should be False")

    def test_retrieve_threads(self):
        """
        Test the retrieval of threads for a given location
        """
        response = httpx.get(
            f'{self.BASE_URL}/threads/{self.QUT_LOCATION_ID}',
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        self.assertEqual(200, response.status_code, msg="Failed to retrieve threads for the location")
        self.assertFalse(response.json()["error"], msg="Error flag should be False")
        self.assertTrue(len(response.json()["payload"]) > 0, msg="No threads returned for the location")

    def test_create_comment(self):
        """
        Test the successful creation of a comment on a thread
        """
        # 1. Create a thread
        new_thread = {
            "location_id": self.QUT_LOCATION_ID,
            "title": "QUT Thread Title",
            "descript": "Description of the QUT thread"
        }
        response = httpx.post(
            f'{self.BASE_URL}/threads/{self.QUT_LOCATION_ID}',
            json=new_thread,
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        thread_id = response.json()["payload"]["thread_id"]

        # 2. Add a comment to it
        new_comment = {
            "thread_id": thread_id,
            "comment": "This is a test comment"
        }
        response = httpx.post(
            f'{self.BASE_URL}/threads/comment/{thread_id}',
            json=new_comment,
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        self.assertEqual(201, response.status_code, msg="Failed to create a new comment")
        self.assertFalse(response.json()["error"], msg="Error flag should be False")

    def test_retrieve_comments(self):
        """
        Test the retrieval of comments for a given thread
        """
        # 1. Create a thread
        new_thread = {
            "location_id": self.QUT_LOCATION_ID,
            "title": "QUT Thread Title",
            "descript": "Description of the QUT thread"
        }
        response = httpx.post(
            f'{self.BASE_URL}/threads/{self.QUT_LOCATION_ID}',
            json=new_thread,
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        thread_id = response.json()["payload"]["thread_id"]

        # 2. Add a comment to it
        new_comment = {
            "thread_id": thread_id,
            "comment": "This is a test comment"
        }
        response = httpx.post(
            f'{self.BASE_URL}/threads/comment/{thread_id}',
            json=new_comment,
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        response = httpx.get(
            f'{self.BASE_URL}/threads/comment/{thread_id}',
            headers={'Authorization': f'Bearer {self.TOKEN}'}
        )

        self.assertEqual(200, response.status_code, msg="Failed to retrieve comments for the thread")
        self.assertFalse(response.json()["error"], msg="Error flag should be False")
        self.assertTrue(len(response.json()["payload"]) > 0, msg="No comments returned for the thread")

if __name__ == '__main__':
    unittest.main()
