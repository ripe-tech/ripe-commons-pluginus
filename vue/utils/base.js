export const getFavicon = function() {
    const link = document.getElementById("favicon");
    return link.href;
};

export const setFavicon = function(src) {
    const link = document.createElement("link");
    const oldLink = document.getElementById("favicon");
    link.id = "favicon";
    link.rel = "shortcut icon";
    link.href = src;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
};

export const waitP = async function(timeout) {
    await new Promise(resolve => {
        setTimeout(() => resolve(), timeout);
    });
};
