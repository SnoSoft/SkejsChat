"use strict";
export type TMessageJSON = {
    Sender_id: number;
    Receiver_id: number;
    Message: string;
    Timestamp: string;
};

export type TUsernameJSON = {
    id: number;
    name: string;
};

export type MessageDataJSON = {
    messages: Array<TMessageJSON>;
};

export type UsernameDataJSON = {
    usernames: Array<TUsernameJSON>;
};