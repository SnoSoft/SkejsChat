<style lang="scss">
    @import "scss/components/chat";
</style>

<script lang="ts">
    import type { TMessageJSON, TUsernameJSON, MessageDataJSON, UsernameDataJSON } from "$lib/types/chat";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Button from "./Button.svelte";
    import ChatMessage from "./ChatMessage.svelte";

    let contents = "Contents";
    
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

    onMount(() => {
        contents = "Contents has been mounted.";
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
            <!-- {#each schat.messages as message}
                <ChatMessage byUser={message[1].Sender_id === 1} username={schat.usernames.get(message[1].Sender_id)} contents={message[1].Message} />
            {/each} -->
            <ChatMessage byUser={true} username="User1" contents={contents}/>
        </div>
        <hr>
        <div class="outbox__container">
            <div class="outbox">
                <p class="outbox__text" contenteditable>Hello World!</p>
            </div>
            <Button buttonText="Send"/>
        </div>
    </div>
</div>