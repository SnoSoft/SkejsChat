<style lang="scss">
    @import "scss/components/chat";
</style>

<script lang="ts">
    import type { TMessageJSON, TUsernameJSON, MessageDataJSON, UsernameDataJSON, TIdMessageMap } from "$lib/types/chat";
    import { onMount } from "svelte";
    import Button from "./Button.svelte";
    import ChatMessage from "./ChatMessage.svelte";

    let displayedMessages : TIdMessageMap = new Map();
    let usernames : Map<number, string> = new Map();
    let outboxText = "";
    
    export async function load() {
        const fetchMessages = async (): Promise<MessageDataJSON> => {
            const response = await fetch('/sample-data/message.json');
            const messageDataJSON = await response.json();
            return messageDataJSON;
        };
        
        const fetchUsernames = async (): Promise<UsernameDataJSON> => {
            const response = await fetch('/sample-data/usernames.json');
            const usernameDataJSON = await response.json();
            return usernameDataJSON;
        };
        
        const messageDataJSON = await fetchMessages();
        const usernameDataJSON = await fetchUsernames();
        
        return {
            messageDataJSON,
            usernameDataJSON
        };
    }

    const getMessages = async (): Promise<TIdMessageMap> => {
        const promise = await fetch("./sample-data/message.json");
        const messageDataJSON = await promise.json();

        const incomingMessages = new Map<string, TMessageJSON>();
        messageDataJSON.messages.forEach((message: TMessageJSON) => {
            incomingMessages.set(  // Format: Message "id" (Timestamp + Sender id), message (TMessageJSON)
                `${message.Timestamp}/${message.Sender_id}`,
                message
            );
        });
        return incomingMessages;
    }

    const assignIdsToUsernames = (unassignedUsernameJSON : UsernameDataJSON): Map<number, string> => {
        let usernames = new Map();
        unassignedUsernameJSON.usernames.forEach((username) => {
            usernames.set(username.id, username.name);
        });

        return usernames;
    };

    const send = () => {
        let currentTime = new Date();
        const message = {
            "Timestamp": currentTime.toISOString(),
            "Sender_id": 1,
            "Receiver_id": 2,  // change this to actual receiver
            "Message": outboxText.slice(0)
        };
        displayedMessages.set(`${message.Timestamp}/${message.Sender_id}`, message);
        displayedMessages = displayedMessages;  // Force reactivity
        console.log("Sent message: ", message);
        console.log("Displayed messages: ", displayedMessages);
        outboxText = "";
    };

    const getDiffOfMessages = (incomingMessages: Map<string, TMessageJSON>, currentMessages: Map<string, TMessageJSON>): Map<string, TMessageJSON> => {
        let diffMessages = new Map<string, TMessageJSON>();
        incomingMessages.forEach((message, id) => {
            if (currentMessages.get(id)) {
                // console.log(`Found diff: ${id}`);
                diffMessages.set(id, message);
            }
        });
        return diffMessages;
    };

    const poll = async (currentMessages? : TIdMessageMap): Promise<void> => {
        let incomingMessages : TIdMessageMap = await getMessages();
        
        if (currentMessages) {
            if (getDiffOfMessages(incomingMessages, currentMessages).size === 0) {
                return;
            }
        }

        displayedMessages = incomingMessages;
    };

    const checkEnter = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault();
            send();
        }
    };

    onMount(async () => {
        const { messageDataJSON, usernameDataJSON } = await load();
        usernames = assignIdsToUsernames(usernameDataJSON);

        poll();
        const pollTimer = setInterval(poll, 2000);
    });
</script>

<div class="window">
    <div class="brand">
        <h1>SkejsChat</h1>
    </div>
    <div class="container">
        <div class="username">
            <p>Use this username:&nbsp;</p>
            <input type="text" id="username" placeholder="Username">
        </div>
        <hr>
        <div class="feed">
            {#each displayedMessages as message, i}
                {#if i === displayedMessages.size - 1}
                    <ChatMessage byUser={message[1].Sender_id === 1} username={usernames.get(message[1].Sender_id)} contents={message[1].Message} />
                {:else}
                    {#if displayedMessages.get(Array.from(displayedMessages.keys())[i + 1])?.Sender_id === message[1].Sender_id}  <!-- If the next message is from the same user -->
                        <ChatMessage byUser={message[1].Sender_id === 1} username={usernames.get(message[1].Sender_id)} contents={message[1].Message} consequentMessage={true} />
                    {:else}
                        <ChatMessage byUser={message[1].Sender_id === 1} username={usernames.get(message[1].Sender_id)} contents={message[1].Message} consequentMessage={false} />
                    {/if}
                {/if}
            {/each}
        </div>
        <hr>
        <div class="outbox__container">
            <div class="outbox">
                <p class="outbox__text" contenteditable bind:textContent={outboxText} on:keydown={checkEnter}>Hello World!</p>
            </div>
            <Button buttonText="Send" on:click={send} />
        </div>
    </div>
</div>