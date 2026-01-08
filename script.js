$(document).ready(function() {
    // Boot Screen Logic
    window.addEventListener('load', function() {
        const bootScreen = document.getElementById('boot-screen');
        const loginScreen = document.getElementById('login-screen'); // Ensure we target your login screen
        
        // Minimum wait time of 3 seconds for the "Experience"
        setTimeout(() => {
            bootScreen.classList.add('fade-out');
            
            // Remove from DOM after fade completes
            setTimeout(() => {
                bootScreen.style.display = 'none';
                // Optional: If your login screen was hidden by default, show it now
                if (loginScreen) loginScreen.style.display = 'flex';
            }, 500);
            
        }, 3000); 
    });

    console.log("Script loaded - Debug Mode Active");
    console.log("Icons found on load:", $(".desktop-icon").length);

    /* --- Configuration & State --- */
    const LOGIN_ANSWER = "Smile"; 
    const BIRTH_YEAR = 1995; 
    const GIFT_PASSWORD = "Age";
    
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
        
        // Word Doc
        doc: {
            custom: "Icons/155_Icon_154/533_size48.png", 
            fallback: `${WIN98_BASE}/word_pad-0.png`
        },

        // Media
        media: {
            custom: "Icons/41_Audio_CD/309_size48.png", 
            fallback: `${WIN98_BASE}/cd_audio_cd_a-0.png`
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
            { name: "Pictures", type: "folder" },
            { name: "Desktop", type: "folder" },
            { name: "Downloads", type: "folder" },
            { name: "Music", type: "folder" },
            { name: "ReadMe_First.txt", type: "file", icon: "txt", content: "Welcome Friend!\n\nI've hidden the password for the gift somewhere in my files.\n\nHint: I was working on an old project recently... check my Documents." }
        ],
        "C:/Users/Friend/Desktop": [
            { name: "Welcome.txt", type: "file", icon: "txt", content: "MISSION BRIEFING:\n\nHappy Birthday! Your gift is currently locked in the 'Gift.zip' archive.\n\nTo access it, you must complete the following tasks:\n\n1. [COMPLETED] Log in to the system.\n2. [PENDING] The system drivers are corrupted. Open 'fix_me.py' and fix the code to unlock the File Explorer.\n3. [PENDING] Search the file system for the 'riddle.txt' file. It contains the equation for the password.\n4. [PENDING] Solve the riddle and unlock 'Gift.zip'.\n\nGood luck!" },
            { name: "fix_me.py", type: "file", icon: "py", content: "def init_drivers():\n    status = \"broken\"\n    # TODO: Fix the syntax below to unlock system\n    if status = \"broken\"\n        return True" },
            { name: "Gift.zip", type: "file", icon: "zip" }
        ],
        "C:/Users/Friend/Downloads": [
             { name: "installer_v2.exe", type: "file", icon: "default" },
             { name: "receipt.txt", type: "file", icon: "txt", content: "Order #12345\nItem: Birthday Cake\nStatus: Delivered" }
        ],
        "C:/Users/Friend/Music": [
             { name: "song.mp3", type: "audio", icon: "media" }
        ],
        "C:/Users/Friend/Pictures": [
             { name: "vacation.jpg", type: "file", icon: "default" },
             { name: "hint.txt", type: "file", icon: "txt", content: "Nice view, but the password isn't here. Try looking in 'Old_Projects'." }
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
            { name: "riddle.txt", type: "file", icon: "txt", content: `RIDDLE:\n\nI am often ignored and full of "trash."\nBut sometimes, I hold things you didn't mean to lose.\nEmpty me if you dare, but look inside me first.\n \nGo find the file I am holding.` }
        ],
        "Recycle Bin": [
            { name: "New Folder", type: "folder" },
            { name: "test1.txt", type: "file", icon: "txt", content: "Nothing to see here." },
            { name: "test2.ppt", type: "file", icon: "default" }, // No specific ppt icon mapped yet, using default
            { name: "test3.doc", type: "file", icon: "doc", content: "Just a test." },
            { name: "test4.xls", type: "file", icon: "default" },
            { name: "secret_code.txt", type: "file", icon: "txt", content: "I go up, but I never come down. \nI mark the time, but I make no sound.\n I am the reason for the cake and the crown.\n \nWhat am I?" }
        ]
    };

    let currentPath = "root";
    let openWindows = []; // Track open windows for taskbar
    let loginAttempts = 0;
    let hasOpenedRiddle = false;

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
            loginAttempts++;
            if (loginAttempts === 1) {
                showXPDialog("Login Error", "User Access Denied.\nHint: S____ (It is the prettiest thing you can wear.)", "error");
            } else {
                showXPDialog("Login Error", "User Access Denied.\nHint: Try " + LOGIN_ANSWER, "error");
            }
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
            case "recycle-bin":
                openWindow("window-explorer");
                navigateExplorer("Recycle Bin");
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
            $("#icon-recycle").removeClass("disabled");
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

        // Update Sidebar
        updateExplorerSidebar(path);

        // Render Items
        content.forEach(item => {
            // Hidden file logic
            if (item.name === "secret_code.txt" && !hasOpenedRiddle) {
                return;
            }

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
                } else if (item.type === "audio") {
                    openMediaPlayer('assets/Love Me Not.mp3');
                } else if (item.type === "file") {
                    if (item.name === "riddle.txt") {
                        hasOpenedRiddle = true;
                    }

                    if (item.name.endsWith(".txt")) {
                        createNotepadWindow(item.name + " - Notepad", item.content || "");
                    } else if (item.name.endsWith(".doc")) {
                        createWordPadWindow(item.name + " - WordPad", item.content || "");
                    } else if (item.name.endsWith(".zip")) {
                        createWinZipWindow();
                    } else if (item.name.endsWith(".py")) {
                        createNotepadWindow(item.name + " - Notepad", item.content || "", true);
                    }
                } else if (item.type === "audio") {
                    openMediaPlayer('assets/Love Me Not.mp3');
                }
            });

            $view.append($el);
        });
    };

    function updateExplorerSidebar(path) {
        const $sidebar = $(".explorer-sidebar");
        $sidebar.empty();

        let tasksHtml = "";
        
        if (path === "Recycle Bin") {
            tasksHtml = `
                <div class="task-box">
                    <div class="task-header">
                        <span class="title">Recycle Bin Tasks</span>
                        <span class="toggle">^</span>
                    </div>
                    <div class="task-content">
                        <div class="task-item" onclick="showXPDialog('Recycle Bin', 'This is just a game!', 'info')">
                            <img src="https://win98icons.alexmeub.com/icons/png/recycle_bin_empty-4.png">
                            <span>Empty the Recycle Bin</span>
                        </div>
                        <div class="task-item">
                            <img src="https://win98icons.alexmeub.com/icons/png/recycle_bin_full-2.png">
                            <span>Restore all items</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            tasksHtml = `
                <div class="task-box">
                    <div class="task-header">
                        <span class="title">File and Folder Tasks</span>
                        <span class="toggle">^</span>
                    </div>
                    <div class="task-content">
                        <div class="task-item"><img src="https://win98icons.alexmeub.com/icons/png/folder_new-1.png"> Make a new folder</div>
                        <div class="task-item"><img src="https://win98icons.alexmeub.com/icons/png/world-3.png"> Publish this folder to the Web</div>
                        <div class="task-item"><img src="https://win98icons.alexmeub.com/icons/png/network_drive_offline-3.png"> Share this folder</div>
                    </div>
                </div>
            `;
        }

        const otherPlacesHtml = `
            <div class="task-box">
                <div class="task-header">
                    <span class="title">Other Places</span>
                    <span class="toggle">^</span>
                </div>
                <div class="task-content">
                    <div class="task-item" onclick="navigateExplorer('C:/Users/Friend/Desktop')"><img src="https://win98icons.alexmeub.com/icons/png/desktop-2.png"> Desktop</div>
                    <div class="task-item" onclick="navigateExplorer('C:/Users/Friend/Documents')"><img src="https://win98icons.alexmeub.com/icons/png/directory_open-4.png"> My Documents</div>
                    <div class="task-item" onclick="navigateExplorer('root')"><img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png"> My Computer</div>
                    <div class="task-item"><img src="https://win98icons.alexmeub.com/icons/png/network_cool-2.png"> My Network Places</div>
                </div>
            </div>
        `;

        const detailsHtml = `
            <div class="task-box">
                <div class="task-header"><span class="title">Details</span></div>
            </div>
        `;

        $sidebar.append(tasksHtml + otherPlacesHtml + detailsHtml);
    }


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
                openMediaPlayer('assets/Love Me Not.mp3'); // Auto-play on success if desired, or just open media player
            } else {
                showXPDialog("WinZip", "Invalid Password", "error");
            }
        });
    };

    window.openMediaPlayer = function(songUrl) {
        const winId = 'wmp-' + Date.now();
        
        // WMP HTML Structure
        const content = `
            <div class="wmp-container">
                <div class="wmp-menu-bar">
                    <span>File</span><span>View</span><span>Play</span><span>Tools</span><span>Help</span>
                </div>
                
                <div class="wmp-visualizer">
                    <div class="wmp-vis-screen">
                        <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Z5eXhmYXA4emw1Z3Z5eXhmYXA4emw1Z3Z5eXhmYXA4emw1ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l41lFw057lAJQM5Cg/giphy.gif" alt="Visualization">
                        <div class="song-title-overlay">Now Playing: Love Me Not</div>
                    </div>
                </div>

                <div class="wmp-controls">
                    <div class="wmp-seeker">
                        <input type="range" id="${winId}-seek" value="0" step="1">
                    </div>
                    <div class="wmp-buttons">
                        <button id="${winId}-play" title="Play">&#9658;</button>
                        <button id="${winId}-pause" title="Pause">&#10074;&#10074;</button>
                        <button id="${winId}-stop" title="Stop">&#9632;</button> 
                        <div class="wmp-volume-slider" title="Volume">
                            &#128266;
                        </div>
                    </div>
                </div>

                <audio id="${winId}-audio" src="${songUrl}"></audio>
            </div>
        `;

        // Create Window
        // createGenericWindow('Windows Media Player', content, 'media', 400, 350);
        
        const $win = $(`
            <div class="window-container window" id="${winId}" style="top: 150px; left: 200px; width: 400px; height: 350px; display: flex; flex-direction: column;">
                <div class="title-bar">
                    <div class="title-bar-text">Windows Media Player</div>
                    <div class="title-bar-controls">
                        <button aria-label="Close" class="close-btn"></button>
                    </div>
                </div>
                <div class="window-body" style="padding: 0; flex-grow: 1; display: flex; flex-direction: column; background: white;">
                    ${content}
                </div>
            </div>
        `);

        $("#desktop").append($win);
        $win.addClass("window-visible").show();
        setupWindow($win, winId);
        registerWindow(winId, "Windows Media Player", "media");

        // Bind Events (Play, Pause, Seek)
        setTimeout(() => {
            const audio = document.getElementById(winId + '-audio');
            const playBtn = document.getElementById(winId + '-play');
            const pauseBtn = document.getElementById(winId + '-pause');
            const stopBtn = document.getElementById(winId + '-stop');
            const seek = document.getElementById(winId + '-seek');

            if (!audio) return;

            // Auto Play
            audio.play().catch(e => console.log("Autoplay blocked:", e));

            playBtn.onclick = () => audio.play();
            pauseBtn.onclick = () => audio.pause();
            stopBtn.onclick = () => {
                audio.pause();
                audio.currentTime = 0;
            };
            
            // Update Seek Bar
            audio.ontimeupdate = () => {
                if (audio.duration) {
                    const val = (audio.currentTime / audio.duration) * 100;
                    seek.value = val || 0;
                }
            };

            seek.oninput = () => {
                if (audio.duration) {
                    const time = (seek.value / 100) * audio.duration;
                    audio.currentTime = time;
                }
            };
        }, 100);
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
            // Start video
            const iframe = $("#window-media iframe");
            if (iframe.attr("data-src") && !iframe.attr("src")) {
                 iframe.attr("src", iframe.attr("data-src"));
            }
        }
    };

    window.closeWindow = function(id) {
        console.log("Closing Window:", id);
        $("#" + id).removeClass("window-visible").hide();
        unregisterWindow(id); // Remove from taskbar

        if(id === 'window-media') {
            const iframe = $("#window-media iframe");
            iframe.attr("src", ""); // Stop video
        }
    };

});
