# Archaeology Blog REST API

## Introduction
This REST API allows you to interact with Archaeology Blog `Articles`, `Categories`, `Users`, and `Comments`. These instructions guide you on how to query the API for different use cases. The response format for all datasets is JSON.

Technologies used: 

- Node.js
- Express 
- PostgreSQL (via Prisma ORM)
- JWT (with Passport.js for authentication)

## Querying Data

### Base URL

To be added...

### Articles
| Method   | Endpoint                            | Response                      | Token required | Author restricted |
|:---------|:------------------------------------|:------------------------------|---------------:|------------------:|
| `GET`    | `/api/v1/articles`                  | Get all published articles    | no             | no                |
| `GET`    | `/api/v1/articles?published=false`  | Get all unpublished articles  | yes            | yes               |
| `POST`   | `/api/v1/articles`                  | Create article                | yes            | yes               |
| `GET`    | `/api/v1/articles/{articleId}`      | Get single article            | no             | no                |
| `PUT`    | `/api/v1/articles/{articleId}`      | Update article                | yes            | yes               |
| `DELETE` | `/api/v1/articles/{articleId}`      | Delete article                | yes            | yes               |

### Comments
| Method   | Endpoint                                            | Response                  | Token required | Author restricted |
|:---------|:----------------------------------------------------|:--------------------------|---------------:|------------------:|
| `GET`    | `/api/v1/articles/{articleId}/comments`             | Get all article comments  | no             | no                |
| `POST`   | `/api/v1/articles/{articleId}/comments`             | Create article comment    | yes            | no                |
| `GET`    | `/api/v1/articles/{articleId}/comments/{commentId}` | Get article comment       | no             | no                |
| `PUT`    | `/api/v1/articles/{articleId}/comments/{commentId}` | Update comment            | yes            | no                |
| `DELETE` | `/api/v1/articles/{articleId}/comments/{commentId}` | Delete comment            | yes            | no                |

### Categories
| Method   | Endpoint                                   | Response                  | Token required | Author restricted |
|:---------|:-------------------------------------------|:--------------------------|---------------:|------------------:|
| `GET`    | `/api/v1/categories`                       | Get all categories        | no             | no                |
| `POST`   | `/api/v1/categories`                       | Create category           | yes            | yes               |
| `PUT`    | `/api/v1/categories/{categoryId}`          | Update category           | yes            | yes               |
| `DELETE` | `/api/v1/categories/{categoryId}`          | Delete category           | yes            | yes               |
| `GET`    | `/api/v1/categories/{categoryId}/articles` | Get all category articles | no             | no                |

### Users
| Method   | Endpoint                                          | Response                          | Token required | Author restricted |
|:---------|:--------------------------------------------------|:----------------------------------|---------------:|------------------:|
| `GET`    | `/api/v1/users`                                   | Get all users                     | no             | no                |
| `POST`   | `/api/v1/users`                                   | Create user                       | yes            | yes               |
| `GET`    | `/api/v1/users/{userId}`                          | Get user                          | no             | no                |
| `PUT`    | `/api/v1/users/{userId}`                          | Update user                       | yes            | yes               |
| `DELETE` | `/api/v1/users/{userId}`                          | Delete user                       | yes            | yes               |
| `GET`    | `/api/v1/users/{userId}/articles`                 | Get all user articles             | no             | no                |
| `GET`    | `/api/v1/users/{userId}/articles?published=false` | Get all unpublished user articles | yes            | yes               |
| `GET`    | `/api/v1/users/{userId}/comments`                 | Get all user comments             | no             | no                |

### Auth
| Method   | Endpoint                  | Response                               | Token required | Author restricted |
|:---------|:--------------------------|:---------------------------------------|---------------:|------------------:|
| `POST`   | `/api/v1/auth/register`   | Register user                          | no             | no                |
| `POST`   | `/api/v1/auth/login`      | Authenticate user and generate tokens  | no             | no                |
| `POST`   | `/api/v1/auth/refresh`    | Generate new access and refresh tokens | refresh token  | no                |

### Example Queries

#### GET request:
```js
fetch('https://to-be-added.com/api/v1/articles', {
  method: 'GET',
  headers: {
    Authorization: 'Bearer <your-access-token>',
  },
})
```
#### POST request:
```js
fetch('https://to-be-added.com/api/v1/articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer <your-access-token>',
  },
  body: JSON.stringify({
    title: 'New Article Title',
    content: 'Some article content here...',
    categoryId: 1,
  }),
})
```
#### GET response for /api/v1/articles:
```js
[
  {
    "id": 1,
    "title": "First Article",
    "content": "This is the content of the first article.",
    "published": true,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-02T15:00:00.000Z",
    "userId": 5,
    "categoryId": 3,
    "user": {
      "username": "johndoe"
    }
  },
  {
    "id": 2,
    "title": "Second Article",
    "content": "Another article here...",
    "published": true,
    "createdAt": "2024-02-10T12:00:00.000Z",
    "updatedAt": "2024-02-11T08:30:00.000Z",
    "userId": 7,
    "categoryId": 1,
    "user": {
      "username": "janedoe"
    }
  }
]
```

## Setup

### Installation Steps
#### Clone the repo:
```
git clone https://github.com/Dimitrije108/blog-api-backend.git
cd blog-api-backend
```
#### Install dependencies:
```
npm install
```
#### Set up environment variables in .env:
```
NODE_ENV=development
PORT=3000
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
JWT_REFRESH_SECRET="your_jwt_refresh_secret"
```
#### Start the server:
```
npm run start
```

#### Prisma db setup:
```js
npx prisma migrate dev // Creates and migrates database
```

## Authentication

Response from:`/api/v1/auth/login` and `/api/v1/auth/refresh` will return access and refresh tokens:
```json
{
  "accessToken": "your_access_token",
  "refreshToken": "your_refresh_token"
}
```

Include an `Authorization` header with your JWT token:
```json
GET /api/v1/private-route
Authorization: Bearer <your-access-token>
```

Store both tokens in localStorage.

## Error Handling

**Error Format:**
```json
{
  "status": "error",
  "message": "A description of the error",
  "details": "Optional additional details about the error"
}
```
| Status Code | Meaning               | Example Message           |
| ----------- | --------------------- | ------------------------- |
| `400`       | Bad Request           | "Invalid input data"      |
| `401`       | Unauthorized          | "Authentication required" |
| `403`       | Forbidden             | "Access denied"           |
| `404`       | Not Found             | "Resource not found"      |
| `409`       | Conflict              | "Email already in use"    |
| `500`       | Internal Server Error | "Something went wrong"    |
