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

window.addEventListener("load", () => {
    clock();
    function clock() {
      const today = new Date();
  
      // get time components
      const hours = today.getHours();
      const minutes = today.getMinutes();
      const seconds = today.getSeconds();
  
      //add '0' to hour, minute & second when they are less 10
      const hour = hours < 10 ? "0" + hours : hours;
      const minute = minutes < 10 ? "0" + minutes : minutes;
      const second = seconds < 10 ? "0" + seconds : seconds;
  
      //make clock a 12-hour time clock
      const hourTime = hour > 12 ? hour - 12 : hour;
  
      // if (hour === 0) {
      //   hour = 12;
      // }
      //assigning 'am' or 'pm' to indicate time of the day
      const ampm = hour < 12 ? "AM" : "PM";
  
      // get date components
      const month = today.getMonth();
      const year = today.getFullYear();
      const day = today.getDate();
  
      //declaring a list of all months in  a year
      const monthList = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
  
      //get current date and time
      const date = monthList[month] + " " + day + ", " + year;
      const time = hourTime + ":" + minute + ":" + second + ampm;
  
      //combine current date and time
      const dateTime = date + " - " + time;
  
      //print current date and time to the DOM
      document.getElementById("date-time").innerHTML = dateTime;
      setTimeout(clock, 1000);
    }
});
// https://dev.to/dboatengx/build-a-real-time-changing-digital-clock-using-html-css-javascript-689
function updateClock() {
    const gmtTime = new Date().toUTCString();
    const cetTime = new Date().toLocaleString('nl-NL', {timeZone: 'Europe/Berlin'});
    const estTime = new Date().toLocaleString('nl-NL', {timeZone: 'America/New_York'});

    document.getElementById('gmt').innerHTML = gmtTime;
    document.getElementById('cet').innerHTML = cetTime;
    document.getElementById('est').innerHTML = estTime;
}

setInterval(updateClock, 1000);

// Variables
var player;

// YouTube API callback function
function onYouTubeIframeAPIReady() {
  // Create the YouTube player
  player = new YT.Player('player', {
    videoId: 'BHOevX4DlGk',
    events: {
      'onReady': onPlayerReady
    }
  });
}

// Function called when the player is ready
function onPlayerReady(event) {
  event.target.setVolume(20);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
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

// https://www.shecodes.io/athena/6402-world-clock-with-javascript-and-html-css
document.addEventListener('DOMContentLoaded', function() {
    const footerText = document.querySelector('.footer');
    const currentYear = new Date().getFullYear();
    footerText.textContent = `copyright CC BY-SA 4.0 adamngshrine ~ 2023 - ${currentYear}`;
});