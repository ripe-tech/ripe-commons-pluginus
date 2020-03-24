<template>
    <div
        class="button button-no-style button-platforme"
        v-bind:class="{ loading: loading }"
        v-on:click="click"
    >
        <loader
            loader="ball-scale-multiple"
            class="loader"
            v-bind:loader-style="loaderStyle"
            v-show="loading"
        />
        <span class="button-logo" v-if="logo">
            <img src="~./assets/platforme_id.svg" v-show="!loading" />
        </span>
        <span class="button-text">{{ text }}</span>
    </div>
</template>

<style lang="scss" scoped>
@import "css/variables.scss";

.button.button-platforme {
    background-color: #151515;
    color: #ffffff;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    height: 44px;
    letter-spacing: 1.5px;
    line-height: 44px;
    max-width: 320px;
    text-align: center;
    transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
    width: 320px;
}

.button.button-platforme:hover {
    background-color: #151515;
    transform: scale(1.025, 1.025);
}

.button.button-platforme > span.button-logo {
    background-color: #151515;
    height: 44px;
    line-height: 42px;
    margin-right: 10px;
    text-align: center;
    width: 44px;
}

.button.button-platforme.loading > span.button-logo {
    opacity: 0.7;
}

.button.button-platforme > span.button-logo > img {
    height: 26px;
    vertical-align: middle;
}

.button.button-platforme > .loader {
    left: 35px;
    top: 32px;
    width: 0px;
}

.button.button-platforme > .loader ::v-deep > div {
    height: 40px;
    width: 40px;
}
</style>

<script>
export const ButtonPlatforme = {
    name: "button-platforme",
    props: {
        normalText: {
            type: String,
            default: "Sign in with Platforme ID"
        },
        loadingText: {
            type: String,
            default: "Signing in Platforme ID..."
        },
        logo: {
            type: Boolean,
            default: true
        },
        mode: {
            type: String,
            default: "loading"
        },
        loaderStyle: {
            type: Object,
            default: () => ({ "background-color": "$white" })
        }
    },
    data: function() {
        return {
            loading: false
        };
    },
    computed: {
        text() {
            return this.loading ? this.loadingText : this.normalText;
        }
    },
    methods: {
        click(event) {
            switch (this.mode) {
                case "loading":
                    this.loading = true;
                    break;
            }
            this.$emit("click", event);
        }
    }
};

export default ButtonPlatforme;
</script>
