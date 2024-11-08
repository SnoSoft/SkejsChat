<style lang="scss">
    .message {
        $current-message: &;
        $message-border-radius: 1rem;
        $text-size: 1.5rem;
        width: 80%;
        border-radius: $message-border-radius;
        padding: $message-border-radius * 0.8;
        font-size: $text-size;
        background-color: lighten(lightgrey, 10%);

        &__user {
            margin-bottom: 0.5rem;
            font-family: var(--font-monospace-code);
            font-weight: 900;
            color: grey;
        }
        &__contents {
            font-weight: 400;
            font-family: var(--font-system-ui);
        }
        &--not-by-user {
            align-self: start;
        }
        &--by-user {
            align-self: end;
            background-color: var(--blue-5);
            #{$current-message}__user {
                color: lightgrey;
            }
            #{$current-message}__contents {
                color: white;
            }
        }
        &:not(:last-child) {
            margin-bottom: 2rem;
        }
    }
</style>

<script lang="ts">
    let { byUser = true, username = "undefined", contents = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, quia totam tempore sit voluptate consequatur." } = $props();
</script>

<div class="message" class:message--by-user="{byUser}" class:message--not-by-user="{!byUser}">
    <h3 class="message__user">{ username }</h3>
    <p class="message__contents">{ contents }</p>
</div>