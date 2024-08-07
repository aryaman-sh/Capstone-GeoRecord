# API Response Formatting Guide

In an effort to standardise our API interactions, the following guideline outlines the structured format that all API responses should adhere to. This format provides a consistent method for clients to interpret the results, regardless of the outcome of the request.

## Response Structure

All API responses will be formatted in JSON. Each response object will consist of three main components: `error`, `message`, and `payload`.

```json
{
  "error": "bool",
  "message": "string",
  "payload": "object"
}
```

### Components Explained

- `error` (bool): This boolean value indicates the success or failure of the API request. A value of `true` means an error occurred during the request process, whereas `false` indicates a successful request.

- `message` (string): This field is used to convey error nessafes related to the request. In the event of a successful request where no error message is necessary, this field should be an empty string. It serves as an explanation when the `error` field is `true`.

- `payload` (object): The `payload` object houses the response from the API call. This is where the requested data or result of the API operation will be stored. In the case of an error state (`error`: true), the `payload` may be an empty object.

## Example Responses

### Successful Request

```json
{
  "error": false,
  "message": null,
  "payload": {
    "data": [
      // The requested data
    ]
  }
}
```

### Failed Request

```json
{
  "error": true,
  "message": "Error message explaining what went wrong",
  "payload": {}
}
```
