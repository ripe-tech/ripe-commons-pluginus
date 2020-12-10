<template>
    <div
        class="pickers"
        v-bind:class="{ 'multiple-materials': multipleMaterials, loading: loading }"
        v-bind:data-part="activePart"
        v-bind:data-material="activeMaterial"
        v-bind:data-color="activeColor"
        ref="pickersContainer"
    >
        <div class="background" />
        <div class="parts-wrapper">
            <div
                class="button-scroll button-scroll-left button-scroll-parts button-scroll-parts-left"
                v-if="enableScrollParts"
                v-show="scrollParts"
                v-on:click="slideLeftParts"
            />
            <ul class="parts-container" ref="partsPicker">
                <slot name="before-buttons-parts">
                    <li
                        class="part button button-part button-before-buttons-parts"
                        v-bind:class="buttonPartsClasses(button)"
                        v-for="button in beforeButtonsParts"
                        v-bind:key="button.id"
                        v-on:click="onButtonPartClick(button.event, $event)"
                    >
                        <slot v-bind:name="`button-before-buttons-parts-${button.id}`">
                            <p class="label">
                                {{ button.label }}
                            </p>
                        </slot>
                    </li>
                </slot>
                <li
                    class="part button button-part"
                    v-bind:class="{
                        active: activePart === part,
                        optional: isOptional(part),
                        selected: selectedColor(part) && selectedColor(part).color
                    }"
                    v-bind:data-part="part"
                    v-for="(materials, part) in filteredOptions"
                    v-bind:key="part"
                    v-on:click="() => selectPart(part)"
                >
                    <p class="label">
                        {{ localeModel(part) }}
                    </p>
                    <div class="swatch" v-if="selectedColor(part) && selectedColor(part).color">
                        <img v-bind:src="partSwatch(part)" />
                    </div>
                    <p class="no-part" v-else-if="isOptional(part)">
                        {{ localeModel(part, "no_" + part) }}
                    </p>
                </li>
                <slot name="after-buttons-parts">
                    <li
                        class="part button button-part button-after-buttons-parts"
                        v-bind:class="buttonPartsClasses(button)"
                        v-for="button in afterButtonsParts"
                        v-bind:key="button.id"
                        v-on:click="onButtonPartClick(button.event, $event)"
                    >
                        <slot v-bind:name="`button-after-buttons-parts-${button.id}`">
                            <p class="label">
                                {{ button.label }}
                            </p>
                        </slot>
                    </li>
                </slot>
                <slot />
            </ul>
            <div
                class="button-scroll button-scroll-right button-scroll-parts button-scroll-parts-right"
                v-if="enableScrollParts"
                v-show="scrollParts"
                v-on:click="slideRightParts"
            />
        </div>
        <div class="materials-wrapper">
            <div
                class="button-scroll button-scroll-left button-scroll-materials button-scroll-materials-left"
                v-if="enableScrollMaterials"
                v-show="scrollMaterial"
                v-on:click="slideLeftMaterials"
            />
            <transition
                name="fade"
                v-on:after-enter="onMaterialsChanged"
                v-on:after-leave="onMaterialsChanged"
            >
                <ul
                    class="materials-container"
                    v-bind:class="{ hidden: !multipleMaterials && activeMaterial !== null }"
                    v-show="activePart !== null"
                    ref="materialsPicker"
                >
                    <li
                        class="material button button-material"
                        v-bind:class="{ active: activeMaterial === material }"
                        v-bind:data-material="material"
                        v-bind:data-part="activePart"
                        v-for="(colors, material) in materialOptions"
                        v-bind:key="material"
                        v-on:click="() => selectMaterial(material)"
                    >
                        <p>{{ localeModel(activePart, material) }}</p>
                    </li>
                </ul>
            </transition>
            <div
                class="button-scroll button-scroll-right button-scroll-materials button-scroll-materials-right"
                v-if="enableScrollMaterials"
                v-show="scrollMaterial"
                v-on:click="slideRightMaterials"
            />
        </div>
        <div class="colors-wrapper">
            <div
                class="button-scroll button-scroll-left button-scroll-colors button-scroll-colors-left"
                v-if="enableScrollColors"
                v-show="scrollColor"
                v-on:click="slideLeftColors"
            />
            <transition name="fade">
                <ul class="colors-container" v-show="activeMaterial !== null" ref="colorsPicker">
                    <transition-group name="list" ref="colorsList">
                        <li
                            class="color button button-color-option"
                            v-bind:data-index="colorOption.index"
                            v-bind:data-material="colorOption.material"
                            v-bind:data-part="activePart"
                            v-bind:data-color="colorOption.color"
                            v-bind:class="{
                                active: isSelected(colorOption),
                                optional: isOptional(activePart),
                                'no-option': colorOption.color.startsWith('no_')
                            }"
                            v-for="colorOption in colorOptions"
                            v-bind:key="colorOption.material + ':' + colorOption.color"
                            v-on:click="() => onColorClick(colorOption)"
                        >
                            <div class="swatch">
                                <img
                                    v-bind:src="
                                        colorSwatch(colorOption.material, colorOption.color)
                                    "
                                    v-if="colorOption.color.startsWith('no_') === false"
                                />
                                <div class="border" />
                            </div>
                            <p>{{ colorOptionText(colorOption) }}</p>
                        </li>
                    </transition-group>
                </ul>
            </transition>
            <div
                class="button-scroll button-scroll-right button-scroll-colors button-scroll-colors-right"
                v-if="enableScrollColors"
                v-show="scrollColor"
                v-on:click="slideRightColors"
            />
        </div>
        <restrictions-alert />
    </div>
