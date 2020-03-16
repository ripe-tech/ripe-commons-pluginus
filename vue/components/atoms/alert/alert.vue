<template>
    <div class="alert" v-bind:style="alertStyle">
        <div class="alert-content">
            {{ message }}
        </div>
    </div>
</template>

<style scoped>
.alert {
    background-color: #151515;
    box-shadow: 0 8px 50px 0 #61679426;
    box-sizing: border-box;
    display: block;
    left: calc(50% - 127px);
    opacity: 0.8;
    padding: 23px 25px 23px 25px;
    pointer-events: none;
    position: absolute;
    text-align: center;
    top: calc(50% - 57px);
    transition: opacity 0.65s ease-in-out;
    user-select: none;
    width: 305px;
    z-index: 20;
}

.alert > .alert-content {
    color: #ffffff;
}
</style>

<script>
export const Alert = {
    name: "alert",
    props: {
        duration: {
            type: Number,
            default: 2000
        }
    },
    data: function() {
        return {
            message: null,
            alertOpacity: 0
        };
    },
    computed: {
        alertStyle() {
            const base = {};
            base.opacity = this.alertOpacity;
            return base;
        }
    },
    mounted: function() {
        this.$bus.bind("alert", this.showAlert);
    },
    methods: {
        showAlert(msg, duration) {
            this.message = msg;
            this.alertOpacity = 0.8;
            clearTimeout(this.notificationMessageTimeout);
            this.notificationMessageTimeout = setTimeout(() => {
                this.alertOpacity = 0;
            }, duration || this.duration);
        }
    }
};

export default Alert;
</script>
