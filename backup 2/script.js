$(document).ready(function() {
    console.log("Script loaded - Debug Mode Active");
    console.log("Icons found on load:", $(".desktop-icon").length);

    /* --- Configuration & State --- */
    const LOGIN_ANSWER = "2015"; 
    const BIRTH_YEAR = 1995; 
    const GIFT_PASSWORD = (((BIRTH_YEAR - 10) * 2) + 55).toString();
    
    // Icons Configuration
    const CUSTOM_BASE = "https://raw.githubusercontent.com/Amne-Dev/WinXP-CDN/main";
    const WIN98_BASE = "https://win98icons.alexmeub.com/icons/png";

    const ICON_MAP = {
        // Desktop & System
        // ID 16: My Computer
        computer: { 
            custom: "Icons/16_My_Computer/123_size48.png", 
            fallback: `${WIN98_BASE}/computer_explorer-5.png` 
        },
        // ID 32: Empty Recycle Bin
        recycle: { 
            custom: "Icons/32_Empty_Recycle_Bin/264_size48.png", 
            fallback: `${WIN98_BASE}/recycle_bin_empty-4.png` 
        },
        
        // Files & Folders
        // ID 4: Closed Folder
        folder: { 
            custom: "Icons/4_Closed_Folder/23_size48.png", 
            fallback: `${WIN98_BASE}/directory_closed-4.png` 
        },
        // ID 54: Compressed Folder (Zip)
        zip: { 
            custom: "Icons/54_Icon_53/376_size48.png", 
            fallback: `${WIN98_BASE}/directory_zipped-0.png` 
        },
        // ID 3: Executable (Good for Python scripts)
        py: { 
            custom: "Icons/3_Executable/14_size32.png", 
            fallback: `${WIN98_BASE}/batch_file-0.png` 
        },
        
        // Text Files (ID 70 was missing from the list, so we use ID 1 'Unknown' or fallback)
        txt: { 
            custom: "Icons/156_Icon_155/541_size48.png", 
            fallback: `${WIN98_BASE}/notepad_file-2.png` 
        },
        
        // Fonts Folder
        fonts: {
            custom: "Icons/39_Font_Folder/295_size48.png",
            fallback: `${WIN98_BASE}/directory_open_file_mydocs-0.png`
        },
        
        // Default
        default: { 
            custom: "Icons/1_Unknown_File_(Standard)/11_size48.png", 
            fallback: `${WIN98_BASE}/file_lines-0.png` 
        }
    };

    function getIconHtml(type, alt, className = "") {
        const iconData = ICON_MAP[type] || ICON_MAP.default;
        const customUrl = `${CUSTOM_BASE}/${iconData.custom}`;
        const fallbackUrl = iconData.fallback;
    
        return `
            <img src="${customUrl}" 
                 alt="${alt}" 
                 class="${className}"
                 onerror="this.onerror=null; this.src='${fallbackUrl}';"
            >
        `;
    }

    function getIconUrl(type) {
        // defaults to 'default' if type not found
        const iconData = ICON_MAP[type] || ICON_MAP.default;
        // Return the custom CDN URL
        return `${CUSTOM_BASE}/${iconData.custom}`;
    }

    // Initialize Desktop Icons
    function initDesktopIcons() {
        $("#icon-computer img").replaceWith(getIconHtml("computer", "My Computer"));
        $("#icon-welcome img").replaceWith(getIconHtml("txt", "Welcome.txt"));
        $("#icon-fixme img").replaceWith(getIconHtml("py", "fix_me.py"));
        $("#icon-gift img").replaceWith(getIconHtml("zip", "Gift.zip"));
    }
    initDesktopIcons();

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
            { name: "Fonts", type: "font", icon: "fonts" }
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
    let openWindows = []; // Track open windows for taskbar

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
        
        // Update taskbar state
        openWindows.forEach(win => {
            win.active = (win.id === id);
        });
        renderTaskbar();
    }

    // Taskbar Logic
    function renderTaskbar() {
        const $taskbar = $("#taskbar-items");
        $taskbar.empty();

        openWindows.forEach(win => {
            const iconUrl = getIconUrl(win.type);
            const activeClass = win.active ? "active" : "";
            
            const $btn = $(`
                <div class="taskbar-item ${activeClass}" title="${win.title}">
                    <img src="${iconUrl}">
                    <span>${win.title}</span>
                </div>
            `);

            $btn.click(function() {
                if (win.active && !win.minimized) {
                    // Minimize
                    $("#" + win.id).hide();
                    win.minimized = true;
                    win.active = false;
                    $(".window-container").removeClass("active-window");
                } else {
                    // Restore / Focus
                    $("#" + win.id).show();
                    win.minimized = false;
                    setWindowFocus(win.id);
                }
                renderTaskbar();
            });

            $taskbar.append($btn);
        });
    }

    function registerWindow(id, title, type) {
        // Check if already registered
        const existing = openWindows.find(w => w.id === id);
        if (!existing) {
            openWindows.push({ id, title, type, minimized: false, active: true });
            renderTaskbar();
        }
    }

    function unregisterWindow(id) {
        openWindows = openWindows.filter(w => w.id !== id);
        renderTaskbar();
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
            console.log("Login Successful");
            
            // Explicitly hide login screen to prevent click blocking
            $("#login-screen").fadeOut(500, function() {
                console.log("Login screen hidden");
                $(this).css("display", "none"); // Strict removal
                $("#desktop").fadeIn(500);
                playStartupSound();
                
                // Open Welcome Mission Brief
                console.log("Attempting to open Welcome.txt");
                setTimeout(() => {
                    const welcomeText = "MISSION BRIEFING:\n\nHappy Birthday! Your gift is currently locked in the 'Gift.zip' archive.\n\nTo access it, you must complete the following tasks:\n\n1. [COMPLETED] Log in to the system.\n2. [PENDING] The system drivers are corrupted. Open 'fix_me.py' and fix the code to unlock the File Explorer.\n3. [PENDING] Search the file system for the 'riddle.txt' file. It contains the equation for the password.\n4. [PENDING] Solve the riddle and unlock 'Gift.zip'.\n\nGood luck!";
                    createNotepadWindow("Welcome.txt - Notepad", welcomeText);
                }, 500);
            });
        } else {
            console.log("Login Failed");
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
    
    // Run Script Button Handler (Global Delegation)
    $(document).on("click", ".run-script-btn", function() {
        console.log("Run Script button clicked (Delegated)");
        const $win = $(this).closest(".window-container");
        const id = $win.attr("id");
        const currentCode = $win.find("textarea").val();
        
        if (typeof runFixScript === "function") {
            runFixScript(currentCode, id);
        } else {
            console.error("runFixScript function not found!");
        }
    });

    $(document).on("dblclick", ".desktop-icon", function() {
        console.log("Icon double-clicked:", $(this).attr("id"));
        const type = $(this).attr("data-type");
        console.log("Icon type:", type);
        
        if ($(this).hasClass("disabled")) {
            console.log("Icon is disabled");
            return;
        }

        handleIconClick(type);
    });

    function handleIconClick(type) {
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
    }


    /* --- Step 2: The Corrupted Script Logic --- */

    // Run Script Logic (Attached dynamically in createNotepadWindow)
    window.runFixScript = function(code, windowId) {
        console.log("Running fix script...");
        // Target: if status == "broken":
        const regex = /if\s+status\s*==\s*['"]broken['"]\s*:/;

        if (regex.test(code)) {
            console.log("Script fixed successfully");
            
            // 1. UNLOCK FIRST (Critical Game Logic)
            $("#icon-computer").removeClass("disabled");
            closeWindow(windowId);
            
            // 2. THEN SHOW DIALOG (UI Logic)
            try {
                showXPDialog("System Update", "System Drivers Updated.\nFile Explorer Unlocked.", "info");
            } catch (e) {
                console.error("Dialog failed, but game continues:", e);
            }
        } else {
            console.log("Script fix failed");
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

    // Helper for Icons
    function getFileIcon(item) {
        if (item.type === "drive") return "computer"; // Use computer icon for drive for now, or map drive to computer
        if (item.type === "folder") return "folder";
        if (item.name.endsWith(".py")) return "py";
        if (item.name.endsWith(".zip")) return "zip";
        if (item.icon && ICON_MAP[item.icon]) return item.icon;
        return "default";
    }

    // Navigation Logic
    window.navigateExplorer = function(path) {
        console.log("Navigating to:", path);
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
            const iconType = getFileIcon(item);
            const iconHtml = getIconHtml(iconType, item.name);

            const $el = $(`
                <div class="file-item">
                    ${iconHtml}
                    <span>${item.name}</span>
                </div>
            `);

            $el.dblclick(function() {
                console.log("Explorer item double-clicked:", item.name);
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
        console.log("Creating Notepad Window:", title);
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
                        ${isScript ? '<div class="menubar-item run-script-btn" style="margin-left: auto; font-weight: bold; color: green; cursor: pointer;">▶ Run Script</div>' : ''}
                    </div>
                    <textarea class="notepad-content">${content}</textarea>
                </div>
            </div>
        `);

        $("#desktop").append($win);
        $win.addClass("window-visible").show(); // Explicitly show the window
        setupWindow($win, id);
        
        // Register to taskbar
        const iconType = isScript ? "py" : "txt";
        registerWindow(id, title, iconType);
    };

    window.createWordPadWindow = function(title, content) {
        console.log("Creating WordPad Window:", title);
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
        $win.addClass("window-visible").show();
        setupWindow($win, id);
        
        // Register to taskbar
        registerWindow(id, title, "doc");
    };

    window.createWinZipWindow = function() {
        console.log("Creating WinZip Window");
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
                        ${getIconHtml("zip", "Zip Icon", "winzip-icon")}
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
        $win.addClass("window-visible").show();
        setupWindow($win, id);
        
        // Register to taskbar
        registerWindow(id, "WinZip Self-Extractor - Gift.zip", "zip");

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
        console.log("Showing Dialog:", title);
        const id = "dialog-" + Date.now();
        
        // Use the helper to get the URL
        // Map 'error' to 'recycle' or 'computer' if you don't have a specific error icon
        // For now, mapping 'error' to 'recycle' and 'info' to 'computer' as placeholders if not in map
        let mappedType = iconType;
        if (iconType === 'error') mappedType = 'recycle'; 
        if (iconType === 'info') mappedType = 'computer';
        
        const iconUrl = getIconUrl(mappedType);
        
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
                    <img src="${iconUrl}" class="xp-dialog-icon" onerror="this.onerror=null; this.src='https://win98icons.alexmeub.com/icons/png/msg_error-0.png';">
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
        console.log("Opening Window:", id);
        $("#" + id).addClass("window-visible").show();
        setWindowFocus(id);

        // Register static windows
        if (id === "window-explorer") {
            registerWindow(id, "My Computer", "computer");
        } else if (id === "window-media") {
            registerWindow(id, "Windows Media Player", "computer"); // Using computer icon as placeholder
        }
    };

    window.closeWindow = function(id) {
        console.log("Closing Window:", id);
        $("#" + id).removeClass("window-visible").hide();
        unregisterWindow(id); // Remove from taskbar

        if(id === 'window-media') {
            const iframe = $("#window-media iframe");
            const src = iframe.attr("src");
            iframe.attr("src", "");
            iframe.attr("src", src);
        }
    };

});
