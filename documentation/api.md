# API

This is the documentation for the API located at `/api/v1`.

## Endpoints

There should be 5 endpoints:

* `/api/v1/usernames`
* `/api/v1/message/get`
* `/api/v1/message/send`
* `/api/v1/login/login`
* `/api/v1/login/signup`

### usernames

* Method: GET
* Returns an array of Username objects:

```
{
    "usernames": [
        {
            "id": USERNAME_ID
            "name": USERNAME_NAME
        },
        ...
    ]
}
```

---

### message/get

* Method: GET
* Returns an array of Message objects:

```
{
    "messages": [
        {
            "id": UNIQUE_MESSAGE_ID
            "Sender_id": MESSAGE_SENDER_ID,
            "Receiver_id": MESSAGE_RECEIVER_ID,
            "Message": MESSAGE_TEXT_CONTENTS,
            "Timestamp": TIMESTAMP_IN_ISO_UTC_DATE_AND_TIME_FORMAT
        },
        ...
    ]
}
```

---

### message/send

* Method: POST
* Headers:

```
{
    Authorization: AUTH_TOKEN,
}
```

* Body:

```
{
    message: MESSAGE_TEXT_CONTENTS,
    timestamp: TIMESTAMP_IN_ISO_UTC_DATE_AND_TIME_FORMAT
}
```

---

### login/login

* Method: POST
* Body:

```
{
    username: USERNAME_NAME,
    password: PASSWORD_IN_BASE_64
}
```

* Password and username can't be empty.
* Returns an auth token.

```
{
    token: AUTH_TOKEN
}
```

---

### login/signup

* Method: POST
* Body:

```
{
    username: USERNAME_NAME
    password: PASSWORD_IN_BASE_64
}
```

* Password and username can't be empty.
* Returns an auth token, as if you've already logged in.

```
{
    token: AUTH_TOKEN
}
```