</template>

<style scoped>
.pickers > .parts-wrapper {
    position: relative;
}

.pickers .parts-container > .part {
    cursor: pointer;
    display: inline-block;
    vertical-align: top;
}

.pickers .parts-container > .part.button-part.disabled {
    opacity: 0.4;
    pointer-events: none;
}

.pickers .parts-container > .part > .swatch {
    border-radius: 50% 50% 50% 50%;
    height: 22px;
    overflow: hidden;
    width: 22px;
}

.pickers .parts-container > .part > .swatch > img {
    height: 100%;
    object-fit: cover;
    vertical-align: top;
    width: 100%;
}

.pickers .parts-container > .part > .no-part {
    color: #4d545f;
    line-height: 18px;
    margin: 0px 0px 0px 0px;
}

.colors-wrapper {
    position: relative;
}

.pickers .colors-container {
    padding: 0px 0px 0px 0px;
}

.pickers .colors-container > span {
    display: block;
    height: 100%;
    padding: 0px 20px 0px 20px;
    white-space: nowrap;
}

.pickers .colors-container > span::-webkit-scrollbar {
    background: transparent;
    height: 0px;
}

.pickers .colors-container .color {
    cursor: pointer;
    display: inline-block;
    opacity: 1;
    position: relative;
    transition: opacity 0.1s ease-in-out;
    user-select: none;
    vertical-align: top;
    width: 100px;
}

.pickers .materials-wrapper {
    position: relative;
}

.pickers .materials-wrapper .materials-container.hidden {
    display: none;
}

.pickers.multiple-materials .colors-container .color[data-index="0"] {
    border-left: 1px solid #eaeaec;
    box-sizing: border-box;
    margin-left: 18px;
    padding-left: 36px;
    width: 118px;
}

.pickers.multiple-materials .colors-container .color[data-index="0"]:first-child {
    border-left-color: transparent;
    margin-left: 0px;
    padding: 0px 0px 0px 0px;
    width: 100px;
}

.pickers .colors-container .color.list-enter-active {
    opacity: 0;
    position: absolute;
}

.pickers .colors-container .color.list-leave-active {
    opacity: 0;
}

.pickers .colors-container .color > p {
    font-size: 14px;
    margin: 100px 0px 0px 0px;
    white-space: normal;
}

.pickers.multiple-materials .colors-container .color > p {
    margin-top: 80px;
}

.pickers.multiple-materials .colors-container .color.active > p {
    font-weight: 600;
}

.pickers.multiple-materials .colors-container .color[data-index="0"] > p {
    margin-left: -18px;
}

.pickers.multiple-materials .colors-container .color[data-index="0"]:first-child > p {
    margin-left: 0px;
}

.pickers .colors-container .color > .swatch {
    border: 2px solid #eaeaec;
    border-radius: 50% 50% 50% 50%;
    height: 58px;
    left: 0px;
    margin: 20px auto 0px auto;
    overflow: hidden;
    padding: 0px 0px 0px 0px;
    position: absolute;
    right: 0px;
    top: 0px;
    transform: scale(1, 1) translateZ(0);
    transition: transform 0.125s ease-in-out, border-width 0.125s ease-in-out;
    width: 58px;
    z-index: 1;
}

.pickers.multiple-materials .colors-container .color > .swatch {
    margin-top: 0px;
}

.pickers.multiple-materials .colors-container .color[data-index="0"] > .swatch {
    left: 18px;
}

