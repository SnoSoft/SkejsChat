"use strict";
import { TMessageJSON, TUsernameJSON, MessageDataJSON, UsernameDataJSON } from "./modules/types/chat";
import { sc } from "./modules/base/component";

class SkejsChat {
    messageDataJSON : MessageDataJSON;
    usernameDataJSON : UsernameDataJSON;
    chatElement : Element;
    usernames = new Map<number, string>();
    messages = new Map<string, TMessageJSON>();
    incomingMessages = new Map<string, TMessageJSON>();
    pollInterval = 2000;
    pollTimer;
    ignoreErrors = true;

    public async getMessages() : Promise<MessageDataJSON> {
        const promise = await fetch("sample-data/message.json");
        const messageDataJSON = await promise.json();

        this.incomingMessages = new Map<string, TMessageJSON>();

        await messageDataJSON.messages.forEach(message => {
            this.incomingMessages.set(  // Format: Message "id" (Timestamp + Sender id), message (TMessageJSON)
                `${message.Timestamp}/${message.Sender_id}`,
                message
            );
        });
        // console.log("incoming messages in getMessages:")
        // console.log(this.incomingMessages);

        return messageDataJSON;
    };

    async getUsernames() : Promise<UsernameDataJSON> {
        const promise = await fetch("sample-data/usernames.json");
        const usernameDataJSON = await promise.json();
    
        return usernameDataJSON;
    };

    assignIdsToUsernames() : Map<number, string> {
        let usernames = new Map();
        this.usernameDataJSON.usernames.forEach((username) => {
            usernames.set(username.id, username.name);
        });

        return usernames;
    };

    getDiffOfMessages() : Map<string, TMessageJSON> {
        let diffMessages = new Map<string, TMessageJSON>();
        this.incomingMessages.forEach((message, id) => {
            if (!this.messages.get(id)) {
                // console.log(`Found diff: ${id}`);
                diffMessages.set(id, message);
            }
        });
        return diffMessages;
    };

    async poll() : Promise<void> {
        this.messageDataJSON = await this.getMessages();
        if (this.getDiffOfMessages().size !== 0) {
            this.messages = new Map(this.incomingMessages);
            // console.log("incomingMessages in poll")
            // console.log(this.incomingMessages);
            // console.log(this.messages);
            this.populate();
        }
    };
    
    async populate() : Promise<void> {
        this.chatElement.querySelector(".chat__feed").innerHTML = "";  // Quick (but efficient?) hack to remove all chat messages from chat feed :^)

        this.messages.forEach((message) => {
            const newNode = (message.Sender_id === 1) ? sc.createElement("message-by-user") : sc.createElement("message-not-by-user");
            newNode.querySelector(".chat__message__user")!.textContent = `${this.usernames.get(message.Sender_id)}`;
            newNode.querySelector(".chat__message__contents")!.textContent = message.Message;
            this.chatElement.querySelector(".chat__feed").appendChild(newNode);
        });
    };

    async send() : Promise<void> {
        const messageContents = this.chatElement.querySelector(".chat__outbox__text").textContent;
        if (messageContents === "") return;
        const now = new Date().toISOString();
        const params = new URLSearchParams();
        params.append("message", messageContents);
        params.append("timestamp", now);
        
        const response = await fetch("./api/v1/send", {
            method: "POST",
            headers: {
                Authorization: "none"  // TODO: use authorization
            },
            body: params
        });
        if (response.status !== 200 && !this.ignoreErrors) {
            alert(`Failed to send the message: ${messageContents}`);
            return;
        }

        // TODO: use sender_id instead of 0 once auth is in place
        // receiver_id = 0 should maybe mean allchat?

        this.messages.set(`${now}/0`, {
            Sender_id: 0,
            Receiver_id: 0,
            Message: messageContents,
            Timestamp: now
        });
        this.chatElement.querySelector(".chat__outbox__text").textContent = "";
        this.populate();
    };

    async init() : Promise<void> {
        this.messageDataJSON = await this.getMessages();
        this.usernameDataJSON = await this.getUsernames();
        this.usernames = this.assignIdsToUsernames();
        this.populate();
        this.pollTimer = setInterval(() => { this.poll() }, this.pollInterval);
    };

    constructor(chatElement : Element) {
        this.chatElement = chatElement;
        this.chatElement.querySelector(".chat__send-button").addEventListener("click", () => { this.send() });
        this.chatElement.querySelector(".chat__outbox__text").addEventListener("keypress", (e : KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                this.send();
            }
        })
        this.init();
    };
};

const schat = new SkejsChat(document.querySelector(".chat")!);