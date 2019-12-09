<template>
    <div>
        <p
            v-bind:data-group="group"
            class="initials-input"
            v-bind:class="{ active: group === activeGroup }"
            v-for="group in groups"
            v-bind:key="group"
            ref="initialsInputs"
            v-on:click="inputSelected(group)"
        >
            {{ initialsText(group) }}
        </p>
        <div class="initials-labels">
            <p
                v-bind:data-group="group"
                class="initials-label"
                v-bind:class="{ active: group === activeGroup }"
                v-for="group in groups"
                v-bind:key="group"
                v-on:click="inputSelected(group)"
            >
                {{ groupLabel(group) }}
            </p>
        </div>
    </div>
</template>

<style scoped>
.initials-input {
    border-bottom: 1px solid #d0d0d0;
    font-size: 25px;
    height: 40px;
    letter-spacing: 5px;
    line-height: 40px;
    margin: 0px auto 0px auto;
    text-transform: uppercase;
    transition: border-bottom-color 0.25s ease-in-out;
    vertical-align: top;
    width: 200px;
}

.initials-input.active {
    border-bottom: 1px solid #2d2d2d;
}

.initials-labels {
    font-size: 0px;
}

.initials-labels .initials-label {
    color: #9b9b9b;
    cursor: pointer;
    font-size: 15px;
    margin: 30px 0px 30px 0px;
    user-select: none;
    vertical-align: top;
}
</style>

<script>
export const initialsInputs = {
    props: {
        groups: {
            type: Array,
            default: () => []
        },
        activeGroup: {
            type: String,
            default: null
        },
        initialsText: {
            type: Function,
            default: null
        },
        groupLabel: {
            type: Function,
            default: function(group) {
                return this.locale(`ripe_commons.${this.brand}.personalization.label.${group}`);
            }
        }
    },
    methods: {
        inputSelected(group) {
            this.$emit("input-selected", group);
        }
    }
};

export default initialsInputs;
</script>