.pickers.multiple-materials .colors-container .color:first-child > .swatch {
    left: 0px;
}

.pickers .colors-container .color:hover > .swatch,
.pickers .colors-container .color.active > .swatch {
    border-width: 0px;
    transform: scale(1.13, 1.13);
}

.pickers .colors-container .color.active.no-option > .swatch {
    border-width: 2px;
}

.pickers .colors-container .color > .swatch > img {
    height: 100%;
    object-fit: cover;
    width: 100%;
}

.pickers .colors-container .color > .swatch > .border {
    border: 0px solid #ffffff;
    border-radius: 50% 50% 50% 50%;
    bottom: 3px;
    left: 3px;
    position: absolute;
    right: 3px;
    top: 3px;
    transition: border-width 0.125s ease-in-out;
}

.pickers .colors-container .color:hover > .swatch > .border,
.pickers .colors-container .color.active > .swatch > .border {
    border-width: 4px;
}

.button-scroll {
    cursor: pointer;
    position: absolute;
    width: 40px;
    z-index: 1;
}

.button-scroll-right {
    background: url("~./assets/arrow-right.svg") right center no-repeat,
        linear-gradient(to left, #fafafa, rgba(255, 255, 255, 0));
    right: 0px;
    top: 0px;
}

.button-scroll-left {
    background: url("~./assets/arrow-left.svg") left center no-repeat,
        linear-gradient(to right, #fafafa, rgba(255, 255, 255, 0));
}

.button-scroll-parts {
    height: 42px;
}

.button-scroll-materials {
    background-color: transparent;
    height: 30px;
}

.button-scroll-right.button-scroll-materials {
    background: linear-gradient(to left, #fafafa, rgba(255, 255, 255, 0)) right center no-repeat;
}

.button-scroll-left.button-scroll-materials {
    background: linear-gradient(to right, #fafafa, rgba(255, 255, 255, 0)) left center no-repeat;
}

body.mobile .button-scroll-materials {
    height: 65px;
    width: 57px;
}

.button-scroll-colors {
    height: 100px;
}

.button-scroll-colors-left {
    left: 0px;
}

body.mobile .button-scroll-colors {
    height: 100px;
    width: 50px;
}

.restrictions_alert .message-restrictions_alert-container .message-restrictions_alert.visible {
    left: 0px;
    max-width: 55%;
    position: absolute;
    right: 0px;
    top: 90px;
    transform: translateY(0px);
    z-index: 2;
}
</style>

<script>
import { localeMixin } from "../../../mixins";

export const Pickers = {
    name: "pickers",
    mixins: [localeMixin],
    data: function() {
        return {
            activePart: null,
            activeMaterial: null,
            activeColor: null,
            multipleMaterials: false,
            loading: false,
            swatches: {},
            choices: {},
            /**
             * Whether the parts picker has a scroll.
             */
            scrollParts: false,
            /**
             * Whether the materials picker has a scroll.
             */
            scrollMaterial: false,
            /**
             * Whether the colors picker has a scroll.
             */
            scrollColor: false,
            /**
             * The currently centered part, material and
             * color, necessary to maintain the scroll
             * after a resize.
             */
            scrollCenterElements: {}
        };
    },
    props: {
        /**
         * Responsible for establishing if the app shows all colors or just
         * the colors of the selected material. 'False' will show all colors,
         * regardless of the material.
         */
        colorToggle: {
            type: Boolean,
            default: false
        },
        enableScrollParts: {
            type: Boolean,
            default: false
        },
        enableScrollMaterials: {
            type: Boolean,
            default: false
        },
        enableScrollColors: {
            type: Boolean,
            default: false
        },
        enableCenterParts: {
            type: Boolean,
            default: false
        },
        enableCenterMaterials: {
            type: Boolean,
            default: false
        },
        enableCenterScroll: {
            type: Boolean,
            default: false
        },
        beforeButtonsParts: {
            type: Array,
            default: () => []
        },
        afterButtonsParts: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        parts() {
            return this.$store.getters.getParts();
        },
        options() {
            return this.$store.state.options;
        },
        defaults() {
            return this.$store.state.defaults;
        },
        filteredOptions() {
            const choices = {};
            for (const [part, partValue] of Object.entries(this.choices)) {
                if (!partValue.available) continue;
                const materials = {};
                for (const [material, materialValue] of Object.entries(partValue.materials)) {
                    if (!materialValue.available) continue;
                    const colors = [];
                    for (const [color, colorValue] of Object.entries(materialValue.colors)) {
                        if (!colorValue.available) continue;
                        colors.push(color);
                    }
                    if (Object.keys(colors).length === 0) continue;
                    materials[material] = colors;
                }
                if (Object.keys(materials).length === 0) continue;
                choices[part] = materials;
            }
            return choices;
        },
        materialOptions() {
            return this.activePart ? this.filteredOptions[this.activePart] || {} : {};
        },
        colorOptions() {
            if (!this.activeMaterial) {
                return {};
            } else if (this.multipleMaterials === false || this.colorToggle === true) {
                return this.materialColors(this.activeMaterial);
            } else {
                return this.partColors(this.activePart);
            }
        },
        currentColor() {
            return this.parts[this.activePart] || {};
        },
        sync() {
            return this.$store.state.sync || {};
        }
    },
    watch: {
        parts() {
            this.updateSwatches();
        },
        options() {
            this.updateSwatches();
            const parts = Object.keys(this.options);
            this.activePart = parts[0];
            for (const part of parts) {
                const materials = this.options[part];
                if (Object.keys(materials).length > 1) {
                    this.multipleMaterials = true;
                    return;
                }
            }
            this.multipleMaterials = false;
        },
        activePart(part, oldPart) {
            if (!part) {
                return;
            }
            const current = this.parts[this.activePart];
            const materials = Object.keys(this.materialOptions);
            const materialSelected = current && current.material;
            const material = materialSelected ? current.material : materials[0];
            this.selectMaterial(material, false);
        },
        activeMaterial(material) {
            const current = this.parts[this.activePart];
            if (current && material === current.material) {
                this.activeColor = current.color;
            }
        }
    },
    mounted: function() {
        window.addEventListener("resize", () => {
            this.updateScrollFlags();
            this.maintainPartsCentered();
            this.maintainMaterialsCentered();
            this.maintainColorsCentered();
        });

        this.$store.watch(this.$store.getters.getParts, parts => {
            const current = parts[this.activePart];
            if (current && (!this.activeMaterial || this.activeMaterial === current.material)) {
                this.activeMaterial = current.material;
                this.activeColor = current.color;
            }
        });
        this.$bus.bind("pre_config", () => {
            this.loading = true;
            this.activePart = null;
            this.activeMaterial = null;
            this.activeColor = null;
            this.$forceUpdate();
        });
        this.$bus.bind("post_config", () => {
            this.loading = false;
        });
        this.$bus.bind("locale_changed", () => {
            this.$forceUpdate();
        });
        this.$bus.bind("locale_map_changed", () => {
            this.$forceUpdate();
        });
        this.$bus.bind("choices", choices => {
            this.choices = choices;
            this.$forceUpdate();
        });
        this.$bus.bind("selected_part", part => {
            this.activePart = part;
        });

        const colorsPicker = this.$refs.colorsPicker;
        colorsPicker.addEventListener("touchstart", () => colorsPicker.classList.add("drag"));
        colorsPicker.addEventListener("touchend", () => colorsPicker.classList.remove("drag"));
        colorsPicker.addEventListener("touchcancel", () => colorsPicker.classList.remove("drag"));
        const scrollElement = colorsPicker.querySelector("span");
        scrollElement.addEventListener(
            "scroll",
            () => {
                if (colorsPicker.classList.contains("drag") === false) {
                    return false;
                }
                const colorButtons = scrollElement.querySelectorAll(".button-color-option");
                let centerColor = null;
                const maxOffset = scrollElement.scrollWidth - scrollElement.clientWidth;
                let targetOffset = scrollElement.scrollLeft + scrollElement.clientWidth / 2;
                targetOffset = scrollElement.scrollLeft === 0 ? 0 : targetOffset;
                targetOffset = targetOffset >= maxOffset ? maxOffset : targetOffset;
                let offset = null;
                for (const color of colorButtons) {
                    const colorOffset = Math.abs(targetOffset - color.offsetLeft);
                    if (centerColor === null || colorOffset < offset) {
                        centerColor = color;
                        offset = colorOffset;
                    } else if (colorOffset > offset) {
                        break;
                    }
                }
                if (centerColor === null) {
                    return;
                }
                const material = centerColor.getAttribute("data-material");
                this.selectMaterial(material, false);
                this.scrollMaterials(material);
            },
            false
        );
    },
    methods: {
        updateScrollFlags() {
            this.scrollParts =
                this.$refs.partsPicker.scrollWidth > this.$refs.partsPicker.clientWidth;
            this.scrollMaterial =
                this.$refs.materialsPicker.scrollWidth > this.$refs.materialsPicker.clientWidth;
            this.scrollColor =
                this.$refs.colorsPicker.scrollWidth > this.$refs.colorsPicker.clientWidth;
        },
        maintainPartsCentered() {
            const centeredPart = this.scrollCenterElements.part;
            if (!centeredPart || !this.enableCenterScroll) return;
            const partsPicker = this.$refs.partsPicker;
            const parts = partsPicker.querySelectorAll(".button-part");
            this.centerElement(partsPicker, parts, "part", centeredPart);
        },
        maintainMaterialsCentered() {
            const centeredMaterial = this.scrollCenterElements.material;
            if (!centeredMaterial || !this.enableCenterScroll) return;
            const materialsPicker = this.$refs.materialsPicker;
            const materials = materialsPicker.querySelectorAll(".button-part");
            this.centerElement(materialsPicker, materials, "material", centeredMaterial);
        },
        maintainColorsCentered() {
            const centeredColor = this.scrollCenterElements.color;
            if (!centeredColor || !this.enableCenterScroll) return;
            const colorsPicker = this.$refs.colorsPicker;
            const colors = colorsPicker.querySelectorAll(".button-color-option");
            this.centerElement(colorsPicker, colors, "color", centeredColor);
        },
        /**
         * Scrolls in the right direction to show the next element that is still not fully visible.
         *
         * @param {Element} container the HTML element representing the container that the elements are in
         * @param {NodeList} elements An array representing the elements.
         */
        slideRight(container, elements) {
            const scrollLeft = container.scrollLeft;
            let combinedWidth = 0;
            for (const _element of elements) {
                const style = getComputedStyle(_element);
                const marginLeft = parseFloat(style.marginLeft);
                const marginRight = parseFloat(style.marginRight);
                const elementWidth = _element.offsetWidth + marginLeft + marginRight;
                if (combinedWidth + elementWidth > scrollLeft) {
                    combinedWidth += elementWidth;
                    break;
                }
                combinedWidth += elementWidth;
            }
            container.scrollLeft = combinedWidth;
        },
        slideRightCentered(container, elements, valueLabel) {
            // calculates the width of the container without the padding
            // allowing for precise calculations to center the elements
            const containerStyle = getComputedStyle(container);
            const paddingRight = parseFloat(containerStyle.paddingRight);
            const paddingLeft = parseFloat(containerStyle.paddingLeft);
            const containerWidth = container.offsetWidth - paddingRight - paddingLeft;

            const scrollLeft = container.scrollLeft;
            const containerCenter = scrollLeft + containerWidth / 2;

            let combinedWidth = 0;
            let scroll = 0;
            for (const _element of elements) {
                const style = getComputedStyle(_element);
                const marginLeft = parseFloat(style.marginLeft);
                const marginRight = parseFloat(style.marginRight);
                const elementWidth = _element.offsetWidth + marginLeft + marginRight;

                // if the element middle is after the middle of the container, it is
                // the next element, so its center will be positioned at the middle
                // of the container element
                if (Math.floor(combinedWidth + elementWidth / 2) > containerCenter) {
                    combinedWidth += elementWidth / 2;
                    scroll += combinedWidth - containerCenter;
                    this.scrollCenterElements[valueLabel] = _element.dataset[valueLabel];
                    break;
                }

                combinedWidth += elementWidth;
            }
            container.scrollLeft += scroll;
        },
        /**
         * Scrolls in the left direction to show the next element that is
         * still not fully visible.
         *
         * @param {Element} container the HTML element representing the container
         * that the elements are in.
         * @param {NodeList} elements An array representing the elements.
         */
        slideLeft(container, elements) {
            const scrollLeft = container.scrollLeft;
            let combinedWidth = 0;
            for (const _element of elements) {
                const style = getComputedStyle(_element);
                const marginLeft = parseFloat(style.marginLeft);
                const marginRight = parseFloat(style.marginRight);
                const elementWidth = _element.offsetWidth + marginLeft + marginRight;
                if (combinedWidth + elementWidth >= scrollLeft) {
                    break;
                }
                combinedWidth += elementWidth;
            }
            container.scrollLeft = combinedWidth;
        },
        slideLeftCentered(container, elements, valueLabel) {
            // calculates the width of the container without the padding
            // allowing for precise calculations to center the elements
            const containerStyle = getComputedStyle(container);
            const paddingRight = parseFloat(containerStyle.paddingRight);
            const paddingLeft = parseFloat(containerStyle.paddingLeft);
            const containerWidth = container.offsetWidth - paddingRight - paddingLeft;

            const scrollLeft = container.scrollLeft;
            const containerCenter = scrollLeft + containerWidth / 2;

            let combinedWidth = 0;
            let scroll = 0;
            let previousElementWidth = 0;
            for (const [index, _element] of elements.entries()) {
                const style = getComputedStyle(_element);
                const marginLeft = parseFloat(style.marginLeft);
                const marginRight = parseFloat(style.marginRight);
                const elementWidth = _element.offsetWidth + marginLeft + marginRight;

                // if the element middle is after the middle of the container, the
                // previous element is the center of the container, so it is necessary
                // to substract half of the previous element width to center it in the
                // container
                if (Math.floor(combinedWidth + elementWidth / 2) >= containerCenter) {
                    scroll += containerCenter - (combinedWidth - previousElementWidth / 2);
                    this.scrollCenterElements[valueLabel] = elements[index - 1].dataset[valueLabel];
                    break;
                }

                combinedWidth += elementWidth;
                previousElementWidth = elementWidth;
            }
            container.scrollLeft -= scroll;
        },
        slideLeftParts() {
            const partsPicker = this.$refs.partsPicker;
            const parts = partsPicker.querySelectorAll(".button-part");
            if (this.enableCenterScroll) return this.slideLeftCentered(partsPicker, parts, "part");
            return this.slideLeft(partsPicker, parts);
        },
        slideLeftMaterials() {
            const materialsPicker = this.$refs.materialsPicker;
            const materials = materialsPicker.querySelectorAll(".button-material");
            if (this.enableCenterScroll)
                { return this.slideLeftCentered(materialsPicker, materials, "material"); }
            return this.slideLeft(materialsPicker, materials);
        },
        slideLeftColors() {
            const colorsPicker = this.$refs.colorsPicker;
            const colors = colorsPicker.querySelectorAll(".button-color-option");
            if (this.enableCenterScroll)
                { return this.slideLeftCentered(colorsPicker, colors, "color"); }
            return this.slideLeft(colorsPicker, colors);
        },
        slideRightParts() {
            const partsPicker = this.$refs.partsPicker;
            const parts = partsPicker.querySelectorAll(".button-part");
            if (this.enableCenterScroll) return this.slideRightCentered(partsPicker, parts, "part");
            return this.slideRight(partsPicker, parts);
        },
        slideRightMaterials() {
            const materialsPicker = this.$refs.materialsPicker;
            const materials = materialsPicker.querySelectorAll(".button-material");
            if (this.enableCenterScroll) {
                return this.slideRightCentered(materialsPicker, materials, "material");
            }
            return this.slideRight(materialsPicker, materials);
        },
        slideRightColors() {
            const colorsPicker = this.$refs.colorsPicker;
            const colors = colorsPicker.querySelectorAll(".button-color-option");
            if (this.enableCenterScroll)
                { return this.slideRightCentered(colorsPicker, colors, "color"); }
            return this.slideRight(colorsPicker, colors);
        },
        configName(part) {
            return part.split("_").join(" ");
        },
        getColorSwatchURL(material, color) {
            return this.$ripe._getSwatchURL({ material, color });
        },
        getPartSwatchURL(part) {
            const currentPart = this.parts[part] || {};
            return this.getColorSwatchURL(currentPart.material, currentPart.color);
        },
        colorSwatch(material, color) {
            return this.swatches[`${material}:${color}`];
        },
        partSwatch(part) {
            return this.swatches[part];
        },
        isOptional(part) {
            const defaultPart = this.defaults[part] || {};
            return Boolean(defaultPart.optional);
        },
        colorOptionText(colorOption) {
            const optional = this.isOptional(this.activePart);

            if (
                optional &&
                (colorOption.material.startsWith("no_") || colorOption.color.startsWith("no_"))
            ) {
                return this.localeModel(this.activePart, "no_" + this.activePart);
            }

            return this.localeModel(this.activePart, colorOption.material, colorOption.color);
        },
        selectedColor(part = null) {
            part = part || this.part;
            return this.parts[part];
        },
        isSelected(colorOption) {
            return (
                (!this.currentColor.color && colorOption.color.startsWith("no_")) ||
                (this.currentColor.material === colorOption.material &&
                    this.currentColor.color === colorOption.color)
            );
        },
        updateSwatches() {
            const swatches = {};
            for (const part in this.options) {
                swatches[part] = this.getPartSwatchURL(part);
                const materials = this.options[part];
                for (const material in materials) {
                    const colors = materials[material];
                    for (const color of colors) {
                        swatches[`${material}:${color}`] = this.getColorSwatchURL(material, color);
                    }
                }
            }
            this.swatches = swatches;
        },
        selectPart(part, center = true) {
            this.activePart = part;
            this.$bus.trigger("picker_part", part);
            this.$bus.trigger("highlight_part", part);
            this.onMaterialsChanged();
            this.onColorsChanged();
            if (center) this.centerParts();
        },
        selectSwatch() {
            const removeOptional = this.activeColor.startsWith("no_");
            const material = removeOptional ? null : this.activeMaterial;
            const color = removeOptional ? null : this.activeColor;

            // triggers both the action to change the part on the current model
            // and the action to run a lowlight on the part (hide mask)
            this.$bus.trigger("part_change", this.activePart, material, color);
            this.$bus.trigger("lowlight_part", this.activePart, material, color);

            // runs the update swatches operation so that they are properly updated
            // in according to the swatches selection
            this.updateSwatches();
            this.isOptional(this.activePart) && this.$nextTick(() => this.$forceUpdate());
        },
        partColors(part) {
            const colors = [];
            const partColors = this.filteredOptions[part];
            const isOptional = this.isOptional(part);
            for (const material in partColors) {
                const materialColors = partColors[material];
                let index = 0;
                for (const color of materialColors) {
                    colors.push({
                        material: material,
                        color: color,
                        index: index
                    });
                    index++;
                }
                isOptional &&
                    colors.push({
                        material: "no_" + part,
                        color: "no_" + part,
                        index: index
                    });
            }
            return colors;
        },
        materialColors(material) {
            const colors = [];
            let index = 0;
            const materialColors = this.materialOptions[material] || [];
            for (const color of materialColors) {
                colors.push({
                    material: material,
                    color: color,
                    index: index
                });
                index++;
            }
            this.isOptional(this.activePart) &&
                colors.push({
                    material: material,
                    color: "no_" + this.activePart,
                    index: index
                });
            return colors;
        },
        /**
         * Scrolls the current picker's materials container to the target
         * material defined as string, optionally using a smooth based transition.
         *
         * @param {String} material The name of the material to scroll to.
         * @param {Boolean} smooth If the transition should be performed
         * using a smooth strategy.
         */
        scrollMaterials(material, smooth = true) {
            if (this.multipleMaterials === false || this.colorToggle === true) {
                return false;
            }
            const materialsPicker = this.$refs.materialsPicker;
            const materialButton = materialsPicker.querySelector(
                '.button-material[data-material="' + material + '"]'
            );
            materialsPicker.style.scrollBehavior = smooth ? null : "auto";
            materialsPicker.scrollLeft = materialButton
                ? materialButton.clientWidth / 2 +
                  materialButton.offsetLeft -
                  materialsPicker.clientWidth / 2
                : 0;
            materialsPicker.style.scrollBehavior = smooth ? "auto" : null;
        },
        centerElement(container, elements, valueLabel, expectedValue) {
            let scroll = 0;

            // iterates over the complete set of elements to compute the
            // amount of scroll required to be applied in the parent
            // container (sum of the complete with of elements)
            for (const _element of elements) {
                const style = getComputedStyle(_element);
                const marginLeft = parseFloat(style.marginLeft);
                const marginRight = parseFloat(style.marginRight);

                // centers the selected element in the middle of the container
                if (_element.dataset[valueLabel] === expectedValue) {
                    scroll += (_element.offsetWidth + marginLeft + marginRight) / 2;
                    break;
                }

                // increments the scroll value with the width of the component,
                // which is composed by both the offset width and the margins
                scroll += _element.offsetWidth + marginLeft + marginRight;
            }

            const padding = parseFloat(getComputedStyle(container).paddingLeft);
            const scrollableElementWidth = container.clientWidth - padding;

            container.scrollLeft = scroll - scrollableElementWidth / 2 + padding / 2;
        },
        centerParts() {
            if (!this.enableCenterParts) return;
            const partsPicker = this.$refs.partsPicker;
            const parts = partsPicker.querySelectorAll(".button-part");
            this.scrollCenterPart = this.activePart;
            this.centerElement(partsPicker, parts, "part", this.activePart);
        },
        centerMaterials() {
            if (!this.enableCenterMaterials) return;
            const materialsPicker = this.$refs.materialsPicker;
            const materials = materialsPicker.querySelectorAll(".button-material");
            this.scrollCenterMaterial = this.activeMaterial;
            this.centerElement(materialsPicker, materials, "material", this.activeMaterial);
        },
        /**
         * Centers the active color inside its scrollable container.
         */
        centerActiveColor() {
            const colorsPicker = this.$refs.colorsPicker;
            const scrollableElement = colorsPicker.querySelector("span");

            const part = this.parts[this.activePart];

            if (!part) return;

            if (part && part.material !== this.activeMaterial) {
                colorsPicker.scrollLeft = 0;
                return;
            }

            const colors = colorsPicker.querySelectorAll(".button-color-option");

            let scrollActiveColor = 0;
            for (const _color of colors) {
                // ignores all elements being transitioned out
                if (_color.dataset.material !== this.activeMaterial) {
                    continue;
                }

                const style = getComputedStyle(_color);
                const marginLeft = parseFloat(style.marginLeft);
                const marginRight = parseFloat(style.marginRight);
                if (_color.dataset.color === this.activeColor) {
                    scrollActiveColor += (_color.offsetWidth + marginLeft + marginRight) / 2;
                    break;
                }

                // offset width doesn't account for the margins, so we must sum them explicitly
                scrollActiveColor += _color.offsetWidth + marginLeft + marginRight;
            }

            const padding = parseFloat(getComputedStyle(scrollableElement).paddingLeft);
            const scrollableElementWidth = colorsPicker.clientWidth - padding;

            colorsPicker.scrollLeft = scrollActiveColor - scrollableElementWidth / 2 + padding / 2;
        },
        /**
         * Scrolls the color's container to the defined material and optionally
         * a specific color.
         *
         * If a smooth transition should be ensured for the scroll operation.
         *
         * @param {String} material The name of the material to scroll to.
         * @param {String} color The name of the color to scroll to.
         * @param {Boolean} smooth If the smooth transition should be ensured.
         */
        scrollColors(material, color, smooth = true) {
            if (this.multipleMaterials === false) {
                return false;
            }
            if (this.colorToggle) {
                this.centerActiveColor();
                return;
            }

            // gathers the reference to the proper colors picker and obtains
            // the references to the complete set of color elements
            const colorsPicker = this.$refs.colorsPicker;
            const colors = colorsPicker.querySelectorAll(".button-color-option");

            // initializes the counter of pixels for the (new) scroll left position
            // to be applied to the scroll element
            let scrollLeft = 0;

            // searches the selected material, summing the offsets until the requested
            // material (and optionally color) is found
            for (const _color of colors) {
                const style = getComputedStyle(_color);
                const marginLeft = parseFloat(style.marginLeft);
                const marginRight = parseFloat(style.marginRight);
                if (
                    _color.dataset.material === material &&
                    (!color || _color.dataset.color === color)
                ) {
                    if (_color.dataset.index === "0") {
                        scrollLeft += marginLeft;
                    }
                    break;
                }

                // offset width doesn't account for the margins, so we must sum them explicitly
                scrollLeft += _color.offsetWidth + marginLeft + marginRight;
            }
            const scrollElement = colorsPicker.querySelector("span");
            scrollElement.style.scrollBehavior = smooth === false ? "auto" : null;
            scrollElement.scrollLeft = scrollLeft;
            scrollElement.style.scrollBehavior = smooth === false ? null : "auto";
            return true;
        },
        selectMaterial(material, scroll = null, center = true) {
            scroll = scroll === null ? this.multipleMaterials : scroll;
            const materialChanged = this.activeMaterial !== material;
            this.activeMaterial = material;
            if (center) this.centerMaterials();
            if (scroll) {
                requestAnimationFrame(() => {
                    this.scrollMaterials(material);
                    if (this.colorToggle && materialChanged) {
                        this.scrollColors(material);
                    } else {
                        this.scrollColors(material);
                    }
                });
            }
        },
        buttonPartsClasses(button) {
            const base = {};
            if (button.disabled) base.disabled = button.disabled;
            if (button.id) base[`button-part-${button.id}`] = button.id;
            return base;
        },
        onColorClick(option) {
            if (this.isSelected(option)) return;
            this.selectMaterial(option.material);
            this.activeColor = option.color;
            this.scrollCenterColor = this.activeColor;
            this.selectSwatch();
        },
        onButtonPartClick(buttonEvent, event) {
            this.$emit(buttonEvent, event);
        },
        onMaterialsChanged() {
            this.scrollMaterials(this.activeMaterial, false);
            this.scrollColors(this.activeMaterial, null, false);
            this.updateScrollFlags();
        },
        onColorsChanged() {
            this.updateScrollFlags();
            requestAnimationFrame(() => {
                this.scrollMaterials(this.activeMaterial, false);
                this.scrollColors(this.activeMaterial, null, false);
                this.updateScrollFlags();
            });
        }
    }
};

export default Pickers;
</script>
