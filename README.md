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

### Slug Generation
Initially a random 7-character slug was generated based on an array of valid characters.  This "dead" code is still in `slugGenerator.js`, but has been replaced by a library named shortid that generates 7-14 character slugs that are virtually guaranteed to be unique.  However unlikely, slug collision can still occur (even though 62^14 is a HUGE number).  To cover this scenario the `LinkService` retries with a new slug if it fails to insert the first time.  If it fails on the retry then some other issue has occurred, so we pass the error along to the consumer of the API.

Another approach that was considered would be to use transactions to ensure that there is no collision, but doing so would not be scalable considering the link data is likely to be read/write heavy.  This would certainly not scale.  Instead we optimistically insert and retry in the unlikely scenario that it already exists.

### Database
MongoDB was chosen for the database.  MongoDB supports all the features needed for a large, scalable database - sharding, replication, etc.

The schema has been implemented as follows.
- `Links` - collection
  - `shortUrl` - unique
  - `expandedUrl`

#### Not Implemented
- One could imagine that users would want to maintain their own links with their own domain instead of http://rob.ly  The database would need to be expanded with a `Users` collection and a `userId` field in the `Links` collection.  Typically, in nosql databases the user data would be denormalized and added directly to the `Links` collection, but considering the number of documents that the `Links` collection could contain there are definitely space concerns with that approach.
- MongoDB has a Time To Live feature that could be added to the collection.  This would allow for a sliding expiration that could be used by mongod to automatically cleanup old, unused links.

### Code Patterns and Practices

#### Dependency Injection
The `db` object abstracts the database access.  This is injected into the `LinkService` so that the `LinkService` is only concerned with the business logic.  It also allows easier testing of the `LinkService`.  A factory is used to create an instance of the `LinkService` based on how the application is bootstrapped.

#### Promises
Promises were used for async operations instead of callbacks here.  Use of many nested callbacks creates "callback hell" aka the "christmas tree scenario".  Another approach would have been to use ES7's async/await syntax.

#### Testing
Mocha and Chai were used for testing.  Partly because they are very prevalent and have good documentation, but also because I like Chai's readability => `expect(obj).to.not.deep.equal(other)`.  Chai also contains an http helper that's useful for testing the Express app.

I strongly believe in readability for unit tests.  This makes unit tests easier to understand.  Factoring out common code into methods should be used sparingly.  The less your eyes have to navigate up and down a code file or call stack the better.  Trying to be clever creates headaches when you have to come back to maintain the tests.

The unit tests follow the Arrange/Act/Assert pattern.  First, create the mocks and arrange the subject-under-test, then perform the action that you'd like to test, and finally assert that the actual output matches the expected output.
