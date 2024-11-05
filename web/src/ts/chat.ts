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
        this.chatElement.innerHTML = "";  // Quick (but efficient?) hack to remove all chat messages from chat feed :^)

        this.messages.forEach((message) => {
            const newNode = (message.Sender_id === 1) ? sc.createElement("message-by-user") : sc.createElement("message-not-by-user");
            newNode.querySelector(".chat__message__user")!.textContent = `${this.usernames.get(message.Sender_id)}`;
            newNode.querySelector(".chat__message__contents")!.textContent = message.Message;
            this.chatElement.appendChild(newNode);
        });
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
        this.init();
    };
};

const schat = new SkejsChat(document.querySelector(".chat__feed")!);