$(document).ready(function() {
    console.log("Script loaded");

    /* --- Configuration & State --- */
    const LOGIN_ANSWER = "2015"; 
    const BIRTH_YEAR = 1995; 
    const GIFT_PASSWORD = (((BIRTH_YEAR - 10) * 2) + 55).toString();
    
    // Icons Configuration
    const ICONS = {
        drive: "https://win98icons.alexmeub.com/icons/png/hard_disk_drive-0.png",
        folder: "https://win98icons.alexmeub.com/icons/png/directory_closed-4.png",
        txt: "https://win98icons.alexmeub.com/icons/png/notepad-5.png",
        exe: "https://win98icons.alexmeub.com/icons/png/executable-0.png",
        doc: "https://win98icons.alexmeub.com/icons/png/write_wordpad-1.png",
        ie: "https://win98icons.alexmeub.com/icons/png/msie1-0.png",
        solitaire: "https://win98icons.alexmeub.com/icons/png/solitaire-0.png",
        shutdown: "https://win98icons.alexmeub.com/icons/png/shut_down_cool-0.png",
        zip: "https://win98icons.alexmeub.com/icons/png/directory_zippered-0.png",
        error: "https://win98icons.alexmeub.com/icons/png/msg_error-0.png",
        info: "https://win98icons.alexmeub.com/icons/png/msg_information-0.png"
    };

    // File System Data Structure
    const fileSystem = {
        "root": [
            { name: "C:", type: "drive" }
        ],
        "C:": [
            { name: "Users", type: "folder" },
            { name: "Windows", type: "folder" },
            { name: "Program Files", type: "folder" }
        ],
        "C:/Windows": [
            { name: "System32", type: "folder" },
            { name: "Fonts", type: "folder" }
        ],
        "C:/Users": [
            { name: "Friend", type: "folder" },
            { name: "Public", type: "folder" }
        ],
        "C:/Users/Friend": [
            { name: "Documents", type: "folder" },
            { name: "Pictures", type: "folder" }
        ],
        "C:/Users/Friend/Documents": [
            { name: "Old_Projects", type: "folder" },
            { name: "Resume.doc", type: "file", icon: "doc", content: "RESUME\n\nName: Birthday User\nExperience: Being Awesome (1995-Present)\nSkills: Solving Riddles, Opening Zips" },
            { name: "Notes.doc", type: "file", icon: "doc", content: "To Do:\n1. Buy groceries\n2. Fix the computer\n3. Celebrate birthday" }
        ],
        "C:/Users/Friend/Documents/Old_Projects": [
            { name: "Top_Secret", type: "folder" },
            { name: "Website_v1", type: "folder" }
        ],
        "C:/Users/Friend/Documents/Old_Projects/Top_Secret": [
            { name: "riddle.txt", type: "file", icon: "txt", content: `RIDDLE:\n\nThe password is the answer to:\n((${BIRTH_YEAR} - 10) * 2) + 55` }
        ]
    };

    let currentPath = "root";
    
    /* --- Initialization --- */
    
    // Make windows draggable
    $(".window-container").draggable({
        handle: ".title-bar",
        containment: "#desktop",
        stack: ".window-container",
        start: function() {
             setWindowFocus($(this).attr("id"));
        }
    });

    // Make icons draggable
    $(".desktop-icon").draggable({
        containment: "#desktop",
        grid: [20, 20]
    });

    // Window Focus Logic
    function setWindowFocus(id) {
        $(".window-container").removeClass("active-window");
        $("#" + id).addClass("active-window");
    }

    // Define updateClock BEFORE calling it
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        $("#clock").text(`${hours}:${minutes} ${ampm}`);
    }

    // Start Clock
    setInterval(updateClock, 1000);
    updateClock();


    /* --- Step 1: Login Screen --- */
    $("#login-btn").click(function() {
        console.log("Login clicked");
        checkLogin();
    });
    
    $("#login-input").keypress(function(e) {
        if(e.which == 13) {
            console.log("Login enter pressed");
            checkLogin();
        }
    });

    function checkLogin() {
        const answer = $("#login-input").val().trim();
        if (answer === LOGIN_ANSWER) {
            // Explicitly hide login screen to prevent click blocking
            $("#login-screen").fadeOut(500, function() {
                $(this).hide(); // Ensure display: none
                $("#desktop").fadeIn(500);
                playStartupSound();
                
                // Open Welcome Mission Brief
                setTimeout(() => {
                    const welcomeText = "MISSION BRIEFING:\n\nHappy Birthday! Your gift is currently locked in the 'Gift.zip' archive.\n\nTo access it, you must complete the following tasks:\n\n1. [COMPLETED] Log in to the system.\n2. [PENDING] The system drivers are corrupted. Open 'fix_me.py' and fix the code to unlock the File Explorer.\n3. [PENDING] Search the file system for the 'riddle.txt' file. It contains the equation for the password.\n4. [PENDING] Solve the riddle and unlock 'Gift.zip'.\n\nGood luck!";
                    createNotepadWindow("Welcome.txt - Notepad", welcomeText);
                }, 500);
            });
        } else {
            showXPDialog("Login Error", "User Access Denied.\nHint: Try " + LOGIN_ANSWER, "error");
            $("#login-input").val("");
        }
    }

    function playStartupSound() {
        const audio = document.getElementById("startup-sound");
        if (audio) {
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Audio autoplay blocked:", e));
        }
    }


    /* --- Desktop Interaction (Event Delegation) --- */
    
    $(document).on("dblclick", ".desktop-icon", function() {
        const type = $(this).data("type");
        
        if ($(this).hasClass("disabled")) return;

        switch(type) {
            case "computer":
                openWindow("window-explorer");
                navigateExplorer("root");
                break;
            case "welcome":
                const welcomeText = "MISSION BRIEFING:\n\nHappy Birthday! Your gift is currently locked in the 'Gift.zip' archive.\n\nTo access it, you must complete the following tasks:\n\n1. [COMPLETED] Log in to the system.\n2. [PENDING] The system drivers are corrupted. Open 'fix_me.py' and fix the code to unlock the File Explorer.\n3. [PENDING] Search the file system for the 'riddle.txt' file. It contains the equation for the password.\n4. [PENDING] Solve the riddle and unlock 'Gift.zip'.\n\nGood luck!";
                createNotepadWindow("Welcome.txt - Notepad", welcomeText);
                break;
            case "fixme":
                const brokenCode = "def init_drivers():\n    status = \"broken\"\n    # TODO: Fix the syntax below to unlock system\n    if status = \"broken\"\n        return True";
                createNotepadWindow("fix_me.py - Notepad", brokenCode, true);
                break;
            case "gift":
                createWinZipWindow();
                break;
            default:
                console.log("Unknown icon type:", type);
        }
    });


    /* --- Step 2: The Corrupted Script Logic --- */

    // Run Script Logic (Attached dynamically in createNotepadWindow)
    window.runFixScript = function(code, windowId) {
        // Target: if status == "broken":
        const regex = /if\s+status\s*==\s*['"]broken['"]\s*:/;

        if (regex.test(code)) {
            showXPDialog("System Update", "System Drivers Updated.\nFile Explorer Unlocked.", "info");
            closeWindow(windowId);
            
            // Unlock My Computer
            $("#icon-computer").removeClass("disabled");
        } else {
            showXPDialog("Syntax Error", "Line 3 invalid.\n- Check comparison operator (==)\n- Check for colon (:)");
        }
    };


    /* --- Step 3: The Scavenger Hunt (File Explorer) --- */
    
    // Back Button Logic
    $("#explorer-back").click(function() {
        if (currentPath === "root") return;
        
        if (currentPath === "C:") {
            navigateExplorer("root");
        } else {
            const lastSlashIndex = currentPath.lastIndexOf("/");
            if (lastSlashIndex !== -1) {
                navigateExplorer(currentPath.substring(0, lastSlashIndex));
            } else {
                navigateExplorer("root");
            }
        }
    });

    // Address Bar Logic
    $("#explorer-address").keypress(function(e) {
        if(e.which == 13) {
            let path = $(this).val().trim();
            let targetPath = path;
            if (path === "My Computer") targetPath = "root";
            targetPath = targetPath.replace(/\\/g, "/");

            if (fileSystem[targetPath]) {
                navigateExplorer(targetPath);
            } else {
                showXPDialog("Explorer", "Path not found.", "error");
            }
        }
    });

    // Navigation Logic
    window.navigateExplorer = function(path) {
        currentPath = path;
        const content = fileSystem[path] || [];
        const $view = $("#explorer-view");
        $view.empty();

        // Update Address Bar & Back Button
        const displayPath = path === "root" ? "My Computer" : path;
        $("#explorer-address").val(displayPath);
        $("#explorer-back").prop("disabled", path === "root");

        // Render Items
        content.forEach(item => {
            let iconUrl = "";
            if (item.type === "drive") iconUrl = ICONS.drive;
            else if (item.type === "folder") iconUrl = ICONS.folder;
            else if (item.icon && ICONS[item.icon]) iconUrl = ICONS[item.icon];
            else iconUrl = ICONS.exe; // Default

            const $el = $(`
                <div class="file-item">
                    <img src="${iconUrl}">
                    <span>${item.name}</span>
                </div>
            `);

            $el.dblclick(function() {
                if (item.type === "folder" || item.type === "drive") {
                    const newPath = path === "root" ? item.name : path + "/" + item.name;
                    navigateExplorer(newPath);
                } else if (item.type === "file") {
                    if (item.name.endsWith(".txt")) {
                        createNotepadWindow(item.name + " - Notepad", item.content || "");
                    } else if (item.name.endsWith(".doc")) {
                        createWordPadWindow(item.name + " - WordPad", item.content || "");
                    }
                }
            });

            $view.append($el);
        });
    };


    /* --- Dynamic Window Creation --- */

    window.createNotepadWindow = function(title, content, isScript = false) {
        const id = "window-" + Date.now();
        const $win = $(`
            <div class="window-container window" id="${id}" style="top: 100px; left: 150px; width: 500px;">
                <div class="title-bar">
                    <div class="title-bar-text">${title}</div>
                    <div class="title-bar-controls">
                        <button aria-label="Close" class="close-btn"></button>
                    </div>
                </div>
                <div class="window-body" style="padding: 0; display: flex; flex-direction: column; height: 300px;">
                    <div class="menubar">
                        <div class="menubar-item">File</div>
                        <div class="menubar-item">Edit</div>
                        <div class="menubar-item">Format</div>
                        <div class="menubar-item">View</div>
                        <div class="menubar-item">Help</div>
                        ${isScript ? '<div class="menubar-item" style="margin-left: auto; font-weight: bold; color: green; cursor: pointer;" class="run-script-btn">▶ Run Script</div>' : ''}
                    </div>
                    <textarea class="notepad-content">${content}</textarea>
                </div>
            </div>
        `);

        $("#desktop").append($win);
        setupWindow($win, id);

        if (isScript) {
            $win.find(".menubar-item:last-child").click(function() {
                const currentCode = $win.find("textarea").val();
                runFixScript(currentCode, id);
            });
        }
    };

    window.createWordPadWindow = function(title, content) {
        const id = "window-" + Date.now();
        const $win = $(`
            <div class="window-container window" id="${id}" style="top: 120px; left: 180px; width: 550px;">
                <div class="title-bar">
                    <div class="title-bar-text">${title}</div>
                    <div class="title-bar-controls">
                        <button aria-label="Close" class="close-btn"></button>
                    </div>
                </div>
                <div class="window-body" style="padding: 0; display: flex; flex-direction: column; height: 350px;">
                    <div class="menubar">
                        <div class="menubar-item">File</div>
                        <div class="menubar-item">Edit</div>
                        <div class="menubar-item">View</div>
                        <div class="menubar-item">Insert</div>
                        <div class="menubar-item">Format</div>
                        <div class="menubar-item">Help</div>
                    </div>
                    <div class="wordpad-toolbar">
                        <button class="toolbar-btn"><b>B</b></button>
                        <button class="toolbar-btn"><i>I</i></button>
                        <button class="toolbar-btn"><u>U</u></button>
                    </div>
                    <div class="wordpad-content" contenteditable="true">${content.replace(/\n/g, "<br>")}</div>
                </div>
            </div>
        `);

        $("#desktop").append($win);
        setupWindow($win, id);
    };

    window.createWinZipWindow = function() {
        const id = "window-winzip";
        if ($("#" + id).length) {
            openWindow(id);
            return;
        }

        const $win = $(`
            <div class="window-container window" id="${id}" style="top: 200px; left: 400px; width: 350px;">
                <div class="title-bar">
                    <div class="title-bar-text">WinZip Self-Extractor - Gift.zip</div>
                    <div class="title-bar-controls">
                        <button aria-label="Close" class="close-btn"></button>
                    </div>
                </div>
                <div class="winzip-body">
                    <div>
                        <img src="${ICONS.zip}" class="winzip-icon">
                        <p>Enter password to extract <b>Gift.zip</b> to the specified folder.</p>
                    </div>
                    <div class="winzip-controls">
                        <label>Password:</label>
                        <input type="password" id="winzip-password-input" style="width: 100%;">
                    </div>
                    <div class="winzip-buttons">
                        <button id="winzip-extract-btn">Extract</button>
                        <button class="close-btn">Cancel</button>
                    </div>
                </div>
            </div>
        `);

        $("#desktop").append($win);
        setupWindow($win, id);

        $win.find("#winzip-extract-btn").click(function() {
            const input = $("#winzip-password-input").val().trim();
            if (input === GIFT_PASSWORD) {
                closeWindow(id);
                openWindow("window-media");
            } else {
                showXPDialog("WinZip", "Invalid Password", "error");
            }
        });
    };

    /* --- Global Dialog System --- */
    window.showXPDialog = function(title, message, iconType) {
        const id = "dialog-" + Date.now();
        const iconUrl = iconType === 'error' ? ICONS.error : ICONS.info;
        
        // Play error sound if needed
        if (iconType === 'error') {
            // Placeholder for error sound logic
            // const audio = new Audio('assets/error.mp3');
            // audio.play().catch(e => {});
        }

        const $dialog = $(`
            <div class="xp-dialog" id="${id}">
                <div class="title-bar">
                    <div class="title-bar-text">${title}</div>
                    <div class="title-bar-controls">
                        <button aria-label="Close" onclick="$('#${id}').remove()"></button>
                    </div>
                </div>
                <div class="xp-dialog-body">
                    <img src="${iconUrl}" class="xp-dialog-icon">
                    <div class="xp-dialog-message">${message.replace(/\n/g, "<br>")}</div>
                </div>
                <div class="xp-dialog-footer">
                    <button class="xp-dialog-btn" onclick="$('#${id}').remove()">OK</button>
                </div>
            </div>
        `);

        $("body").append($dialog);
        
        // Make draggable
        $dialog.draggable({
            handle: ".title-bar",
            containment: "body"
        });
    };

    function setupWindow($win, id) {
        $win.draggable({
            handle: ".title-bar",
            containment: "#desktop",
            stack: ".window-container",
            start: function() {
                setWindowFocus(id);
            }
        });

        $win.mousedown(function() {
            setWindowFocus(id);
        });

        $win.find(".close-btn").click(function() {
            closeWindow(id);
            if (id.startsWith("window-") && !["window-explorer", "window-media", "window-winzip"].includes(id)) {
                $win.remove(); // Remove dynamic windows from DOM on close
            }
        });

        setWindowFocus(id);
    }


    /* --- Start Menu Logic --- */
    $(".start-button").click(function(e) {
        e.stopPropagation();
        $("#start-menu").toggle();
        $(this).toggleClass("active");
    });

    $(document).click(function(e) {
        if (!$(e.target).closest("#start-menu").length && !$(e.target).closest(".start-button").length) {
            $("#start-menu").hide();
            $(".start-button").removeClass("active");
        }
    });

    window.logOff = function() {
        location.reload();
    };


    /* --- Global Window Management --- */
    
    window.openWindow = function(id) {
        $("#" + id).show();
        setWindowFocus(id);
    };

    window.closeWindow = function(id) {
        $("#" + id).hide();
        if(id === 'window-media') {
            const iframe = $("#window-media iframe");
            const src = iframe.attr("src");
            iframe.attr("src", "");
            iframe.attr("src", src);
        }
    };

});
