<script>
import Reference from "./reference.vue";

export const ReferenceMulti = {
    name: "reference-multi",
    extends: Reference,
    props: {
        availableScales: {
            type: Array,
            default: () => ["it", "uk", "us", "jp", "ch"]
        }
    },
    methods: {
        __getSizes(options) {
            return new Promise((resolve, reject) => {
                // unpacks the current model configuration to be used for
                // the size retrieval according to locales
                const config = options.config;

                // in case there are no sizes available for configuration
                // then raises an error as such situation is considered to
                // be an abnormal one
                if (!config.sizes) {
                    reject(new Error("No sizes available for config"));
                    return;
                }

                // iterates through the config size scales and retrieves
                // their sizes if the scale has been defined as available
                // (to be shown to the user has a selection option)
                const sizes = {};
                for (const key in config.sizes) {
                    const scale = key.substring(0, key.lastIndexOf(":"));
                    const gender = key.substring(key.lastIndexOf(":") + 1, key.length);

                    // verifies if the current gender in iteration is allowed
                    // within the set of allowed genders (in case one is defined)
                    const isAllowed = options.genders ? options.genders.includes(gender) : true;
                    if (!isAllowed) continue;

                    sizes[gender] = sizes[gender] || {};
                    sizes[gender][scale] = config.sizes[key];
                }

                // checks if any of the available scales has not been
                // defined and if not uses the sizes from the reference
                // scale for them
                for (const gender in sizes) {
                    const genderSizes = sizes[gender];
                    const scales = Object.keys(genderSizes);
                    for (const key of this.availableScales) {
                        if (scales.includes(key)) {
                            continue;
                        }
                        const referenceSizes = genderSizes[this.referenceScale];
                        genderSizes[key] = referenceSizes;
                    }
                    sizes[gender] = genderSizes;
                }
                resolve(sizes);
            });
        }
    }
};

export default ReferenceMulti;
</script>
