<template>
    <div class="reference-size">
        <h3 class="title">{{ "ripe_commons.size.size" | locale }}</h3>
        <div class="size-selector">
            <div class="genders" v-show="modelGenders && modelGenders.length > 1">
                <div
                    class="button button-gender"
                    v-bind:class="{ active: modelGender === visibleGender }"
                    v-for="modelGender in modelGenders"
                    v-bind:key="modelGender"
                    v-on:click="__changeGender(modelGender)"
                >
                    {{ modelGender | locale }}
                </div>
            </div>
            <div
                class="sizes-container"
                v-bind:class="{ multiple: modelGenders && modelGenders.length > 1 }"
                v-if="sizesLoaded"
            >
                <div class="scales">
                    <div
                        class="button button-scale"
                        v-bind:class="{ active: modelScale === visibleScale }"
                        v-for="modelScale in __getAvailableScales(visibleGender)"
                        v-bind:key="modelScale"
                        v-on:click="scale = modelScale"
                    >
                        {{ modelScale | locale }}
                    </div>
                </div>
                <div
                    class="sizes"
                    v-for="modelScale in __getAvailableScales(visibleGender)"
                    v-show="modelScale === visibleScale"
                    v-bind:key="modelScale"
                >
                    <div
                        class="button button-size"
                        v-bind:class="{
                            active: __isSelected(visibleGender, modelScale, sizeObject.native)
                        }"
                        v-for="sizeObject in sizeOptions[visibleGender][modelScale]"
                        v-bind:key="sizeObject.native"
                        v-on:click="
                            () => __sizeSelected(visibleGender, modelScale, sizeObject.native)
                        "
                    >
                        {{ sizeObject.locale }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.reference-size > .size-selector {
    margin-bottom: 40px;
}

.reference-size > .size-selector .sizes-container.multiple {
    border: 1px solid #e9eaee;
    border-bottom-left-radius: 24px;
    border-bottom-right-radius: 24px;
    border-top: 0px;
    padding: 46px 40px 40px 40px;
}

.reference-size > .size-selector .genders {
    border-bottom: 1px solid #e9eaee;
    font-size: 0px;
    height: 70px;
}

.reference-size > .size-selector .genders .button.button-gender {
    background-color: #f5f5f5;
    border: 1px solid transparent;
    border-bottom-color: #e9eaee;
    display: inline-block;
    font-size: 15px;
    height: 55px;
    line-height: 70px;
    text-transform: uppercase;
    vertical-align: bottom;
    width: calc(50% - 2px);
}

.reference-size > .size-selector .genders .button.button-gender:first-child {
    border-top-left-radius: 8px;
}

.reference-size > .size-selector .genders .button.button-gender:last-child {
    border-top-right-radius: 8px;
}

.reference-size > .size-selector .genders .button.button-gender.active,
.reference-size > .size-selector .genders .button.button-gender:active {
    background-color: #ffffff;
    border-color: #e9eaee #e9eaee transparent #e9eaee;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    height: 70px;
    line-height: 100px;
}

.reference-size > .size-selector .sizes-container {
    font-size: 0px;
    padding: 32px 0px 0px 0px;
    position: relative;
    text-align: center;
}

.reference-size > .size-selector .sizes-container .scales {
    font-size: 0px;
}

.reference-size > .size-selector .sizes-container .scales .button.button-scale {
    color: #9299a3;
    cursor: pointer;
    display: inline-block;
    font-size: 15px;
    height: 50px;
    letter-spacing: 0.5px;
    margin: 0px 10px 0px 10px;
    min-width: 50px;
    text-transform: uppercase;
}

.reference-size > .size-selector .sizes-container .scales .button.button-scale:last-child {
    margin-right: 0px;
}

.reference-size > .size-selector .sizes-container .scales .button.button-scale.active {
    color: #000000;
    font-weight: 900;
}

.reference-size > .size-selector .sizes-container .sizes {
    display: inline-block;
    font-size: 0px;
    margin-top: 10px;
    max-width: 492px;
    text-align: left;
}

.reference-size > .size-selector .sizes-container .sizes.fade-enter,
.reference-size > .size-selector .sizes-container .sizes.fade-enter-active {
    left: 0px;
    margin: auto auto auto auto;
    margin-top: 10px;
    position: absolute;
    right: 0px;
    transition-delay: 0.25s;
    transition-duration: 0.25s;
}

.reference-size > .size-selector .sizes .button.button-size {
    border: 1px solid #e5e5e5;
    border-radius: 4px 4px 4px 4px;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-block;
    font-size: 25px;
    height: 62px;
    line-height: 60px;
    margin: 0px 10px 8px 10px;
    min-width: 60px;
    overflow: hidden;
    padding: 0px 6px 0px 6px;
    text-align: center;
    text-overflow: ellipsis;
    vertical-align: top;
    white-space: nowrap;
}

.reference-size > .size-selector .sizes .button.button-size.active,
.reference-size > .size-selector .sizes .button.button-size:active {
    background-color: #e5e5e5;
}

.reference-size > .size-selector .sizes .button.button-size:last-child {
    margin-right: 0px;
}
</style>

<script>
import formInterface from "./interface.js";

export const Reference = {
    name: "reference",
    mixins: [formInterface],
    props: {
        referenceScale: {
            type: String,
            default: "it"
        }
    },
    data: function() {
        return {
            sizes: {},
            sizeOptions: {},
            gender: "",
            scale: "",
            size: null,
            sizesLoaded: false
        };
    },
    computed: {
        state() {
            return {
                scale: this.scale,
                gender: this.gender,
                size: this.size,
                visibleScale: this.scale,
                visibleSize: this.__convertSize(this.gender, this.scale, this.size)
            };
        },
        modelGenders() {
            return Object.keys(this.sizeOptions);
        },
        allowApply() {
            return this.size && this.scale && this.gender;
        },
        visibleGender() {
            return this.gender || this.modelGenders[0];
        },
        visibleScale() {
            return this.scale || this.__getAvailableScales(this.visibleGender)[0];
        }
    },
    watch: {
        state: {
            handler: function() {
                this.$emit("changed", this);
            },
            deep: true
        },
        sizesLoaded: {
            handler: function(value) {
                const event = value ? "enable_size" : "disable_size";
                this.$bus.trigger(event);
            },
            immediate: true
        },
        gender: function(gender) {
            const scales = this.__getAvailableScales(this.gender);
            if (scales.includes(this.scale) === false) {
                this.scale = "";
            }
        }
    },
    created: async function() {
        this.sizes = await this.__getSizes({
            config: this.config,
            allowedGenders: this.$store.state.allowedGenders
        });
        this.__showSizes();
    },
    methods: {
        reset() {
            this.setState({});
        },
        setState(state) {
            this.gender = state.gender;
            this.scale = state.scale;
            this.size = state.size;
        },
        getState() {
            return this.state;
        },
        getSizeText() {
            if (!this.gender || !this.scale || !this.size) {
                return "";
            }
            return (
                this.__convertSize(this.gender, this.scale, this.size) +
                " " +
                this.locale(this.scale).toUpperCase() +
                "/" +
                this.locale("ripe_commons.size." + this.gender + ".small").toUpperCase()
            );
        },
        __getSizes(options) {
            return new Promise((resolve, reject) => {
                // obtains the current options configuration value and
                // in case there're no available sizes raises a rejection
                // for upper stream promise
                const config = options.config;
                if (!config.sizes) {
                    reject(new Error("No sizes available for config"));
                    return;
                }

                // iterates through the config size scales and retrieves
                // their sizes if the scale has been defined as available
                // (to be shown to the user has a selection option)
                const sizes = {};
                for (const key in config.sizes) {
                    // splits the (full) scale into its (base) scale and gender
                    // components to be used to set the complete in a canonical way
                    // an example of such scale splitting would be the separation
                    // of "std:clothing:female" into scale "std:clothing" and gender "female"
                    const scale = key.substring(0, key.lastIndexOf(":"));
                    const gender = key.substring(key.lastIndexOf(":") + 1, key.length);

                    // updates the sizes map for the gender and scale according to
                    // the provided (full) scale key value
                    sizes[gender] = sizes[gender] || {};
                    sizes[gender][scale] = config.sizes[key];
                }
                resolve(sizes);
            });
        },
        async __showSizes() {
            const sizeOptions = {};
            const sizeValues = [];
            const scales = [];
            const values = [];
            const genders = [];

            this.sizesLoaded = false;

            for (const gender in this.sizes) {
                const genderScales = this.sizes[gender];
                for (const scale in genderScales) {
                    const sizes = genderScales[scale] || [];
                    for (const size of sizes) {
                        scales.push(scale);
                        values.push(size);
                        genders.push(gender);
                        sizeValues.push({
                            scale: scale,
                            gender: gender,
                            size: size
                        });
                    }
                }
            }

            values.forEach((value, index) => {
                const size = sizeValues[index];
                const genderSizes = sizeOptions[size.gender] || {};
                const scaleSizes = genderSizes[size.scale] || {};
                const scaleSize = scaleSizes[size.size] || {};
                scaleSize.native = value;
                scaleSizes[size.size] = scaleSize;
                genderSizes[size.scale] = scaleSizes;
                sizeOptions[size.gender] = genderSizes;
            });

            const sizePromise = this.$ripe
                .nativeToSizeBP(scales, values, genders)
                .then(response => {
                    response.forEach((value, index) => {
                        const size = sizeValues[index];
                        const genderSizes = sizeOptions[size.gender] || {};
                        const scaleSizes = genderSizes[size.scale] || {};
                        const scaleSize = scaleSizes[size.size] || {};
                        scaleSize.size = value.value;
                        scaleSizes[size.size] = scaleSize;
                        genderSizes[size.scale] = scaleSizes;
                        sizeOptions[size.gender] = genderSizes;
                    });
                });

            const localePromise = this.$ripe
                .nativeToLocaleBP(scales, values, genders)
                .then(response => {
                    response.forEach((value, index) => {
                        const size = sizeValues[index];
                        const genderSizes = sizeOptions[size.gender] || {};
                        const scaleSizes = genderSizes[size.scale] || {};
                        const scaleSize = scaleSizes[size.size] || {};
                        scaleSize.locale = value.value;
                        scaleSizes[size.size] = scaleSize;
                        genderSizes[size.scale] = scaleSizes;
                        sizeOptions[size.gender] = genderSizes;
                    });
                });

            await Promise.all([sizePromise, localePromise]);

            this.sizeOptions = sizeOptions;
            this.sizesLoaded = true;
        },
        __getAvailableScales(gender) {
            const sizes = this.sizeOptions[gender] || {};
            return Object.keys(sizes);
        },
        __sizeSelected(gender, scale, size) {
            this.gender = gender;
            this.scale = scale;
            this.size = size;
        },
        __isSelected(gender, scale, size) {
            return this.gender === gender && this.scale === scale && this.size === parseInt(size);
        },
        __convertSize(gender, scale, size) {
            if (!(this.sizeOptions && gender && scale && size)) {
                return "";
            }
            const sizes = this.sizeOptions[gender][scale];
            const sizeM = sizes[String(size)];
            if (!sizeM) return "";
            return sizeM.locale;
        },
        __changeGender(gender) {
            // updates the internal setting for the gender (effective change)
            this.gender = gender;

            // verifies if the size is already ready for selection (all values are set)
            // if not there's not remaining to be done
            const isReady = this.gender && this.scale && this.size;
            if (!isReady) return;

            // in case there's so size available for the scale in the new gender
            // then we must "reset" the size, avoiding possible errors
            const hasSize = Boolean(this.sizeOptions[this.gender][this.scale][String(this.size)]);
            if (!hasSize) this.size = null;
        }
    }
};

export default Reference;
</script>
