<template>
    <div class="messages-alert">
        <div class="messages">
            <div class="message" v-for="(message, index) in messages" v-bind:key="index">
                <div class="name">
                    {{ `${message.name}:` }}
                </div>
                <div class="value">
                    {{ message.value }}
                </div>
            </div>
        </div>
        <div class="buttons">
            <div class="undo">
                Undo
            </div>
            <div class="back">
                Back
            </div>
        </div>
    </div>
</template>

<style scoped>
.messages-alert {
    align-items: center;
    background-color: "#ffffff";
    border-radius: 6px;
    box-shadow: 0px 8px 12px 0px rgba(98, 110, 117, 0.15);
    display: flex;
    padding: 16px 20px 16px 20px;
}

.messages-alert > .messages {
    flex: 1;
    margin: 0px 16px 0px 0px;
}

.messages-alert > .messages > .message {
    margin: 0px 0px 10px 0px;
}

.messages-alert > .messages > .message:last-child {
    margin: 0px 0px 0px 0px;
}

.messages-alert > .messages > .message > .name,
.messages-alert > .messages > .message > .value {
    display: inline-block;
}

.messages-alert > .messages > .message > .name {
    font-weight: 600;
    padding: 0px 2px 0px 0px;
    text-transform: capitalize;
}

.messages-alert > .buttons {
    display: inline-block;
}

.messages-alert > .buttons > .undo,
.messages-alert > .buttons > .back {
    box-sizing: border-box;
    color: #5d5d5d;
    cursor: pointer;
    display: inline-block;
    font-size: 15px;
    font-weight: 600;
    margin: 0px 5px 0px 5px;
    text-decoration: underline;
    user-select: none;
}

.messages-alert > .buttons > .undo:hover,
.messages-alert > .buttons > .back:hover {
    color: #000000;
}

.messages-alert > .buttons > .undo:active,
.messages-alert > .buttons > .back:active {
    color: #737373;
}
</style>

<script>
export const MessagesAlert = {
    name: "messages-alert",
    data: function() {
        return {
            messages: [
                { name: "Name 1 afafaf", value: "Value 1" },
                {
                    name: "Name 2 ff",
                    value:
                        "Value 2 faihfaiofh aºoifhg apoughago iah goah goiahfgoºaiwgh aiowºghaw oºgihaw ºoghaw oºgwahgºoaihgaoighawpuiohg awipuhgawpugha wpugihawpguih a"
                },
                { name: "Name 3", value: "Value 3" }
            ]
        };
    }
};
export default MessagesAlert;
</script>
