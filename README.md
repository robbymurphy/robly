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
    - Success - 200 - `{ "shortUrl": "http://rob.ly/abcdefg", "expandedUrl": "http://www.google.com" }`
    - Error - 500 - `{ "error": "exception occurred" }`
- `/shorten` - GET - /shorten?url=http://www.google.com&[slug=mySlug]
  - Parameters
    - `url` - required - the URL to be shortened
    - `slug` - optional - when provided, the slug to be used in the short URL path
  - Result
    - Success - 200 - `{ "shortUrl": "http://rob.ly/abcdefg", "expandedUrl": "http://www.google.com" }`
    - Error - 500 - `{ "error": "exception occurred" }`

## Problem Space
The main challenge around generating links is creating a unique 7-character slug as part of the shortened url path (the ABC12ab part in http://rob.ly/ABC12ab).  Using 7 characters [A-Z][a-z][0-9] there are 62^7 or ~3.5 trillion slugs not including custom-provided ones.  This is a lot of slugs, but considering 500 million tweets occur on average every day (many with shortened urls), 3.5 trillion starts to look a lot smaller.  Minimizing slug collisions becomes the main problem when the shortening service gets real traction.

## Design Considerations

### Database
MongoDB was chosen for the database.  MongoDB supports all the features needed for a large, scalable database - sharding, replication, etc.

The schema has been implemented as follows.
- `Links` - collection
  - `shortUrl` - unique
  - `expandedUrl`

#### Not Implemented
- One could imagine that users would want to maintain their own links with their own domain instead of http://rob.ly  The database would need to be expanded with a `Users` collection and a `userId` field in the `Links` collection.  Typically, in nosql databases the user data would be denormalized and added directly to the `Links` collection, but considering the number of documents that the `Links` collection could contain there are definitely space concerns with that approach.
- MongoDB has a Time To Live feature that could be added to the collection.  This would allow for a sliding expiration that could be used by mongod to automatically cleanup old, unused links.
