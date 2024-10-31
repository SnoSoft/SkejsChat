CREATE TABLE IF NOT EXISTS account (
     id        INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     username      TEXT NOT NULL,
     password  TEXT NOT NULL,
     UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS message (
     id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     sender_id      INT NOT NULL REFERENCES account(id),
     receiver_id    INT NOT NULL REFERENCES account(id),
     content        TEXT NOT NULL,
     timestamp      TIMESTAMP NOT NULL
);
