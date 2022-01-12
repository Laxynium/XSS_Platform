const verifyXss = async(levelToken) => {
    const response = await fetch("verify", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            payload: window.location.href.replace(window.location.origin, ""),
            levelToken: levelToken,
        }),
    });
    return response.json();
};
(() => {
    let currentLevelToken = null;
    window.addEventListener("message", (event) => {
        if (event.data.type === "level") {
            console.log("Received message from level 4");
            const { number, token } = event.data.level;
            if (number === 4) {
                currentLevelToken = token;
            }
        }
    });

    const originalAlert = window.alert;
    window.alert = () => {
        setTimeout(() => {
            verifyXss(currentLevelToken)
                .then((nextLevelToken) => {
                    if (!nextLevelToken.validationResult) {
                        console.log("Verification has failed");
                        return;
                    }
                    originalAlert("Success");
                    parent.postMessage("success", "*");
                })
                .catch((e) => {
                    console.log("Verification has failed", e);
                });
        }, 1500);
    };
})();