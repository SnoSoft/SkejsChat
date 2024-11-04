class SkejsChat {
    messageData = {};
    usernameData = {};
    usernames = new Map();

    async getMessages() {
        const promise = await fetch("sample-data/message.json");
        const messageData = await promise.json();

        return messageData;
    };

    async getUsernames() {
        const promise = await fetch("sample-data/usernames.json");
        const usernameData = await promise.json();
    
        return usernameData;
    };

    assignIdsToUsernames() {
        let usernames = new Map();
        this.usernameData.usernames.forEach((username) => {
            usernames.set(username.id, username.name);
        });

        return usernames;
    };
    
    async populate() {
        this.messageData.messages.forEach((message) => {
            const newNode = (message.Sender_id === 1) ? sc.createNode("message-by-user") : sc.createNode("message-not-by-user");
            newNode.querySelector(".chat__message__user").textContent = `${this.usernames.get(message.Sender_id)}`;
            newNode.querySelector(".chat__message__contents").textContent = message.Message;
            document.querySelector(".chat__feed").appendChild(newNode);
        });
    };

    async init() {
        this.messageData = await this.getMessages();
        this.usernameData = await this.getUsernames();
        this.usernames = this.assignIdsToUsernames();
        this.populate();
    };

    constructor() {
        this.init();
    };
};

const schat = new SkejsChat();