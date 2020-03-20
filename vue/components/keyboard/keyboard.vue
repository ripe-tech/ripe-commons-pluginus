<template>
    <div class="keyboard">
        <div class="keyboard-keys">
            <div class="keyboard-row" v-for="(row, index) in parsedKeys" v-bind:key="index">
                <div
                    class="keyboard-key"
                    v-bind:class="[keyType(key), key.name, { active: isActive(key) }]"
                    v-for="key in row"
                    v-bind:key="key.name"
                    v-on:click="() => keyPressed(key)"
                >
                    <span v-if="keyType(key) === 'alphanumeric'">{{ key.name }}</span>
                    <div class="image-container" v-else>
                        <img v-bind:src="keyImage(key)" />
                        <div class="border" />
                    </div>
                    <p class="label" v-if="key.label">
                        {{ key.label }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.keyboard {
    background-color: #f5f5f5;
    border-radius: 20px 20px 20px 20px;
    margin-bottom: 30px;
    padding: 20px 20px 20px 20px;
    text-align: center;
}

body.tablet .keyboard,
body.mobile .keyboard {
    border: none;
    padding: 0px;
}

.keyboard .keyboard-row {
    font-size: 0px;
    margin-bottom: 8px;
}

.keyboard .keyboard-row:last-child {
    margin-bottom: 0px;
}

.keyboard .keyboard-row .keyboard-key {
    background-color: #e5e5e5;
    border-radius: 4px 4px 4px 4px;
    cursor: pointer;
    display: inline-block;
    font-size: 28px;
    height: 60px;
    margin-right: 8px;
    text-transform: uppercase;
    user-select: none;
    vertical-align: top;
    width: 50px;
}

body.tablet .keyboard .keyboard-row .keyboard-key {
    font-size: 20px;
    height: 35px;
    margin-right: 6px;
    width: 35px;
}

body.mobile .keyboard .keyboard-row .keyboard-key {
    font-size: 17px;
    height: 30px;
    margin-right: 4px;
    width: 30px;
}

.keyboard .keyboard-row .keyboard-key:last-child {
    margin-right: 0px;
}

.keyboard .keyboard-row .keyboard-key:active {
    background-color: #a5a5a5;
}

.keyboard .keyboard-row .keyboard-key.alphanumeric {
    line-height: 60px;
}

body.tablet .keyboard .keyboard-row .keyboard-key.alphanumeric {
    line-height: 35px;
}

body.mobile .keyboard .keyboard-row .keyboard-key.alphanumeric {
    line-height: 30px;
}

body.tablet .keyboard .keyboard-row .keyboard-key.special,
body.mobile .keyboard .keyboard-row .keyboard-key.special {
    box-sizing: border-box;
    padding: 5px 0px 5px 0px;
}

.keyboard .keyboard-row .keyboard-key.backspace {
    width: 80px;
}

body.tablet .keyboard .keyboard-row .keyboard-key.backspace,
body.mobile .keyboard .keyboard-row .keyboard-key.backspace {
    width: 40px;
}

.keyboard .keyboard-row .keyboard-key .image-container {
    height: 100%;
}

.keyboard .keyboard-row .keyboard-key img {
    height: 100%;
    object-fit: scale-down;
    width: auto;
}

.keyboard .keyboard-row .keyboard-key .label {
    font-size: 15px;
    margin: 0px 0px 0px 0px;
    text-transform: none;
}
</style>

<script>
export const Keyboard = {
    name: "keyboard",
    props: {
        keys: {
            type: Array,
            required: true
        },
        singleChoice: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            activeKeys: []
        };
    },
    computed: {
        parsedKeys() {
            return this.keys.map(row =>
                row.map(key => {
                    return typeof key === "string"
                        ? { type: "alphanumeric", name: key, value: key }
                        : key;
                })
            );
        }
    },
    methods: {
        keyPressed(key) {
            let activeKeys = this.activeKeys.slice(0);
            const index = activeKeys.indexOf(key.name);
            if (index > -1) {
                activeKeys.splice(index, 1);
            } else if (this.singleChoice) {
                activeKeys = [key.name];
            } else {
                activeKeys.push(key.name);
            }
            this.activeKeys = activeKeys;
            this.$emit("key-pressed", key);
        },
        keyType(key) {
            return key.type || "special";
        },
        keyImage(key) {
            return key.image || require("./assets/key-" + key.name + ".svg");
        },
        isActive(key) {
            return this.activeKeys.includes(key.name);
        },
        reset(keys) {
            this.activeKeys = keys || [];
        }
    }
};

export default Keyboard;
</script>
