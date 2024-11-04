"use strict";
type TMessage = {
    Sender_id: number;
    Receiver_id: number;
    Message: string;
    Timestamp: string;
};

type TUsername = {
    id: number;
    name: string;
};

type MessageData = {
    messages: Array<TMessage>;
};

type UsernameData = {
    usernames: Array<TUsername>;
};

class SkejsChat {
    messageData : MessageData;
    usernameData : UsernameData;
    chatElement : Node;
    usernames = new Map();

    async getMessages() : Promise<MessageData> {
        const promise = await fetch("sample-data/message.json");
        const messageData = await promise.json();

        return messageData;
    };

    async getUsernames() : Promise<UsernameData> {
        const promise = await fetch("sample-data/usernames.json");
        const usernameData = await promise.json();
    
        return usernameData;
    };

    assignIdsToUsernames() : Map<number, string> {
        let usernames = new Map();
        this.usernameData.usernames.forEach((username) => {
            usernames.set(username.id, username.name);
        });

        return usernames;
    };
    
    async populate() : Promise<void> {
        this.messageData.messages.forEach((message) => {
            const newNode = (message.Sender_id === 1) ? sc.createElement("message-by-user") : sc.createElement("message-not-by-user");
            newNode.querySelector(".chat__message__user")!.textContent = `${this.usernames.get(message.Sender_id)}`;
            newNode.querySelector(".chat__message__contents")!.textContent = message.Message;
            this.chatElement.appendChild(newNode);
        });
    };

    async init() : Promise<void> {
        this.messageData = await this.getMessages();
        this.usernameData = await this.getUsernames();
        this.usernames = this.assignIdsToUsernames();
        this.populate();
    };

    constructor(chatElement : Element) {
        this.chatElement = chatElement;
        this.init();
    };
};

const schat = new SkejsChat(document.querySelector(".chat")!);