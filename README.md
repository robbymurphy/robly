# Robly Url Generator
This project creates tiny url links from longer urls.

## Installation and Usage
Install dependencies.
```
npm install
```
Run tests.
```
npm run-script test
```
Start server.
```
npm start
```
After the server has been started a web server will be listening on http://localhost:8081 and MongoDB will be running at mongodb://localhost:27018/robly

## API Methods
- `/expand` - GET - /expand?shortUrl=http://rob.ly/abcdefg
  - Parameters
    - `shortUrl` - required - the URL to be expanded
  - Result
    - Success `{ "shortUrl": "http://rob.ly/abcdefg", "expandedUrl": "http://www.google.com" }`
    - Error `{ "error": "exception occurred" }`
- `/shorten` - GET - /shorten?url=http://www.google.com&[slug=mySlug]
  - Parameters
    - `url` - required - the URL to be shortened
    - `slug` - optional - when provided, the slug to be used in the short URL path
  - Result
    - Success `{ "shortUrl": "http://rob.ly/abcdefg", "expandedUrl": "http://www.google.com" }`
    - Error `{ "error": "exception occurred" }`