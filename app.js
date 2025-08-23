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

function myFunction() {
    var x = document.getElementById("links");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content');
    sections.forEach(section => {
        section.classList.remove('active');
    });
            
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
            
    // Show the selected section
    document.getElementById(sectionId).classList.add('active');
            
    // Add active class to the clicked button
    event.target.classList.add('active');
}

async function loadArticles(endpoint = '/json/update.json') {
  const container = document.getElementById('articles-container');
  
  try {
    const posts = await fetch(endpoint).then(r => r.ok ? r.json() : Promise.reject(r));
    
    if (!Array.isArray(posts) || !posts.length) {
      container.innerHTML = '<div class="empty">No articles available</div>';
      return;
    }
    
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    posts.forEach(p => {
      if (!p) return;
      
      const article = document.createElement('article');
      article.setAttribute('data-time', p.timestamp || '');
      
      const userDiv = document.createElement('div');
      userDiv.className = 'status_username';
      const username = document.createElement('h3');
      username.textContent = p.username || 'Anonymous'; // Safe - uses textContent
      userDiv.appendChild(username);
      
      const content = document.createElement('p');
      content.className = 'status_content';
      content.textContent = p.content || ''; // Safe - uses textContent
      
      article.append(userDiv, content);
      fragment.appendChild(article);
    });
    
    container.appendChild(fragment);
    
  } catch (error) {
    console.error('Failed to load:', error);
    container.innerHTML = '<div class="error">Failed to load articles</div>';
  }
}

loadArticles();

document.addEventListener('DOMContentLoaded', function() {
    const footerText = document.querySelector('.footer');
    const currentYear = new Date().getFullYear();
    footerText.textContent = `copyright CC BY-SA 4.0 adamngshrine ~ 2023 - ${currentYear}`;
});