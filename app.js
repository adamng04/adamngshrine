document.addEventListener('DOMContentLoaded', function() {
    const footerText = document.querySelector('.footer');
    const currentYear = new Date().getFullYear();
    footerText.textContent = `copyright CC BY-SA 4.0 adamngshrine ~ 2023 - ${currentYear}`;
});
//thanks vision, and free websites
/**
 * Format the relative time between the given Date and the current time.
 * @param {Date} date 
 * @returns {String}
 */
function formatRelativeTimestamp(date) {
    let delta = Math.floor((date.valueOf() - Date.now()) / 1000);
    let absDelta = Math.abs(delta);

    let totalMins = Math.floor(absDelta / 60);
    let hrs = Math.floor(totalMins / 60);
    let mins = totalMins % 60;

    if (absDelta < 60) {
        /* < 1 minute: "Just now" (past) or "Right now" (future) */
        return (delta < 0 ? "Just" : "Right") + " now";
    } else if (absDelta < 3600) {
        /* < 1 hour: "X minute(s)" */
        return (
            mins + " minute" + (mins === 1 ? "" : "s")
            + (delta < 0 ? " ago" : " from now")
        );
    } else if (absDelta < (24 * 3600)) {
        /* < 1 day: "X hour(s)" */
        return (
            hrs + " hour" + (hrs === 1 ? "" : "s")
            + (delta < 0 ? " ago" : " from now")
        );
    } else if (absDelta < (48 * 3600)) {
        /* between one and two days: "Yesterday" or "Tomorrow" */
        return (
            ((delta < 0) ? "Yesterday" : "Tomorrow")
            + " at "
            + new Intl.DateTimeFormat(undefined, {
                timeStyle: "short"
            }).format(date)
        );
    } else {
        /* more than two days: explicit date and time */
        let dateStr = new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
        }).format(date);

        let timeStr = new Intl.DateTimeFormat(undefined, {
            timeStyle: "short"
        }).format(date);

        return dateStr + ", " + timeStr;
    }
}

addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        $("article").each((i, elem) => {
            elem = $(elem);

            let ts = parseInt(elem.data("time"), 10);
            if (ts) {
                if (ts < 1e12) {
                    ts *= 1000;
                }

                let tsElem = elem.children(".status_time")[0];
                if (!tsElem) {
                    tsElem = document.createElement("div");
                    tsElem.className = "status_time";
                    elem.children(".status_username").after(tsElem);
                }

                $(tsElem).text(formatRelativeTimestamp(new Date(ts))).show();
            }
        });
    }, 1000);
});


function play(){
    let audio = document.getElementById("audio");
    audio.play();
}

function button(){
    let reisen = document.getElementById("reisen");
    reisen.play();
}
window.addEventListener('load', () => {
    const imageInput = window.document.querySelector('input[type="image"]')
    imageInput.addEventListener('click', () => {
        button()
    })
})
