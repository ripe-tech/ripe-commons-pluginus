<template>
    <div class="messages-alert">
        <div class="messages">
            <div class="message">
                <div class="name">
                    Name
                </div>
                <div class="value">
                    Value
                </div>
            </div>
        </div>
        <div class="buttons">
            <div class="undo">
                Undo
            </div>
            <div class="redo">
                Redo
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
    margin-right: 16px;
}

.messages-alert > .buttons {
    display: inline-block;
}

.messages-alert > .buttons > .undo,
.messages-alert > .buttons > .redo {
    box-sizing: border-box;
    color: #4d4d4d;
    cursor: pointer;
    display: inline-block;
    font-size: 15px;
    font-weight: 600;
    margin: 0px 5px 0px 5px;
    text-decoration: underline;
    user-select: none;
}

.messages-alert > .buttons > .undo:hover,
.messages-alert > .buttons > .redo:hover {
    color: #000000;
}
</style>

<script>
export const MessagesAlert = {
    name: "messages-alert"
};
export default MessagesAlert;
</script>
