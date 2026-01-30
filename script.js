$(document).ready(function() {
    /* --- Audio System --- */
    let SYSTEM_VOLUME = 0.5;

    const AUDIO_FILES = {
        startup: new Audio('assets/startup.mp3'),
        shutdown: new Audio('assets/shutdown.mp3'),
        error: new Audio('assets/error.mp3'),
        ding: new Audio('assets/ding.mp3'),
        hardware_insert: new Audio('assets/hardware_insert.mp3'),
        hardware_remove: new Audio('assets/hardware_remove.mp3'),
        navigation: new Audio('assets/navigation_start.mp3'),
        balloon: new Audio('assets/balloon.mp3')
    };

    function playSound(name) {
        if (AUDIO_FILES[name]) {
            AUDIO_FILES[name].currentTime = 0;
            AUDIO_FILES[name].volume = SYSTEM_VOLUME;
            AUDIO_FILES[name].play().catch(e => console.log("Audio play failed:", e));
        }
    }
    window.playSound = playSound;

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
    const GIFT_PASSWORD = "18";
    
    // Persistent file content for fix_me.py
    let fixMeFileContent = localStorage.getItem("xp_fixme_content") || "def init_drivers():\n    status = \"broken\"\n    # TODO: Fix the syntax below to unlock system\n    if status = \"broken\"\n        return True";

    // Persistent System State (Unlock Progress)
    let isSystemUnlocked = localStorage.getItem("xp_system_unlocked") === "true";

    // Apply persisted state on startup
    if (isSystemUnlocked) {
        $(document).ready(function() {
             console.log("Restoring Unlocked System State...");
             // Allow time for DOM to be ready
             setTimeout(() => {
                 $("#icon-computer").removeClass("disabled");
                 $("#icon-recycle").removeClass("disabled");
             }, 100);
        });
    }

    // Track edits in Notepad
    $(document).on("input", ".notepad-content", function() {
        const $window = $(this).closest(".window");
        const title = $window.find(".title-bar-text").text();
        if (title === "fix_me.py - Notepad") {
            fixMeFileContent = $(this).val();
            localStorage.setItem("xp_fixme_content", fixMeFileContent);
        }
    });
    
    // --- ICON CONFIGURATION ---
    const REPO_PRIMARY = "https://raw.githubusercontent.com/Amne-Dev/WinXP-CDN/main/icons/";
    const REPO_FALLBACK = "https://win98icons.alexmeub.com/icons/png/";

    // Map file types/extensions to filenames in the repo
    const iconMap = {
        "computer": "computer_explorer-5.png",
        "recycle-full": "recycle_bin_full-4.png",
        "recycle-empty": "recycle_bin_empty-4.png",
        "folder": "directory_closed-4.png",
        "folder-open": "directory_open-4.png",
        "txt": "notepad_file-2.png",
        "mp3": "cd_audio_cd_a-4.png",
        "zip": "compressed_file-0.png",
        "exe": "msagent-4.png",
        "py": "batch_file-0.png",
        "default": "file_lines-0.png"
    };

    // --- HELPER FUNCTIONS ---
    function getIconHTML(item) {
        // 1. Determine key (Explicit type OR file extension)
        let key = item.type;
        if (item.type === 'file' && item.name.includes('.')) {
            key = item.name.split('.').pop().toLowerCase(); // e.g., "mp3"
        }
        
        // 2. Resolve Filename (Default if not found)
        const filename = iconMap[key] || iconMap["default"];

        // 3. Construct URLs
        const primarySrc = `${REPO_PRIMARY}${filename}`;
        const fallbackSrc = `${REPO_FALLBACK}${filename}`;

        // 4. Return Image with Error Handling
        return `<img src="${primarySrc}" 
                     onerror="this.onerror=null; this.src='${fallbackSrc}';" 
                     alt="${item.name}" draggable="false">`;
    }

    // --- LEGACY ICON MAP (Keep for compatibility with existing code) ---
    const CUSTOM_BASE = "https://raw.githubusercontent.com/Amne-Dev/WinXP-CDN/main";
    const WIN98_BASE = "https://win98icons.alexmeub.com/icons/png";

    const ICON_MAP = {
        computer: { 
            custom: "Icons/16_My_Computer/123_size48.png", 
            fallback: `${WIN98_BASE}/computer_explorer-5.png` 
        },
        recycle: { 
            custom: "Icons/32_Empty_Recycle_Bin/264_size48.png", 
            fallback: `${WIN98_BASE}/recycle_bin_empty-4.png` 
        },
        folder: { 
            custom: "Icons/4_Closed_Folder/23_size48.png", 
            fallback: `${WIN98_BASE}/directory_closed-4.png` 
        },
        zip: { 
            custom: "Icons/54_Icon_53/376_size48.png", 
            fallback: `${WIN98_BASE}/directory_zipped-0.png` 
        },
        py: { 
            custom: "Icons/3_Executable/14_size32.png", 
            fallback: `${WIN98_BASE}/batch_file-0.png` 
        },
        txt: { 
            custom: "Icons/156_Icon_155/541_size48.png", 
            fallback: `${WIN98_BASE}/notepad_file-2.png` 
        },
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

        // Image
        image: {
            custom: "Icons/72_Image_File/image.png", 
            fallback: `${WIN98_BASE}/image_file-2.png`
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
        // $("#icon-fixme img").replaceWith(getIconHtml("py", "fix_me.py"));
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
        "C:/Windows/System32": [
        { name: "drivers", type: "folder" },
        { name: "cmd.exe", type: "file", icon: "terminal" },
        { name: "calc.exe", type: "file", icon: "app"},
        { name: "notepad.exe", type: "file", icon: "app" },
        { name: "kernel32.dll", type: "file", icon: "system" },
        { name: "hal.dll", type: "file", icon: "system" },
        { name: "winload.efi", type: "file", icon: "system" }
    ],
    "C:/Windows/System32/drivers": [
        { name: "etc", type: "folder" },
        { name: "volsnap.sys", type: "file", icon: "driver" },
        { name: "disk.sys", type: "file", icon: "driver" }
    ],
        "C:/Users": [
            { name: "Amine", type: "folder" },
            { name: "Public", type: "folder" }
        ],
        "C:/Users/Amine": [
            { name: "Documents", type: "folder" },
            { name: "Pictures", type: "folder" },
            { name: "Desktop", type: "folder" },
            { name: "Downloads", type: "folder" },
            { name: "Music", type: "folder" },
            { name: "ReadMe_First.txt", type: "file", icon: "txt", content: "Welcome Asmae!\n\nI've hidden the password for the gift somewhere in my files.\n\nHint: I was working on an old project recently... check my Documents." }
        ],
        "C:/Users/Amine/Desktop": [
            { name: "Welcome.txt", type: "file", icon: "txt", content: "MISSION BRIEFING:\n\nHappy Birthday! Your gift is currently locked in the 'Gift.zip' archive.\n\nTo access it, you must complete the following tasks:\n\n1. [COMPLETED] Log in to the system.\n2. File Explorer Is Locked (The Drivers are corrupt). Open 'fix_me.py' and fix the code to unlock it.\n3. Search the file system for the 'directions' file. It will help you find the password riddle.\n4. Solve the riddle and unlock 'Gift.zip'.\n\nGood luck!" },
            { name: "fix_me.py", type: "file", icon: "py", content: "def init_drivers():\n    status = \"broken\"\n    # TODO: Fix the syntax below to unlock system\n    if status = \"broken\"\n        return True" },
            { name: "Gift.zip", type: "file", icon: "zip" }
        ],
        "C:/Users/Amine/Downloads": [
             { name: "installer_v2.exe", type: "file", icon: "default" },
             { name: "receipt.txt", type: "file", icon: "txt", content: "Order #1\nItem: Perfume\nStatus: Pending Delivery\nPrice: 70 MAD" }
        ],
        "C:/Users/Amine/Music": [
             { name: "song.mp3", type: "audio", icon: "media" }
        ],
        "C:/Users/Amine/Pictures": [
             { name: "vacation.jpg", type: "file", icon: "default" },
             { name: "hint.txt", type: "file", icon: "txt", content: "Nice view, but the password isn't here. Try looking in 'Old_Projects'." },
             { name: "IMPORTANT.png", type: "file", icon: "image", action: "openImageViewer", asset: "assets/HBD.png" },
             { name: "2025-2024", type: "folder"}
        ],
        "C:/Users/Amine/Pictures/2025-2024":[
            { name: "lblad.jpg", type: "file", icon: "image", action: "openImageViewer", asset: "assets/IMG_0163.jpg" },
            { name: "MoulayIsmail.png", type: "file", icon: "image", action: "openImageViewer", asset: "assets/MlyIsmail.jpg" },
            { name: "cat.png", type: "file", icon: "image", action: "openImageViewer", asset: "assets/cat.jpg" },
            
        ],
        "C:/Users/Amine/Documents": [
            { name: "Old_Projects", type: "folder" },
            { name: "Sunset.jpg", type: "file", icon: "image", action: "openImageViewer", asset: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { name: "Resume.doc", type: "file", icon: "doc", content: "RESUME\n\nName: Asmae\nExperience: Being Awesome (2008-Present)\nQualities: Kind, Smart, Thoughtful, Fun to be arround, Light Hearted, Honest, Gentle, Hardworking" },
            { name: "Notes.doc", type: "file", icon: "doc", content: "To Do:\n1. Enjoy your day" },
            { name: "arctan.png", type: "file", icon: "image", action: "openImageViewer", asset: "assets/arctan.jpg" }
        ],
        "C:/Users/Amine/Documents/Old_Projects": [
            { name: "Top_Secret", type: "folder" },
            { name: "Website_v1", type: "folder" }
        ],
        "C:/Users/Amine/Documents/Old_Projects/Top_Secret": [
            { name: "directions.txt", type: "file", icon: "txt", content: `ERROR 410: GONE\n\nThe file you are looking for has been deleted.\n\nCheck the Recycle Bin for a backup.\n\n(Note: Please read the README.txt in the trash to identify the correct file.)` }
        ],
        "C:/Program Files": [
             { name: "Paint", type: "file", icon: "default" },
             { name: "Internet Explorer", type: "file", icon: "default" },
             { name: "Solitaire", type: "file", icon: "default" },
             { name: "Minesweeper", type: "file", icon: "default" },
             { name: "Notepad", type: "file", icon: "txt" },
             { name: "WordPad", type: "file", icon: "doc" }
        ],
        "Recycle Bin": [
            { name: "README.txt", type: "file", icon: "txt", content: "RECOVERY INSTRUCTIONS:\n\nOne of the deleted files in this directory contains the PASSWORD CLUE.\n\nPARAMETERS:\n- File Type: Text Document (.txt)\n- Name Length: 5 letters (excluding .txt) " },
            { name: "system.log", type: "file", icon: "txt", content: "System dump: 0x004512..." },
            { name: "backup.dat", type: "file", icon: "default" },
            { name: "old_doc.doc", type: "file", icon: "doc", content: "<b>Hakari's speech thing...</b>\nHakari never acquired reverse cursed technique, but... the infinite cursed energy overflowing in Hakari's body caused his body to reflexively perform reversed cursed technique in order to avoid damage. in other words, in the 4 minutes and 11 seconds following a jackpot, Hakari is effectively immortal." },
            { name: "graph_v1.jpg", type: "file", icon: "image", action: "openImageViewer", asset: "https://www.bibmath.net/dico/e/images/equilatere.gif" },
            { name: "dummy.txt", type: "file", icon: "txt", content: "Don't be bothered by the contents of this file, Its just here to make the game look more realistic" }, // 5 letters
            { name: "error.log", type: "file", icon: "txt", content: "Error 404" },
            { name: "login.txt", type: "file", icon: "txt", content: "User: admin\nPass: Smile" }, // 5 letters
            { name: "maybe.txt", type: "file", icon: "txt", content: "RIDDLE EXTRACTED:\n\nI go up, but I never come down.\nI mark the time, but I make no sound.\nThink of something related to this occasion\n\n\nHint: Its a number" },//Now you know what I am, so to limit the mix:\nTake a full dozen, and simply add six." }, // Updated Riddle
            { name: "Gift.zip -Shortcut", type: "file", icon: "zip" },
            { name: "ʕ•ᴥ•ʔ.jpg", type: "file", icon: "image", action: "openImageViewer", asset: "https://media.tenor.com/OeuYae1cQTkAAAAM/heart-cat.gif" },
            { name: "funny_cat.mp4", type: "file", icon: "media" }
        ]
    };

    let currentPath = "root";
    let openWindows = []; // Track open windows for taskbar
    let loginAttempts = 0;
    let hasOpenedRiddle = false;
    let hasNotifiedAge = false;

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
            playSound('navigation');
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

function showLoginBalloon(title, message) {
        $(".xp-login-balloon").remove();
        const $input = $("#login-input");
        const offset = $input.offset();
        
        const $balloon = $(`
            <div class="xp-login-balloon" style="display:none;">
                <div class="close-btn" onclick="$(this).parent().fadeOut(function(){$(this).remove()})">x</div>
                <h4>
                    <img src="https://win98icons.alexmeub.com/icons/png/msg_warning-0.png">
                    ${title}
                </h4>
                <div>${message}</div>
            </div>
        `);
        $("body").append($balloon);
        
        const top = offset.top + $input.outerHeight() + 14; 
        // Align arrow (right: 20px) approx with input center
        const left = offset.left + $input.outerWidth() - 200; 
        
        $balloon.css({ top: top, left: left }).fadeIn(200);

        setTimeout(() => {
            $balloon.fadeOut(function() { $(this).remove(); });
        }, 5000);
    }

    function checkLogin() {
        const answer = $("#login-input").val().trim();
        if (answer.toLowerCase() === LOGIN_ANSWER.toLowerCase()) {
            console.log("Login Successful");
            $(".xp-login-balloon").remove();

            // Explicitly hide login screen to prevent click blocking
            $("#login-screen").fadeOut(500, function() {
                console.log("Login screen hidden");
                $(this).css("display", "none"); // Strict removal
                $("#desktop").fadeIn(500);
                playStartupSound();

                // Open Welcome Mission Brief
                console.log("Attempting to open Instructions.txt");
                setTimeout(() => {
                    openInstructions();
                }, 500);
            });
        } else {
            console.log("Login Failed");
            loginAttempts++;
            if (loginAttempts === 1) {
                showLoginBalloon("Login Failed", "User Access Denied.<br>Hint: S _ _ _ _ (It is the prettiest thing you can wear.)");
            } else {
                showLoginBalloon("Login Failed", "User Access Denied.<br>Hint: Try " + LOGIN_ANSWER);
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

    /* --- Step 1: Login & Progression System --- */
    
    // Helper: Dynamic Instructions
    function getInstructionsContent() {
        const isDriversFixed = localStorage.getItem("xp_system_unlocked") === "true";
        const isRiddleFound = localStorage.getItem("xp_riddle_found") === "true";
        const isZipUnlocked = localStorage.getItem("xp_zip_unlocked") === "true";

        let content = "MISSION BRIEFING - Birthday Operation\n\nObjective: Unlock the specialized gift archive.\nFollow these steps carefully:\n\n";
        
        // Step 1
        content += "1. [COMPLETED] Log in to the system.\n\n";
        
        // Step 2
        if (isDriversFixed) {
            content += "2. [COMPLETED] Unlock File Explorer (fix_me.py).\n\n";
        } else {
            content += "2. File Explorer Is Locked & The Drivers are corrupt.\n    ACTION: Open 'fix_me.py', fix the syntax error, and run it to unlock the File Explorer.\n\n";
        }

        // Step 3
        if (isRiddleFound) {
            content += "3. [COMPLETED] Locate 'directions.txt'.\n\n";
        } else {
            content += "3. Locate the password clue.\n    ACTION: Search 'My Computer' for 'directions'. It contains the answer to finding password .\n\n";
        }

        // Step 4
        if (isZipUnlocked) {
            content += "4. [COMPLETED] Unlock Gift.zip.\n\n";
            content += "    MISSION ACCOMPLISHED!\n    Enjoy your reward!";
        } else {
            content += "4. Unlock the Gift.\n    ACTION: Solve the riddle and open 'Gift.zip' with the correct password.\n\n";
        }

        content += "Good luck, Agent!";
        return content;
    }

    // Helper: Open Instructions
    window.openInstructions = function() {
        // Find existing instance to get position
        const existingWin = openWindows.find(w => w.title === "Instructions.txt - Notepad");
        let pos = null;
        
        if (existingWin) {
            const $el = $("#" + existingWin.id);
            if ($el.length) {
                pos = $el.position(); // {top, left}
            }
            closeWindow(existingWin.id);
        }
        
        createNotepadWindow("Instructions.txt - Notepad", getInstructionsContent(), false, pos);
    };

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
            case "instructions":
            case "welcome": // Fallback
                openInstructions();
                break;
            case "sidequests":
                const sideQuestsText = "SIDE QUESTS & HIDDEN COOL STUFF:\n\n1. I hid a song in a folder. Did you find it? \n2. You can play minesweeper & even solitaire!!!.\n3. The web browser(Internet Explorer) is fully functional\n4. You can actually Change the Wallpaper by right clicking on the desktop. Oh and Paint works\nThere's many more hidden things I didn't mention\n\nHave fun exploring!";
                createNotepadWindow("Side_Quests.txt - Notepad", sideQuestsText);
                break;
            case "fixme":
                // Use persisted content
                createNotepadWindow("fix_me.py - Notepad", fixMeFileContent, true);
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
    // Refined Syntax Checker with Line-by-Line Validation
    window.runFixScript = function(code, windowId) {
        console.log("Running fix script validation...");
        const lines = code.split('\n');
        
        // Helper to report errors with XP Dialog
        const reportError = (title, msg) => {
             console.log("Check failed:", msg);
             showXPDialog(title, msg, "error");
             return false;
        };

        // 1. Check Function Definition
        // Expected: def init_drivers():
        const defIndex = lines.findIndex(l => l.trim().startsWith("def "));
        if (defIndex === -1) return reportError("Syntax Error", "Missing function definition.\nExpected: def init_drivers():");
        
        const defLine = lines[defIndex];
        if (!defLine.includes("init_drivers():")) return reportError("Syntax Error", `Line ${defIndex + 1}: Invalid function name.\nExpected: def init_drivers():`);

        // 2. Check Variable Assignment
        // Expected: status = "broken"
        const assignIndex = lines.findIndex(l => l.trim().startsWith("status"));
        if (assignIndex === -1) return reportError("NameError", "Variable 'status' is not defined.");
        
        const assignLine = lines[assignIndex]; 
        // Ensure indentation
        if (assignLine.match(/^\s*/)[0].length === 0) return reportError("IndentationError", `Line ${assignIndex + 1}: Expected an indented block inside function.`);
        
        if (!/status\s*=\s*(['"])broken\1/.test(assignLine)) return reportError("Syntax Error", `Line ${assignIndex + 1}: Check variable assignment.\nExpected: status = "broken"`);

        // 3. Check The Conditional (The User Task)
        // Expected fix: if status == "broken":
        const ifIndex = lines.findIndex(l => l.trim().startsWith("if "));
        if (ifIndex === -1) return reportError("Logic Error", "Missing 'if' statement logic.");

        const ifLine = lines[ifIndex];
        const ifIndent = ifLine.match(/^\s*/)[0].length;
        
        // Check 3a: Indentation Match
        // Should be same level as 'status =' or similar
        const assignIndent = assignLine.match(/^\s*/)[0].length;
        if (ifIndent < assignIndent) return reportError("IndentationError", `Line ${ifIndex + 1}: 'if' statement indentation invalid.`);

        // Check 3b: Comparison Operator (CRITICAL FIX)
        if (!ifLine.includes("==")) {
             if (ifLine.includes("=")) return reportError("Syntax Error", `Line ${ifIndex + 1}: Invalid syntax.\nHint: Use '==' for comparison.`);
             return reportError("Syntax Error", `Line ${ifIndex + 1}: Invalid comparison.`);
        }

        // Check 3c: Colon (CRITICAL FIX)
        if (!ifLine.trim().endsWith(":")) return reportError("Syntax Error", `Line ${ifIndex + 1}: Missing colon (:)\nat end of statement.`);

        // Check 3d: Quotes
        if (!/['"]broken['"]/.test(ifLine)) return reportError("ValueError", `Line ${ifIndex + 1}: You must check if status is "broken".`);


        // 4. Check Return Statement
        // Expected: return True
        const returnIndex = lines.findIndex(l => l.trim().startsWith("return"));
        if (returnIndex === -1) return reportError("Logic Error", "Function must return a value.");
        
        const returnLine = lines[returnIndex];
        if (!returnLine.includes("True")) return reportError("Logic Error", `Line ${returnIndex + 1}: Function should return True.`);
        
        // Check 4a: Nested Indentation
        // Must be deeper than the if statement
        const returnIndent = returnLine.match(/^\s*/)[0].length;
        if (returnIndent <= ifIndent) return reportError("IndentationError", `Line ${returnIndex + 1}: 'return' must be indented inside the 'if' block.`);


        // SUCCESS EXECUTION
        console.log("Script passed all checks!");
        
        // UI Feedback: Simulate running
        const $btn = $(".run-script-btn");
        $btn.text("Running...").css("color", "orange");

        setTimeout(() => {
            // 1. UNLOCK SYSTEM
            playSound('hardware_insert');
            $("#icon-computer").removeClass("disabled");
            $("#icon-recycle").removeClass("disabled");
            
            // Persist Unlock State
            localStorage.setItem("xp_system_unlocked", "true");
            
            // Notification: Files Unlocked
            setTimeout(() => {
                showNotification("New Hardware Found", "USB Mass Storage Device", "usb");
            }, 500);
            
            // 2. CLOSE WINDOW
            closeWindow(windowId);
            
            // 3. SHOW DIALOG
            try {
                showXPDialog("System Console", "Script executed successfully.\n\n[OK] Drivers initialized.\n[OK] File System unlocked.", "info");
                
                // 4. NOTIFICATION INSTEAD OF OPENING INSTRUCTIONS
                setTimeout(() => {
                    showNotification("System Monitor", "System unlocked. Proceed to My Computer.", "security");
                }, 1500);
            } catch (e) {
                console.error("Dialog failed:", e);
            }
        }, 800);
    };


    /* --- Step 3: The Scavenger Hunt (File Explorer) --- */
    
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
    // History State
    let explorerHistory = [];
    let explorerHistoryIndex = -1;
    let isNavigatingHistory = false;

    // Navigation Logic
    window.navigateExplorer = function(path, addToHistory = true) {
        playSound('navigation');
        console.log("Navigating to:", path);
        
        // Validate Path
        if (!fileSystem[path] && path !== "root") {
             // Try to handle implicit paths or error
             // For now, if path not found, show error or doing nothing
             // Let's check for file opening logic in address bar
             // But for navigation, we usually expect a folder
             console.warn("Path not found:", path);
             // Optional: showXPDialog("Error", "Path not found.", "error"); 
             // Allowing it to proceed might clear view, so let's guard
             if (!fileSystem[path]) {
                 showXPDialog("Explorer", "Cannot find '" + path + "'. Check the spelling and try again.", "error");
                 return;
             }
        }

        currentPath = path;
        const content = fileSystem[path] || [];
        const $view = $("#explorer-view");
        $view.empty();

        // History Management
        if (addToHistory) {
            // Remove forward history if we branching off
            explorerHistory = explorerHistory.slice(0, explorerHistoryIndex + 1);
            explorerHistory.push(path);
            explorerHistoryIndex++;
        }
        
        // Update Address Bar & Toolbar Buttons
        const displayPath = path === "root" ? "My Computer" : path;
        $("#explorer-address").val(displayPath);
        
        // Update Back/Forward Buttons state
        // Note: Using opacity or pointer-events might be better visually, but prop disabled works for buttons
        // Since these are divs, we add/remove classes or styles
        const $backBtn = $("#explorer-back");
        const $fwdBtn = $("#explorer-forward");
        
        if (explorerHistoryIndex > 0) {
            $backBtn.removeClass("disabled").css("opacity", "1");
        } else {
            $backBtn.addClass("disabled").css("opacity", "0.5");
        }

        if (explorerHistoryIndex < explorerHistory.length - 1) {
             $fwdBtn.removeClass("disabled").css("opacity", "1");
             // Ensure image inside is not grayed out if we used CSS filters
        } else {
             $fwdBtn.addClass("disabled").css("opacity", "0.5");
        }


        // Update Sidebar
        updateExplorerSidebar(path);

        // Render Items
        content.forEach(item => {
            // Hidden file logic
            if (item.name === "maybe.txt" && !hasOpenedRiddle) {
                return;
            }

            // Notification: Found maybe.txt
            if (item.name === "maybe.txt" && hasOpenedRiddle && !hasNotifiedAge) {
                showNotification("Secret Found", "You're close to figuring the password", "info"); 
                hasNotifiedAge = true;
            }

            let iconHtml;
            if (item.action === "openImageViewer" && item.asset) {
                iconHtml = `<img src="${item.asset}" alt="${item.name}" class="image-icon-preview" style="object-fit: cover;">`;
            } else {
                const iconType = getFileIcon(item);
                iconHtml = getIconHtml(iconType, item.name);
            }

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
                } else if (item.action === "openImageViewer") {
                    openImageViewer(item.name, item.asset);
                } else if (item.type === "file") {
                    if (item.name === "directions.txt") {
                        hasOpenedRiddle = true;
                    }

                    if (item.name.endsWith(".txt")) {
                        createNotepadWindow(item.name + " - Notepad", item.content || "");
                    } else if (item.name.endsWith(".doc")) {
                        createWordPadWindow(item.name + " - WordPad", item.content || "");
                    } else if (item.name.endsWith(".zip")) {
                        createWinZipWindow();
                    } else if (item.name.endsWith(".py") || item.name.endsWith(".log")) {
                        createNotepadWindow(item.name + " - Notepad", item.content || "", true);
                    } else if (item.name === "Paint") {
                        createPaintWindow();
                    } else if (item.name === "Internet Explorer") {
                        createInternetExplorerWindow();
                    } else if (item.name === "Solitaire") {
                        createSolitaireWindow();
                    } else if (item.name === "Minesweeper") {
                        createMinesweeperWindow();
                    } else if (item.name === "Notepad") {
                        createNotepadWindow("Untitled - Notepad", "");
                    } else if (item.name === "WordPad") {
                        createWordPadWindow();
                    }
                } else if (item.type === "audio") {
                    openMediaPlayer('assets/Love Me Not.mp3');
                }
            });

            $view.append($el);
        });
    };

    window.navigateBack = function() {
        if (explorerHistoryIndex > 0) {
            explorerHistoryIndex--;
            navigateExplorer(explorerHistory[explorerHistoryIndex], false);
        }
    };

    window.navigateForward = function() {
        if (explorerHistoryIndex < explorerHistory.length - 1) {
            explorerHistoryIndex++;
            navigateExplorer(explorerHistory[explorerHistoryIndex], false);
        }
    };

    window.navigateUp = function() {
        if (currentPath === "root") return;
        
        let newPath;
        if (currentPath.indexOf("/") === -1) {
            // e.g. "C:" -> Root
            newPath = "root";
        } else {
            // "C:/Windows/System32" -> "C:/Windows"
            newPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
        }
        navigateExplorer(newPath);
    };

    window.handleGoClick = function() {
        const inputVal = $("#explorer-address").val();
        if (inputVal === "My Computer") {
            navigateExplorer("root");
        } else {
            // Check if it's a file or folder
            if (fileSystem[inputVal]) {
                navigateExplorer(inputVal);
            } else {
                // Try to find if it is a file in the parent folder? 
                // Creating a simplified check for direct file access via address bar
                // (Optional feature, but user asked "look for a folder or file")
                const lastSlash = inputVal.lastIndexOf("/");
                if (lastSlash !== -1) {
                    const parentDir = inputVal.substring(0, lastSlash);
                    const fileName = inputVal.substring(lastSlash + 1);
                    if (fileSystem[parentDir]) {
                        const files = fileSystem[parentDir];
                        const foundFile = files.find(f => f.name === fileName);
                        if (foundFile) {
                            if (foundFile.type === "folder") {
                                navigateExplorer(inputVal);
                            } else {
                                // Simulate double click logic
                                openFileFromAddress(foundFile, parentDir);
                            }
                            return;
                        }
                    }
                }
                navigateExplorer(inputVal); // Logic will show error dialog
            }
        }
    };
    
    function openFileFromAddress(item, path) {
         if (item.type === "file") {
            // Duplicate logic from double click... ideally refactor this out
            if (item.name.endsWith(".txt")) createNotepadWindow(item.name, item.content || "");
            else if (item.name.endsWith(".zip")) createWinZipWindow();
            else if (item.name === "Paint") createPaintWindow();
             // ... etc
            else showXPDialog("Explorer", "Opening " + item.name, "info");
         }
    }

    window.handleAddressKeypress = function(event) {
        if (event.key === "Enter") {
            handleGoClick();
        }
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
                    <div class="task-item" onclick="navigateExplorer('C:/Users/Amine/Desktop')"><img src="https://win98icons.alexmeub.com/icons/png/desktop-2.png"> Desktop</div>
                    <div class="task-item" onclick="navigateExplorer('C:/Users/Amine/Documents')"><img src="https://win98icons.alexmeub.com/icons/png/directory_open-4.png"> My Documents</div>
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

    // Generic Window Creator
    window.createWindow = function(title, contentHtml, iconUrl, width, height) {
        const id = 'win-' + Date.now();
        const styleW = width ? `width: ${width}px;` : '';
        const styleH = height ? `height: ${height}px;` : '';
        
        // Icon Image Element or Empty
        const iconImg = iconUrl ? `<img src="https://win98icons.alexmeub.com/icons/png/${iconUrl}" style="width:16px; height:16px; margin-right:5px; vertical-align:middle;">` : '';

        const $win = $(`
            <div class="window-container window" id="${id}" style="top: 100px; left: 100px; ${styleW} ${styleH} display: flex; flex-direction: column;">
                <div class="title-bar">
                    <div class="title-bar-text">${iconImg}${title}</div>
                    <div class="title-bar-controls">
                        <button aria-label="Close" class="close-btn"></button>
                    </div>
                </div>
                <div class="window-body" style="padding: 0; display: flex; flex-direction: column; flex: 1; min-height: 0;">
                    ${contentHtml}
                </div>
            </div>
        `);

        $("#desktop").append($win);
        $win.show();
        setupWindow($win, id);
        registerWindow(id, title, "default"); // Register as default
        return id;
    };

    window.openDisplayProperties = function() {
        const winId = 'disp-prop-' + Date.now();
        
        // Wallpapers (Name -> URL)
        const wallpapers = {
            "(None)": "",
            "Bliss": "assets/wallpaper.jpg", 
            "Autumn": "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1600&q=80",
            "Red Moon": "https://images.unsplash.com/photo-1532517308734-0565178471d2?auto=format&fit=crop&w=1600&q=80"
        };

        const content = `
            <div class="display-props-layout">
                <div class="props-tabs">
                    <div>Themes</div>
                    <div class="active-tab">Desktop</div>
                    <div>Screen Saver</div>
                    <div>Appearance</div>
                    <div>Settings</div>
                </div>

                <div class="props-body">
                    <div class="monitor-preview-container">
                        <div class="monitor-frame">
                            <div class="monitor-screen" id="${winId}-preview" style="background-image: url('${wallpapers['Autumn']}'); background-size: cover;"></div>
                        </div>
                        <div class="monitor-stand"></div>
                    </div>

                    <div class="bg-selection-group">
                        <fieldset>
                            <legend>Background:</legend>
                            <div style="display:flex; gap:10px;">
                                <div class="bg-list-container">
                                    <ul id="${winId}-bg-list">
                                        ${Object.keys(wallpapers).map(name => 
                                            `<li class="${name === 'Autumn' ? 'selected' : ''}" onclick="selectBg('${winId}', '${name}', '${wallpapers[name]}')">
                                                <img src="https://win98icons.alexmeub.com/icons/png/paint_file-2.png" style="width:14px; margin-right:4px;">
                                                ${name}
                                            </li>`
                                        ).join('')}
                                    </ul>
                                </div>
                                <div class="bg-controls">
                                    <input type="file" id="${winId}-file-input" style="display:none" accept="image/*">
                                    <button class="xp-btn" id="${winId}-browse-btn">Browse...</button>
                                    <div style="margin-top: 10px;">
                                        <label>Position:</label><br>
                                        <select id="${winId}-position" onchange="updatePreview('${winId}')">
                                            <option value="center">Center</option>
                                            <option value="repeat">Tile</option>
                                            <option value="cover" selected>Stretch</option>
                                        </select>
                                    </div>
                                    <div style="margin-top: 10px;">
                                        <label>Color:</label><br>
                                        <input type="color" value="#004E98" style="width:100%; height:22px; padding:0;">
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <button class="xp-btn" style="margin-top:10px; width: 140px;">Customize Desktop...</button>
                    </div>
                </div>

                <div class="props-footer">
                    <button class="xp-btn" onclick="applyWallpaper('${winId}'); closeWindow('${winId}')">OK</button>
                    <button class="xp-btn" onclick="closeWindow('${winId}')">Cancel</button>
                    <button class="xp-btn" onclick="applyWallpaper('${winId}')">Apply</button>
                </div>
            </div>
        `;

        createWindow('Display Properties', content, 'display_properties-2.png', 400, 500);

        // --- FIX: DISABLE RESIZING ---
        setTimeout(() => {
            const winEl = document.getElementById(winId + '-preview').closest('.window');
            if (winEl) {
                winEl.style.resize = 'none'; // Standard CSS resize disable
                winEl.style.maxWidth = '400px'; // Lock width
                winEl.style.maxHeight = '500px'; // Lock height
                // Remove UI resize handle if present
                if ($(winEl).data("ui-resizable")) {
                    $(winEl).resizable("destroy");
                }
            }

            // --- BROWSE FEATURE ---
            const fileInput = document.getElementById(`${winId}-file-input`);
            const browseBtn = document.getElementById(`${winId}-browse-btn`);
            
            if (browseBtn && fileInput) {
                browseBtn.onclick = () => fileInput.click();
                
                fileInput.onchange = function() {
                    if (this.files && this.files[0]) {
                        const file = this.files[0];
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const newUrl = e.target.result;
                            const newName = file.name;
                            
                            // Add to list UI
                            const list = document.getElementById(`${winId}-bg-list`);
                            const newItem = document.createElement('li');
                            newItem.className = 'selected';
                            // Note: We assign the onclick directly to the element to avoid scope issues with string interpolation
                            newItem.onclick = () => selectBg(winId, newName, newUrl);
                            newItem.innerHTML = `<img src="https://win98icons.alexmeub.com/icons/png/paint_file-2.png" style="width:14px; margin-right:4px;"> ${newName}`;
                            
                            // Deselect others
                            list.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
                            
                            // Insert at top (after None? or just prepend)
                            list.prepend(newItem); 
                            
                            // Force Select Logic
                            selectBg(winId, newName, newUrl);
                        }
                        reader.readAsDataURL(file);
                    }
                };
            }
        }, 50);

        // --- Helper Functions attached to Window scope for simplicity ---
        
        // Select Background in List
        window.selectBg = (wId, name, url) => {
            // Update List UI
            document.querySelectorAll(`#${wId}-bg-list li`).forEach(li => li.classList.remove('selected'));
            event.currentTarget.classList.add('selected');
            
            // Update Preview
            const preview = document.getElementById(`${wId}-preview`);
            preview.style.backgroundImage = url ? `url('${url}')` : 'none';
            preview.style.backgroundColor = url ? 'transparent' : '#004E98'; // Fallback color
            
            // Store selected URL on the preview element for easy access
            preview.dataset.selectedUrl = url;
            
            // Apply current position settings to preview
            updatePreview(wId);
        };

        // Update Position Preview (Center/Tile/Stretch)
        window.updatePreview = (wId) => {
            const pos = document.getElementById(`${wId}-position`).value;
            const preview = document.getElementById(`${wId}-preview`);
            
            if (pos === 'cover') {
                preview.style.backgroundSize = 'cover';
                preview.style.backgroundRepeat = 'no-repeat';
                preview.style.backgroundPosition = 'center';
            } else if (pos === 'repeat') {
                preview.style.backgroundSize = '50px'; // Simulating tile size for preview
                preview.style.backgroundRepeat = 'repeat';
                preview.style.backgroundPosition = 'top left';
            } else {
                 // Center
                preview.style.backgroundSize = 'contain';
                preview.style.backgroundRepeat = 'no-repeat';
                preview.style.backgroundPosition = 'center';
            }
            
            preview.dataset.selectedPos = pos;
        };

        // Apply Changes to Real Desktop
        window.applyWallpaper = (wId) => {
            const preview = document.getElementById(`${wId}-preview`);
            // Check if user selected something, else use current preview state
            const url = preview.dataset.selectedUrl !== undefined ? preview.dataset.selectedUrl : wallpapers['Autumn'];
            const pos = preview.dataset.selectedPos || 'cover';
            
            const desktop = document.getElementById('desktop');
            desktop.style.backgroundImage = url ? `url('${url}')` : 'none';
            desktop.style.backgroundColor = '#004E98'; // Default blue if no image
            
            if (pos === 'repeat') {
                 desktop.style.backgroundSize = 'auto'; // Normal size for tile
                 desktop.style.backgroundRepeat = 'repeat';
                 desktop.style.backgroundPosition = 'top left';
            } else if (pos === 'center') {
                 desktop.style.backgroundSize = 'auto'; 
                 desktop.style.backgroundRepeat = 'no-repeat';
                 desktop.style.backgroundPosition = 'center';
            } else {
                 // Stretch / Cover
                 desktop.style.backgroundSize = 'cover';
                 desktop.style.backgroundRepeat = 'no-repeat';
                 desktop.style.backgroundPosition = 'center';
            }
        };
    };

    window.createNotepadWindow = function(title, content, isScript = false, position = null) {
        console.log("Creating Notepad Window:", title);
        
        // Check if window implies instructions to refresh content dynamically
        if (title.startsWith("Instructions.txt")) {
            content = getInstructionsContent();
        }
        
        const id = "window-" + Date.now();

        // Default position vs Preserved position
        const styleTop = position ? position.top + "px" : "100px";
        const styleLeft = position ? position.left + "px" : "150px";
        
        // Initial line numbers generation
        const lineCount = content.split('\n').length;
        const lineNumbers = Array.from({length: lineCount}, (_, i) => i + 1).join('\n');

        const $win = $(`
            <div class="window-container window" id="${id}" style="top: ${styleTop}; left: ${styleLeft}; width: 600px; display: flex; flex-direction: column; height: 400px;">
                <div class="title-bar">
                    <div class="title-bar-text">${title}</div>
                    <div class="title-bar-controls">
                        <button aria-label="Close" class="close-btn"></button>
                    </div>
                </div>
                <!-- Flex: 1 and min-height: 0 ensures this grows/shrinks with the container -->
                <div class="window-body" style="padding: 0; display: flex; flex-direction: column; flex: 1; min-height: 0; height: auto; gap: 0;">
                    <div class="menubar">
                        <div class="menubar-item">File</div>
                        <div class="menubar-item">Edit</div>
                        <div class="menubar-item">Format</div>
                        <div class="menubar-item">View</div>
                        <div class="menubar-item">Help</div>
                        ${isScript ? '<div class="menubar-item run-script-btn" style="margin-left: auto; font-weight: bold; color: green; cursor: pointer;">▶ Run Script</div>' : ''}
                    </div>
                    
                    <div class="notepad-editor-container" style="display: flex; flex: 1; overflow: hidden; position: relative;">
                        <!-- Line Numbers -->
                        <div class="line-numbers" style="
                            width: 45px; 
                            background-color: #f0f0f0; 
                            color: #999; 
                            text-align: right; 
                            padding: 10px 5px; 
                            font-family: 'Consolas', 'Courier New', monospace; 
                            font-size: 14px; 
                            line-height: 20px; 
                            border-right: 1px solid #d9d9d9;
                            user-select: none;
                            overflow: hidden;
                            white-space: pre;
                            box-sizing: border-box;
                        ">${lineNumbers}</div>
                        
                        <!-- Text Area -->
                        <textarea class="notepad-content" style="
                            flex: 1; 
                            border: none; 
                            resize: none; 
                            outline: none; 
                            padding: 10px; 
                            font-family: 'Consolas', 'Courier New', monospace; 
                            font-size: 14px; 
                            line-height: 20px; 
                            white-space: pre; 
                            overflow: auto;
                        " spellcheck="false">${content}</textarea>
                    </div>
                </div>
            </div>
        `);

        $("#desktop").append($win);
        $win.addClass("window-visible").show(); // Explicitly show the window
        setupWindow($win, id);

        // --- Editor Logic ---
        const $textarea = $win.find(".notepad-content");
        const $lineNumbers = $win.find(".line-numbers");
        
        // Sync Scrolling
        $textarea.on("scroll", function() {
            $lineNumbers.scrollTop($(this).scrollTop());
        });

        // Tab Key Indentation Support
        $textarea.on("keydown", function(e) {
            if (e.key === "Tab") {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;

                // Insert 4 spaces
                const value = $(this).val();
                $(this).val(value.substring(0, start) + "    " + value.substring(end));

                // Move cursor
                this.selectionStart = this.selectionEnd = start + 4;
                
                // Trigger input event to update line numbers/state
                $(this).trigger("input");
            }
        });

        // Update Line Numbers & Status Bar
        $textarea.on("input click keyup", function() {
            // Update Line Numbers
            const lines = $(this).val().split('\n').length;
            const currentLines = $lineNumbers.text().split('\n').length;
            
            if (lines !== currentLines) {
                $lineNumbers.html(Array.from({length: lines}, (_, i) => i + 1).join('\n'));
            }
        });
        
        // Register to taskbar
        const iconType = isScript ? "py" : "txt";
        registerWindow(id, title, iconType);
    };

    window.createWordPadWindow = function(title, content) {
        console.log("Creating WordPad Window:", title);
        const id = "window-" + Date.now();
        const initialContent = content ? content.replace(/\n/g, "<br>") : "Start typing...";
        
        const $win = $(`
            <div class="window-container window" id="${id}" style="top: 120px; left: 180px; width: 600px; height: 450px; display: flex; flex-direction: column;">
                <div class="title-bar">
                    <div class="title-bar-text">${title}</div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close" class="close-btn"></button>
                    </div>
                </div>
                <div class="window-body" style="padding: 0; flex-grow: 1; display: flex; flex-direction: column;">
                    <div class="menubar">
                        <div class="menubar-item">File</div>
                        <div class="menubar-item">Edit</div>
                        <div class="menubar-item">View</div>
                        <div class="menubar-item">Insert</div>
                        <div class="menubar-item">Format</div>
                        <div class="menubar-item">Help</div>
                    </div>
                    <div class="wordpad-toolbar" style="padding: 5px; background: #f0f0f0; border-bottom: 1px solid #808080; display: flex; align-items: center;">
                        <button class="wp-btn" data-cmd="bold" style="font-weight:bold; width: 24px; margin-right: 2px;">B</button>
                        <button class="wp-btn" data-cmd="italic" style="font-style:italic; width: 24px; margin-right: 2px;">I</button>
                        <button class="wp-btn" data-cmd="underline" style="text-decoration:underline; width: 24px; margin-right: 5px;">U</button>
                        <div style="border-left: 1px solid #aaa; height: 16px; margin-right: 5px;"></div>
                        <select class="wp-font" style="height:22px;">
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Verdana">Verdana</option>
                        </select>
                    </div>
                    <div class="wp-editor" contenteditable="true" style="flex-grow: 1; background: white; overflow: auto; padding: 15px; border: 1px solid #808080; margin: 5px; outline: none; font-family: Arial; font-size: 14px; line-height: 1.5;">
                        ${initialContent}
                    </div>
                </div>
            </div>
        `);

        $("#desktop").append($win);
        $win.addClass("window-visible").show();
        setupWindow($win, id);
        
        // Register to taskbar
        registerWindow(id, title, "doc");

        // Toolbar Logic
        $win.find(".wp-btn").click(function() {
            const cmd = $(this).data("cmd");
            document.execCommand(cmd, false, null);
            $win.find(".wp-editor").focus();
        });

        $win.find(".wp-font").change(function() {
            const font = $(this).val();
            document.execCommand("fontName", false, font);
            $win.find(".wp-editor").focus();
        });
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
            if (input.toLowerCase() === GIFT_PASSWORD.toLowerCase()) {
                // Update State
                localStorage.setItem("xp_zip_unlocked", "true");
                
                closeWindow(id);
                openWindow("window-media");
                
                // Final step - no instructions auto-open
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
                    <div class="wmp-control-bar">
                        <div class="wmp-main-buttons">
                            <button class="wmp-btn small" title="Previous">|<<</button>
                            <button id="${winId}-play" class="wmp-btn big" title="Play">&#9658;</button>
                            <button id="${winId}-pause" class="wmp-btn big" title="Pause" style="display:none;">&#10074;&#10074;</button>
                            <button id="${winId}-stop" class="wmp-btn small" title="Stop">&#9632;</button> 
                            <button class="wmp-btn small" title="Next">>>|</button>
                        </div>
                        <div class="wmp-volume-box">
                             <div class="wmp-vol-icon" title="Volume">&#128266;</div>
                             <input type="range" id="${winId}-volume" class="wmp-vol-range" min="0" max="1" step="0.05" value="0.5">
                        </div>
                    </div>
                </div>

                <audio id="${winId}-audio" src="${songUrl}"></audio>
            </div>
        `;

        // Create Window
        // createGenericWindow('Windows Media Player', content, 'media', 400, 350);
        
        const $win = $(`
            <div class="window-container window" id="${winId}" style="top: 150px; left: 200px; width: 550px; height: 380px; display: flex; flex-direction: column;">
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

        // Custom Close Handler for WMP to stop audio
        $win.find(".close-btn").off("click").click(function() {
            const audio = document.getElementById(winId + '-audio');
            if(audio) {
                audio.pause();
                audio.src = "";
            }
            closeWindow(winId);
            $win.remove();
        });

        // Bind Events (Play, Pause, Seek)
        setTimeout(() => {
            const audio = document.getElementById(winId + '-audio');
            const playBtn = document.getElementById(winId + '-play');
            const pauseBtn = document.getElementById(winId + '-pause');
            const stopBtn = document.getElementById(winId + '-stop');
            const seek = document.getElementById(winId + '-seek');
            const volSlider = document.getElementById(winId + '-volume');

            if (!audio) return;

            // Initialize Volume
            audio.volume = SYSTEM_VOLUME;
            if(volSlider) volSlider.value = SYSTEM_VOLUME;

             function updatePlayState(playing) {
                if (playing) {
                    playBtn.style.display = 'none';
                    pauseBtn.style.display = 'inline-flex';
                } else {
                    playBtn.style.display = 'inline-flex';
                    pauseBtn.style.display = 'none';
                }
            }

            // Auto Play
            audio.play().then(() => updatePlayState(true)).catch(e => console.log("Autoplay blocked:", e));

            playBtn.onclick = () => {
                audio.play();
                updatePlayState(true);
            };
            pauseBtn.onclick = () => {
                audio.pause();
                updatePlayState(false);
            };
            stopBtn.onclick = () => {
                audio.pause();
                audio.currentTime = 0;
                updatePlayState(false);
            };

            if(volSlider) {
                volSlider.oninput = () => {
                   audio.volume = volSlider.value;
                };
            }
            
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

    /* --- Notification System --- */
    window.toggleTray = function() {
        const icons = document.getElementById('tray-icons');
        const btn = document.querySelector('.tray-expand-button');
        
        if (icons.classList.contains('tray-icons-hidden')) {
            icons.classList.remove('tray-icons-hidden');
            btn.classList.remove('tray-arrow-collapsed');
            btn.classList.add('tray-arrow-expanded');
            btn.title = "Hide inactive icons";
        } else {
            icons.classList.add('tray-icons-hidden');
             btn.classList.remove('tray-arrow-expanded');
            btn.classList.add('tray-arrow-collapsed');
            btn.title = "Show hidden icons";
        }
    };

    window.toggleVolumeControl = function() {
        const popup = document.getElementById('volume-popup');
        if (popup.style.display === 'none') {
            popup.style.display = 'flex';
            // Click outside to close
            setTimeout(() => {
                document.addEventListener('click', closeVolumeOutside);
            }, 0);
        } else {
            popup.style.display = 'none';
            document.removeEventListener('click', closeVolumeOutside);
        }
    };

    function closeVolumeOutside(event) {
        const popup = document.getElementById('volume-popup');
        const trayIcon = document.querySelector('img[title="Volume"]');
        
        if (popup && !popup.contains(event.target) && event.target !== trayIcon) {
            popup.style.display = 'none';
            document.removeEventListener('click', closeVolumeOutside);
        }
    }

    // Initialize Volume Slider Logic
    setTimeout(() => {
        const track = document.querySelector('.slider-track');
        const thumb = document.querySelector('.slider-thumb');
        const fill = document.querySelector('.slider-fill');
        const muteCheck = document.getElementById('mute-check');
        let isDragging = false;
        
        if (!track) return;

        // Set Initial State (0.35)
        const initPercent = (SYSTEM_VOLUME * 100) + '%';
        thumb.style.bottom = initPercent;
        fill.style.height = initPercent;

        function updateVolume(clientY) {
            const rect = track.getBoundingClientRect();
            let y = clientY - rect.top;
            
            // Slider vertical calculation: Bottom is 0, Top is 1
            let percent = 1 - (y / rect.height); 
            if (percent < 0) percent = 0;
            if (percent > 1) percent = 1;

            SYSTEM_VOLUME = percent;
            
            const percentStr = (percent * 100) + '%';
            thumb.style.bottom = percentStr;
            fill.style.height = percentStr;

            if (!muteCheck.checked) {
                // Update Global Audio
                Object.values(AUDIO_FILES).forEach(a => a.volume = SYSTEM_VOLUME);
                $('audio').each(function() { this.volume = SYSTEM_VOLUME; });
            }
        }

        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateVolume(e.clientY);
        });
        
        thumb.addEventListener('mousedown', (e) => {
             isDragging = true;
             e.preventDefault(); 
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                updateVolume(e.clientY);
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        muteCheck.addEventListener('change', (e) => {
            if (e.target.checked) {
                Object.values(AUDIO_FILES).forEach(a => a.volume = 0);
                $('audio').each(function() { this.volume = 0; });
            } else {
                Object.values(AUDIO_FILES).forEach(a => a.volume = SYSTEM_VOLUME);
                $('audio').each(function() { this.volume = SYSTEM_VOLUME; });
            }
        });
    }, 1000);

    window.showNotification = function(title, message, type = 'info') {
        $('.xp-notification').remove();

        let iconSrc = 'https://raw.githubusercontent.com/Amne-Dev/WinXP-CDN/main/Icons/1_Unknown_File_(Standard)/11_size16.png';
        if (type === 'security') iconSrc = 'https://raw.githubusercontent.com/Amne-Dev/WinXP-CDN/main/Icons/20_Security_Center/173_size16.png';
        if (type === 'network') iconSrc = 'https://raw.githubusercontent.com/Amne-Dev/WinXP-CDN/main/Icons/110_Network_Connections/352_size16.png';
        if (type === 'usb') iconSrc = 'https://raw.githubusercontent.com/Amne-Dev/WinXP-CDN/main/Icons/124_USB_Safe_Removal/396_size16.png';

        const $notif = $(`
            <div class="xp-notification">
                <div class="xp-notification-close" onclick="$(this).parent().remove()" title="Close"></div>
                <div class="xp-notification-title">
                    <img src="${iconSrc}">
                    <span>${title}</span>
                </div>
                <div class="xp-notification-body">
                    ${message}
                </div>
            </div>
        `);

        $('body').append($notif);
        playSound('balloon');

        // Animate In
        setTimeout(() => $notif.addClass('show'), 10);

        // Auto Close
        setTimeout(() => {
            $notif.removeClass('show');
            setTimeout(() => $notif.remove(), 300);
        }, 8000); 
        
        $notif.click(function(e) {
             if (!$(e.target).hasClass('xp-notification-close')) {
                 $notif.removeClass('show');
                 setTimeout(() => $notif.remove(), 300);
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
            playSound('error');
        } else {
            playSound('ding');
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

        // Enable Resizing
        $win.resizable({
            handles: "n, e, s, w, ne, se, sw, nw",
            minHeight: 250,
            minWidth: 300,
            containment: "#desktop",
            stop: function(event, ui) {
                // Ensure layout recalculations if necessary
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
        
        // Reset All Programs when closing/opening start menu
        $("#all-programs-menu").hide();
        $(".all-programs").removeClass("active");
    });

    // All Programs Button Logic
    $(".all-programs").click(function(e) {
        e.stopPropagation();
        const $menu = $("#all-programs-menu");
        if ($menu.is(":visible")) {
            $menu.hide();
            $(this).removeClass("active");
        } else {
            $menu.show();
            $(this).addClass("active");
        }
    });
    
    // Prevent clicks inside the program menu from closing it immediately (unless it's an item action)
    $("#all-programs-menu").click(function(e) {
        e.stopPropagation();
    });

    $(document).click(function(e) {
        if (!$(e.target).closest("#start-menu").length && !$(e.target).closest(".start-button").length) {
            $("#start-menu").hide();
            $(".start-button").removeClass("active");
            
            // Also hide All Programs
            $("#all-programs-menu").hide();
            $(".all-programs").removeClass("active");
        }
    });

    window.logOff = function() {
        // Reset Game State
        localStorage.removeItem("xp_system_unlocked");
        localStorage.removeItem("xp_riddle_found");
        localStorage.removeItem("xp_zip_unlocked");
        localStorage.removeItem("xp_fixme_content");
        location.reload();
    };

    window.shutdownComputer = function() {
        playSound('shutdown');
        $("#start-menu").hide();
        
        // Create a black overlay
        const $overlay = $('<div id="shutdown-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:black;z-index:99999;display:none;align-items:center;justify-content:center;color:white;font-family:Tahoma;"></div>');
        $("body").append($overlay);
        
        // Fade out desktop
        $("#desktop, #taskbar").fadeOut(2000, function() {
            $overlay.css('display', 'flex').hide().fadeIn(1000);
            setTimeout(() => {
                $overlay.html("<h3>It is now safe to turn off your computer.</h3>");
            }, 3000);
        });
    };


    /* --- Global Window Management --- */

    // Simple Calc Logic Helper (Must be global for inline onclicks in HTML string)
    window.calcInput = function(id, val) {
        const display = document.getElementById(id + '-display');
        let current = display.value;
        
        if (val === 'C') {
            display.value = '0';
            // Also clear memory/calc state if we had one? For simple calc, just clearing display.
        } else if (val === 'CE') {
            display.value = '0';
        } else if (val === 'back') {
            display.value = current.length > 1 ? current.slice(0, -1) : '0';
        } else if (val === '=') {
            try { 
                // Basic safety check/cleaning before eval? 
                // For this toy app, eval is acceptable as per prompt request.
                display.value = eval(current); 
            } catch { display.value = 'Error'; }
        } else if (val === 'neg') {
            display.value = current.startsWith('-') ? current.substring(1) : '-' + current;
        } else {
             // Handle leading zeros
            if (current === '0' && !['.', '+', '-', '*', '/'].includes(val)) current = '';
             // If we just had an error, reset
            if (current === 'Error') current = '';
            
            display.value = current + val;
        }
    };

    function createCalculatorWindow() {
        if ($("#window-calculator").length) {
            $("#window-calculator").addClass("window-visible").show();
            setWindowFocus("window-calculator");
            return;
        }
        
        const winId = "window-calculator";
        
        const content = `
        <div class="calc-container">
            <div style="font-size:11px; margin-bottom: 6px; padding-left:2px;">
                <span style="margin-right:8px">Edit</span>
                <span style="margin-right:8px">View</span>
                <span>Help</span>
            </div>
            
            <div class="calc-display">
                <input type="text" id="${winId}-display" value="0" readonly>
            </div>

            <div class="calc-grid">
                <div class="calc-empty-box"></div>
                <button class="calc-btn text-red btn-backspace" onclick="calcInput('${winId}', 'back')">Backspace</button>
                <button class="calc-btn text-red btn-ce" onclick="calcInput('${winId}', 'CE')">CE</button>
                <button class="calc-btn text-red btn-c" onclick="calcInput('${winId}', 'C')">C</button>

                <button class="calc-btn text-red">MC</button>
                <button class="calc-btn text-blue" onclick="calcInput('${winId}', '7')">7</button>
                <button class="calc-btn text-blue" onclick="calcInput('${winId}', '8')">8</button>
                <button class="calc-btn text-blue" onclick="calcInput('${winId}', '9')">9</button>
                <button class="calc-btn text-red" onclick="calcInput('${winId}', '/')">/</button>
                <button class="calc-btn text-blue">sqrt</button>

                <button class="calc-btn text-red">MR</button>
                <button class="calc-btn text-blue" onclick="calcInput('${winId}', '4')">4</button>
                <button class="calc-btn text-blue" onclick="calcInput('${winId}', '5')">5</button>
                <button class="calc-btn text-blue" onclick="calcInput('${winId}', '6')">6</button>
                <button class="calc-btn text-red" onclick="calcInput('${winId}', '*')">*</button>
                <button class="calc-btn text-blue">%</button>

                <button class="calc-btn text-red">MS</button>
                <button class="calc-btn text-blue" onclick="calcInput('${winId}', '1')">1</button>
                <button class="calc-btn text-blue" onclick="calcInput('${winId}', '2')">2</button>
                <button class="calc-btn text-blue" onclick="calcInput('${winId}', '3')">3</button>
                <button class="calc-btn text-red" onclick="calcInput('${winId}', '-')">-</button>
                <button class="calc-btn text-blue">1/x</button>

                <button class="calc-btn text-red">M+</button>
                <button class="calc-btn text-blue" onclick="calcInput('${winId}', '0')">0</button>
                <button class="calc-btn text-blue" onclick="calcInput('${winId}', 'neg')">+/-</button>
                <button class="calc-btn text-blue" onclick="calcInput('${winId}', '.')">.</button>
                <button class="calc-btn text-red" onclick="calcInput('${winId}', '+')">+</button>
                <button class="calc-btn text-red" onclick="calcInput('${winId}', '=')">=</button>
            </div>
        </div>
        `;

        const $win = $(`
            <div class="window-container window" id="${winId}" style="top: 150px; left: 250px; width: 240px; height: 280px; display: flex; flex-direction: column;">
                <div class="title-bar">
                    <div class="title-bar-text">Calculator</div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close" class="close-btn"></button>
                    </div>
                </div>
                <!-- Remove padding from window body to let calc container fill it -->
                <div class="window-body" style="padding: 0; flex-grow: 1; display: flex; flex-direction: column; overflow: hidden;">
                    ${content}
                </div>
            </div>
        `);

        $("#desktop").append($win);
        $win.addClass("window-visible").show();
        setupWindow($win, winId);
        $win.resizable('destroy'); // Disable resizing for calculator
        registerWindow(winId, "Calculator", "computer"); 
    }

    window.openWindow = function(id) {
        console.log("Opening Window:", id);

        // Dynamic checks for our new apps if they are called via ID
        if (id === "wordpad") {
            createWordPadWindow("Document - WordPad", "");
            return;
        }
        if (id === "paint") {
            createPaintWindow();
            return;
        }
        if (id === "ie") {
            createInternetExplorerWindow();
            return;
        }
        if (id === "calculator") {
            createCalculatorWindow();
            return;
        }
        if (id === "wordpad") {
            createWordPadWindow();
            return;
        }
        if (id === "notepad") {
            createNotepadWindow("Untitled - Notepad", "");
            return;
        }
        if (id === "solitaire") {
            createSolitaireWindow();
            return;
        }
        if (id === "minesweeper") {
            createMinesweeperWindow();
            return;
        }

        $("#" + id).addClass("window-visible").show();
        setWindowFocus(id);

        // Register static windows
        if (id === "window-explorer") {
            registerWindow(id, "My Computer", "computer");
        } else if (id === "window-media") {
            registerWindow(id, "Windows Media Player", "computer"); // Using computer icon as placeholder
            // Start reward media: set iframe src from data-src (deferred load)
            setTimeout(() => {
                try {
                    const $iframe = $("#window-media iframe");
                    if ($iframe.length) {
                        const dataSrc = $iframe.attr('data-src') || $iframe.attr('src') || '';
                        let src = '';

                        if (dataSrc.match(/youtube\.com\/watch\?v=|youtu\.be\//)) {
                            // Extract video id and convert to embed URL
                            const m = dataSrc.match(/(?:v=|youtu\.be\/)([\w-\-]+)/);
                            if (m && m[1]) {
                                src = `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0`;
                            }
                        } else {
                            // Use dataSrc directly for direct video links
                            src = dataSrc;
                        }

                        if (src) $iframe.attr('src', src);
                    }
                } catch (e) {
                    console.error('Failed to initialize reward media iframe:', e);
                }
            }, 50);
        }
    };

    window.closeWindow = function(id) {
        console.log("Closing Window:", id);
        
        // Special case: File Explorer is static in HTML, just hide it.
        // Other dynamically created windows (like Notepads) should be removed to prevent ID conflicts or clutter.
        // BUT current logic for everything uses existing IDs, so let's stick to hiding if possible unless we know it's dynamic.
        // The issue: If we 'remove()' a dynamic window, we can't 'show()' it again with the same ID logic easily if it's based on timestamp.
        // Static windows: window-explorer, window-media
        
        const staticWindows = ["window-explorer", "window-media"];
        
        if (staticWindows.includes(id)) {
            $("#" + id).removeClass("window-visible").fadeOut(200); // Animation helps
        } else {
             $("#" + id).removeClass("window-visible").fadeOut(200, function() {
                 // Should we remove dynamic windows?
                 // createNotepadWindow generates unique ID window-timestamp
                 // so yes, we should remove them to free memory
                 $(this).remove(); 
             });
        }
        
        unregisterWindow(id); // Remove from taskbar

        if(id === 'window-media') {
            const iframe = $("#window-media iframe");
            iframe.attr("src", ""); // Stop video
        }
    };

    /* --- Right Click Context Menu --- */
    $(document).on("contextmenu", function(e) {
        e.preventDefault();
        $(".context-menu").remove(); 
        $(".context-menu-sub").remove();

        const $target = $(e.target);
        let menuItems = [];

        // Logic to determine menu type
        if ($target.closest(".taskbar").length || $target.closest("#taskbar-items").length) {
            menuItems = [
                { label: "Toolbars", arrow: true, disabled: true },
                { separator: true },
                { label: "Cascade Windows", action: "cascade", disabled: true },
                { label: "Tile Windows Horizontally", disabled: true },
                { label: "Tile Windows Vertically", disabled: true },
                { label: "Show the Desktop", action: "showDesktop" },
                { separator: true },
                { label: "Task Manager", action: "taskmgr" },
                { separator: true },
                { label: "Lock the Taskbar", checked: true, disabled: true },
                { label: "Properties", disabled: true }
            ];
        } else if ($target.closest(".desktop-icon").length || $target.closest(".file-item").length) {
            // Determine name
            let name = "";
            if ($target.closest(".desktop-icon").length) {
                name = $target.closest(".desktop-icon").find("span").first().text().trim();
            } else {
                name = $target.closest(".file-item").find("span").first().text().trim();
            }

            menuItems = [
                { label: "Open", bold: true, action: "openIcon", targetInfo: name },
                { label: "Explore", disabled: true },
                { label: "Search...", disabled: true },
                { separator: true },
                { 
                    label: "Send To", 
                    arrow: true,
                    submenu: [
                        { label: "Compressed (zipped) Folder", disabled: true },
                        { label: "Desktop (create shortcut)", disabled: true },
                        { label: "Mail Recipient", action: "sendToMail", targetInfo: name },
                        { label: "My Documents", disabled: true }
                    ]
                },
                { separator: true },
                { label: "Cut", disabled: true },
                { label: "Copy", disabled: true },
                { separator: true },
                { label: "Create Shortcut", disabled: true },
                { label: "Delete", disabled: true },
                { label: "Rename", disabled: true },
                { separator: true },
                { label: "Properties", disabled: true }
            ];
        } else if ($target.closest(".window-body").length) {
             return; // Default browser menu for inside windows
        } else {
            // Default Desktop
            menuItems = [
                { label: "Arrange Icons By", arrow: true, disabled: true },
                { label: "Refresh", disabled: true },
                { separator: true },
                { label: "Paste", disabled: true },
                { label: "Paste Shortcut", disabled: true },
                { separator: true },
                { label: "New", arrow: true, disabled: true },
                { separator: true },
                { label: "Properties", action: "openDisplayProperties" }
            ];
        }

        renderContextMenu(menuItems, e.pageX, e.pageY);
    });

    // Close menu on click
    $(document).click(function() {
        $(".context-menu").remove();
        $(".context-menu-sub").remove();
    });

    function renderContextMenu(items, x, y, isSub = false) {
        const $menu = $(`<div class="context-menu ${isSub ? 'context-menu-sub' : ''}"></div>`);
        
        items.forEach(item => {
            if (item.separator) {
                $menu.append('<div class="context-menu-separator"></div>');
                return;
            }

            const styles = item.bold ? 'font-weight: bold;' : '';
            const disabledClass = item.disabled ? 'disabled' : '';
            const arrowHtml = (item.arrow || item.submenu) ? '<span style="margin-left:auto; font-size: 8px;">▶</span>' : '';
            const checkedHtml = item.checked ? '<span style="position: absolute; left: 5px;">✔</span>' : '';

            const $el = $(`<div class="context-menu-item ${disabledClass}" style="${styles}">
                ${checkedHtml}
                ${item.label}
                ${arrowHtml}
            </div>`);

            // Hover for submenu
            $el.on('mouseenter', function() {
                // Remove sibling submenus if we are in a sub menu, or all sub menus if we are root
                if (isSub) {
                    // In a real implementation we would track depth, but for 1 level deep:
                    // do nothing? No, we might have siblings with submenus.
                } else {
                    $(".context-menu-sub").remove();
                }

                if (item.submenu && !item.disabled) {
                    const rect = this.getBoundingClientRect();
                    renderContextMenu(item.submenu, rect.right - 5, rect.top, true);
                }
            });

            if (!item.disabled && item.action) {
                $el.click(function(e) {
                    e.stopPropagation();
                    handleMenuAction(item.action, item.targetInfo);
                    $(".context-menu").remove();
                    $(".context-menu-sub").remove();
                });
            }

            $menu.append($el);
        });

        $("body").append($menu);
        
        // Prevent overflow
        if (x + $menu.outerWidth() > $(window).width()) x -= $menu.outerWidth();
        if (y + $menu.outerHeight() > $(window).height()) y -= $menu.outerHeight();

        $menu.css({ top: y, left: x });
        $menu.show();
    }

    function handleMenuAction(action, info) {
        console.log("Menu Action:", action, info);
        if (action === "openDisplayProperties") {
            openDisplayProperties();
            return;
        }

        if (action === "showDesktop") {
            $(".window-container").hide();
            openWindows.forEach(w => w.minimized = true);
            $(".window-container").removeClass("active-window");
            renderTaskbar(); // Refresh taskbar states
        } else if (action === "taskmgr") {
            alert("Task Manager has been disabled by your administrator.");
        } else if (action === "openIcon") {
            // Retrieve the icon text/name from the info passed
            const iconName = info; 
            // Try to click desktop icon first
            const $desktopIcon = $(".desktop-icon").filter(function() {
                return $(this).find("span").first().text().trim() === iconName;
            });
            
            if ($desktopIcon.length) {
                $desktopIcon.trigger("dblclick");
            } else {
                // Try file items in explorer
                $(".file-item").filter(function() {
                    return $(this).find("span").first().text().trim() === iconName;
                }).trigger("dblclick");
            }
        } else if (action === "sendToMail") {
            const fileName = info;
            let content = "";
            let subject = "File: " + fileName;
            
            // Find File Content
            // Check current explorer path first, then Desktop
            let files = fileSystem[currentPath] || [];
            let file = files.find(f => f.name === fileName);
            
            if (!file) {
                file = fileSystem["C:/Users/Amine/Desktop"].find(f => f.name === fileName);
            }
            
            if (file && (file.type === "file" || fileName.endsWith(".txt") || fileName.endsWith(".py") || fileName.endsWith(".doc"))) {
                    content = file.content || "(Empty File)";
            } else {
                    subject = "Easter Egg!";
                    content = "WOOHOO you found me Im an easter egg!\n(I didn't excpect you to find this one tbh, Well done!)";
            }

            createEmailWindow("", subject, content);
        }
    }

    /* --- Paint Application --- */
    window.createPaintWindow = function() {
         console.log("Creating Paint Window");
         const id = "window-" + Date.now();
         const title = "untitled - Paint";
         
         // Basic Colors map
         const colors = [
             '#000000', '#783c00', '#000000', '#007878', '#000078', '#780078', '#78783c', '#c0c0c0', '#787878',
             '#ffffff', '#ff7800', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff00', '#ffff00', '#ffffff'
             // ... simplified palette
         ];
         let colorsHtml = '';
         colors.forEach(c => colorsHtml += `<div class="paint-color" style="background-color: ${c}" onclick="selectColor('${id}', '${c}')"></div>`);

         const $win = $(`
            <div class="window-container window" id="${id}" style="top: 50px; left: 50px; width: 600px; height: 450px; display: flex; flex-direction: column;">
                <div class="title-bar">
                    <div class="title-bar-text"><img src="https://win98icons.alexmeub.com/icons/png/paint_file-2.png" style="width:16px; height:16px; margin-right:5px; vertical-align:middle;">${title}</div>
                    <div class="title-bar-controls">
                        <button aria-label="Close" class="close-btn"></button>
                    </div>
                </div>
                <div class="window-body" style="padding: 0; display: flex; flex-direction: column; flex: 1; min-height: 0;">
                    <div class="menubar">
                        <div class="menubar-item">File</div>
                        <div class="menubar-item">Edit</div>
                        <div class="menubar-item">View</div>
                        <div class="menubar-item">Image</div>
                        <div class="menubar-item">Colors</div>
                        <div class="menubar-item">Help</div>
                    </div>
                    <div class="paint-body">
                        <div class="paint-toolbar">
                             <!-- Tools Placeholders -->
                             <div class="paint-tool active" style="background-image: url('https://win98icons.alexmeub.com/icons/png/pencil-0.png'); background-size: contain;"></div>
                             <div class="paint-tool" style="background-image: url('https://win98icons.alexmeub.com/icons/png/paint_bucket-0.png'); background-size: contain;"></div>
                             <div class="paint-tool" style="background-image: url('https://win98icons.alexmeub.com/icons/png/brush-0.png'); background-size: contain;"></div>
                             <div class="paint-tool" style="background-image: url('https://win98icons.alexmeub.com/icons/png/eraser-0.png'); background-size: contain;"></div>
                        </div>
                        <div class="paint-canvas-container">
                            <canvas width="400" height="300" class="paint-canvas"></canvas>
                        </div>
                    </div>
                    <div class="paint-colors">
                        ${colorsHtml}
                    </div>
                    <div class="status-bar" style="height: 20px; background: whitesmoke; border-top: 1px solid #d9d9d9; font-size: 11px; padding: 2px;">For Help, click Help Topics on the Help Menu.</div>
                </div>
            </div>
        `);

        $("#desktop").append($win);
        $win.show();
        setupWindow($win, id);
        registerWindow(id, title, "default"); // Use generic icon for now

        // Canvas Logic
        const canvas = $win.find('canvas')[0];
        const ctx = canvas.getContext('2d');
        let painting = false;

        // White background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Default brush
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";

        function startPosition(e) {
            painting = true;
            draw(e);
        }

        function endPosition() {
            painting = false;
            ctx.beginPath();
        }

        function draw(e) {
            if (!painting) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }

        // Expose color selector helper (globally or scoped attach)
        window.selectColor = function(winId, color) {
            if (id === winId) {
                ctx.strokeStyle = color;
            }
        };

        $(canvas).on("mousedown", startPosition);
        $(canvas).on("mouseup", endPosition);
        $(canvas).on("mousemove", draw);
    }
    
    /* --- Internet Explorer Application --- */
    window.createInternetExplorerWindow = function() {
         console.log("Creating IE Window");
         const id = "window-" + Date.now();
         const title = "Internet Explorer";
         
         const $win = $(`
            <div class="window-container window" id="${id}" style="top: 30px; left: 30px; width: 700px; height: 500px; display: flex; flex-direction: column;">
                <div class="title-bar">
                    <div class="title-bar-text"><img src="https://win98icons.alexmeub.com/icons/png/msie1-1.png" style="width:16px; height:16px; margin-right:5px; vertical-align:middle;">${title}</div>
                    <div class="title-bar-controls">
                        <button aria-label="Close" class="close-btn"></button>
                    </div>
                </div>
                <div class="window-body" style="padding: 0; display: flex; flex-direction: column; flex: 1; min-height: 0;">
                    <div class="menubar">
                        <div class="menubar-item">File</div>
                        <div class="menubar-item">Edit</div>
                        <div class="menubar-item">View</div>
                        <div class="menubar-item">Favorites</div>
                        <div class="menubar-item">Tools</div>
                        <div class="menubar-item">Help</div>
                    </div>
                    <div class="ie-address-bar">
                        <span>Address</span>
                        <input type="text" value="http://www.google.com" />
                        <button style="display:flex; align-items:center; gap:2px; height: 20px;">Go <span style="font-size:10px;">▶</span></button>
                    </div>
                    <div class="ie-content">
                        <iframe src="https://www.google.com/search?igu=1" class="ie-iframe"></iframe> 
                        <!-- Note: Many sites block iframe embedding. Search?igu=1 is a trick for google. -->
                    </div>
                    <div class="status-bar" style="height: 20px; background: whitesmoke; border-top: 1px solid #d9d9d9; font-size: 11px; padding: 2px;">Done</div>
                </div>
            </div>
        `);

        $("#desktop").append($win);
        $win.show();
        setupWindow($win, id);
        registerWindow(id, title, "computer"); // Placeholder icon

        // IE Logic
        const $input = $win.find('input');
        const $btn = $win.find('button');
        const $iframe = $win.find('iframe');

        function navigate() {
            let url = $input.val();
            if (!url.startsWith('http')) {
                url = 'http://' + url;
            }
            $iframe.attr('src', url);
        }

        $btn.click(navigate);
        $input.on('keypress', function (e) {
            if(e.which === 13) navigate();
        });
    }

    /* --- Email Client --- */
    window.createEmailWindow = function(to, subject, bodyLine) {
         console.log("Creating Email Window");
         const id = "window-" + Date.now();
         const title = "New Message";
         
         const $win = $(`
            <div class="window-container window" id="${id}" style="top: 100px; left: 100px; width: 500px; height: 400px; display: flex; flex-direction: column;">
                <div class="title-bar">
                    <div class="title-bar-text"><img src="https://win98icons.alexmeub.com/icons/png/mail_generic-0.png" style="width:16px; height:16px; margin-right:5px; vertical-align:middle;">${title}</div>
                    <div class="title-bar-controls">
                        <button aria-label="Close" class="close-btn"></button>
                    </div>
                </div>
                <div class="window-body" style="padding: 0; display: flex; flex-direction: column; flex: 1; min-height: 0; background: #ece9d8;">
                     <div class="menubar">
                        <div class="menubar-item">File</div>
                        <div class="menubar-item">Edit</div>
                        <div class="menubar-item">View</div>
                        <div class="menubar-item">Insert</div>
                        <div class="menubar-item">Format</div>
                        <div class="menubar-item">Tools</div>
                        <div class="menubar-item">Message</div>
                        <div class="menubar-item">Help</div>
                    </div>
                    <div class="email-toolbar">
                        <button class="email-toolbar-btn" id="btn-send-${id}">
                             <img src="https://win98icons.alexmeub.com/icons/png/envelope_closed-0.png" alt="Send">
                             Send
                        </button>
                        <div style="width: 1px; background: #aca899; margin: 0 2px;"></div>
                        <button class="email-toolbar-btn">
                             <img src="https://win98icons.alexmeub.com/icons/png/cut-0.png" alt="Copy">
                             Cut
                        </button>
                         <button class="email-toolbar-btn">
                             <img src="https://win98icons.alexmeub.com/icons/png/copy-0.png" alt="Copy">
                             Copy
                        </button>
                        <button class="email-toolbar-btn">
                             <img src="https://win98icons.alexmeub.com/icons/png/paste-0.png" alt="Paste">
                             Paste
                        </button>
                    </div>
                    <div class="email-header">
                        <div class="email-header-row">
                             <span class="email-header-label">To:</span>
                             <input type="text" class="email-header-input" id="email-to-${id}" value="${to || ''}">
                        </div>
                        <div class="email-header-row">
                             <span class="email-header-label">Cc:</span>
                             <input type="text" class="email-header-input">
                        </div>
                        <div class="email-header-row">
                             <span class="email-header-label">Subject:</span>
                             <input type="text" class="email-header-input" id="email-subject-${id}" value="${subject || ''}">
                        </div>
                    </div>
                    <div class="email-content" style="flex: 1; padding: 0;">
                        <textarea id="email-body-${id}">${bodyLine || ''}</textarea>
                    </div>
                </div>
            </div>
        `);

        $("#desktop").append($win);
        $win.show();
        setupWindow($win, id);
        registerWindow(id, title, "mail"); 

        // Send Logic
        $win.find(`#btn-send-${id}`).click(function() {
            const toEmail = $(`#email-to-${id}`).val();
            const subj = $(`#email-subject-${id}`).val();
            const msg = $(`#email-body-${id}`).val();

            if (!toEmail) {
                alert("Please specify a recipient.");
                return;
            }

            // Button state
            const $btn = $(this);
            const originalText = $btn.html();
            $btn.prop("disabled", true).text("Sending...");

            // EmailJS Params
            // These placeholders must be updated by the user in the EmailJS dashboard
            const params = {
                to_email: toEmail, 
                subject: subj,
                message: msg
            };

            const serviceID = "service_4rhhhmn"; 
            const templateID = "template_seh8zrl"; 

            if (typeof emailjs === 'undefined') {
                alert("EmailJS SDK not found. Please check your internet connection or index.html configuration.");
                $btn.prop("disabled", false).html(originalText);
                return;
            }

            emailjs.send(serviceID, templateID, params)
                .then(function() {
                    alert("Email sent successfully!");
                    closeWindow(id);
                }, function(error) {
                    alert("Failed to send email. Error: " + JSON.stringify(error) + "\n\nMake sure you have configured your Service ID and Template ID in script.js and Public Key in index.html");
                    console.error("EmailJS Error:", error);
                    $btn.prop("disabled", false).html(originalText);
                });
        });
    }

    // --- DESKTOP ICON SELECTION ---
    function deselectAll() {
        document.querySelectorAll('.desktop-icon').forEach(icon => icon.classList.remove('selected'));
    }

    // Click Empty Space to Deselect
    $('#desktop').on('click', function(e) {
        if(e.target === this || $(e.target).attr('id') === 'desktop-icons') {
            deselectAll();
        }
    });

    // Icon Selection Logic (for existing icons)
    $(document).on('click', '.desktop-icon', function(e) {
        e.stopPropagation();
        
        // Toggle selection behavior
        const wasSelected = $(this).hasClass('selected');
        deselectAll();
        
        if (!wasSelected) {
            $(this).addClass('selected');
        }
    });

    /* --- Windows Picture and Fax Viewer --- */
    window.openImageViewer = function(fileName, fileUrl) {
        const winId = 'img-' + Date.now();
        let zoom = 1;
        let rotation = 0;
        const title = fileName + ' - Windows Picture and Fax Viewer';

        // Helper to update transform
        const updateImage = () => {
            const img = document.getElementById(`${winId}-img`);
            if(img) img.style.transform = `scale(${zoom}) rotate(${rotation}deg)`;
        };

        const content = `
            <div class="img-viewer-container">
                <div class="img-viewer-canvas">
                    <img id="${winId}-img" src="${fileUrl}" alt="${fileName}">
                </div>

                <div class="img-viewer-toolbar">
                    <button title="Previous" disabled style="font-size: 16px;">◀</button>
                    <button title="Next" disabled style="font-size: 16px;">▶</button>
                    <div class="separator"></div>
                    <button id="${winId}-zoom-in" title="Zoom In" style="font-size: 18px;">+</button>
                    <button id="${winId}-zoom-out" title="Zoom Out" style="font-size: 18px;">-</button>
                    <div class="separator"></div>
                    <button id="${winId}-rot-cw" title="Rotate Clockwise" style="font-size: 18px;">↻</button>
                    <button id="${winId}-rot-ccw" title="Rotate Counter-Clockwise" style="font-size: 18px;">↺</button>
                    <div class="separator"></div>
                    <button title="Delete" style="font-size: 16px;">🗑</button>
                </div>
            </div>
        `;

        const $win = $(`
            <div class="window-container window" id="${winId}" style="top: 100px; left: 100px; width: 600px; height: 500px; display: flex; flex-direction: column;">
                <div class="title-bar">
                    <div class="title-bar-text">${title}</div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close" class="close-btn"></button>
                    </div>
                </div>
                <div class="window-body" style="padding: 0; flex-grow: 1; display: flex; flex-direction: column; overflow: hidden;">
                    ${content}
                </div>
            </div>
        `);

        $("#desktop").append($win);
        $win.addClass("window-visible").show();
        
        setupWindow($win, winId);
        registerWindow(winId, title, "image");

        // Bind Events
        // Use timeout to ensure elements are in DOM if needed, but append is synchronous mostly
        setTimeout(() => {
            document.getElementById(`${winId}-zoom-in`).onclick = () => { zoom += 0.1; updateImage(); };
            document.getElementById(`${winId}-zoom-out`).onclick = () => { if(zoom > 0.2) zoom -= 0.1; updateImage(); };
            document.getElementById(`${winId}-rot-cw`).onclick = () => { rotation += 90; updateImage(); };
            document.getElementById(`${winId}-rot-ccw`).onclick = () => { rotation -= 90; updateImage(); };
        }, 100);
    };

    // Minesweeper Implementation
    window.createMinesweeperWindow = function() {
        if ($("#window-minesweeper").length) {
            $("#window-minesweeper").addClass("window-visible").show();
            setWindowFocus("window-minesweeper");
            return;
        }

        const winId = "window-minesweeper";
        const rows = 9;
        const cols = 9;
        const minesCount = 10;
        let grid = [];
        let gameOver = false;
        let flags = 0;
        let time = 0;
        let timerInterval = null;

        const content = `
            <div class="minesweeper-window">
                <div class="ms-header">
                    <div class="ms-counter" id="ms-mines-left">010</div>
                    <div class="ms-face" id="ms-face">🙂</div>
                    <div class="ms-counter" id="ms-timer">000</div>
                </div>
                <!-- Prevent context menu on grid to allow flagging -->
                <div class="ms-grid" id="ms-grid" oncontextmenu="return false;" style="grid-template-columns: repeat(${cols}, 16px); grid-template-rows: repeat(${rows}, 16px);"></div>
            </div>
        `;

        const $win = $(`
            <div class="window-container window" id="${winId}" style="top: 150px; left: 300px; width: auto; height: auto; display: flex; flex-direction: column;">
                <div class="title-bar">
                    <div class="title-bar-text">Minesweeper</div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close" class="close-btn"></button>
                    </div>
                </div>
                <div class="window-body" style="padding: 0; display: inline-block;">
                    ${content}
                </div>
            </div>
        `);

        $("#desktop").append($win);
        $win.addClass("window-visible").show();
        setupWindow($win, winId);
        $win.resizable('destroy'); 
        registerWindow(winId, "Minesweeper", "game"); 

        const $grid = $win.find("#ms-grid");
        const $face = $win.find("#ms-face");
        const $minesLeft = $win.find("#ms-mines-left");
        const $timer = $win.find("#ms-timer");

        function initGame() {
            grid = [];
            gameOver = false;
            flags = 0;
            time = 0;
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                time++;
                if(time > 999) time = 999;
                $timer.text(time.toString().padStart(3, '0'));
            }, 1000);
            $timer.text("000");
            $minesLeft.text(minesCount.toString().padStart(3, '0'));
            $face.text("🙂");
            $grid.empty();

            for(let r=0; r<rows; r++) {
                const row = [];
                for(let c=0; c<cols; c++) {
                    const cell = { r, c, isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0 };
                    row.push(cell);
                    const $cellDiv = $(`<div class="ms-cell" data-r="${r}" data-c="${c}"></div>`);
                    $grid.append($cellDiv);
                }
                grid.push(row);
            }

            let minesPlaced = 0;
            while(minesPlaced < minesCount) {
                const r = Math.floor(Math.random() * rows);
                const c = Math.floor(Math.random() * cols);
                if(!grid[r][c].isMine) {
                    grid[r][c].isMine = true;
                    minesPlaced++;
                }
            }

            for(let r=0; r<rows; r++) {
                for(let c=0; c<cols; c++) {
                    if(grid[r][c].isMine) continue;
                    let count = 0;
                    for(let dr=-1; dr<=1; dr++) {
                        for(let dc=-1; dc<=1; dc++) {
                            if(dr===0 && dc===0) continue;
                            const nr = r+dr, nc = c+dc;
                            if(nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc].isMine) count++;
                        }
                    }
                    grid[r][c].neighborMines = count;
                }
            }
        }

        function reveal(r, c) {
            if(gameOver || grid[r][c].isRevealed || grid[r][c].isFlagged) return;
            grid[r][c].isRevealed = true;
            const $cell = $grid.find(`[data-r='${r}'][data-c='${c}']`);
            $cell.addClass("revealed");

            if(grid[r][c].isMine) {
                $cell.addClass("mine").text("💣");
                $cell.css("background", "red");
                gameOver = true;
                $face.text("😵");
                clearInterval(timerInterval);
                revealAllMines();
            } else {
                if(grid[r][c].neighborMines > 0) {
                    $cell.text(grid[r][c].neighborMines);
                    $cell.addClass(`ms-${grid[r][c].neighborMines}`);
                } else {
                    for(let dr=-1; dr<=1; dr++) {
                        for(let dc=-1; dc<=1; dc++) {
                            const nr = r+dr, nc = c+dc;
                            if(nr>=0 && nr<rows && nc>=0 && nc<cols) reveal(nr, nc);
                        }
                    }
                }
                checkWin();
            }
        }

        function revealAllMines() {
            for(let r=0; r<rows; r++) {
                for(let c=0; c<cols; c++) {
                    if(grid[r][c].isMine) {
                        const $cell = $grid.find(`[data-r='${r}'][data-c='${c}']`);
                        if(!grid[r][c].isFlagged) {
                            $cell.addClass("revealed mine").text("💣"); // Revealed mine
                        }
                    } else if (grid[r][c].isFlagged) {
                         const $cell = $grid.find(`[data-r='${r}'][data-c='${c}']`);
                         $cell.addClass("mine").text("❌"); // Wrong flag
                    }
                }
            }
        }

        function checkWin() {
            let revealedCount = 0;
            for(let r=0; r<rows; r++) {
                for(let c=0; c<cols; c++) {
                    if(grid[r][c].isRevealed) revealedCount++;
                }
            }
            if(revealedCount === (rows*cols - minesCount)) {
                gameOver = true;
                $face.text("😎");
                clearInterval(timerInterval);
                for(let r=0; r<rows; r++) {
                    for(let c=0; c<cols; c++) {
                        if(grid[r][c].isMine && !grid[r][c].isFlagged) {
                            grid[r][c].isFlagged = true;
                            const $cell = $grid.find(`[data-r='${r}'][data-c='${c}']`);
                            $cell.addClass("flag").text("🚩");
                        }
                    }
                }
                $minesLeft.text("000");
            }
        }

        $grid.on("mousedown", ".ms-cell", function(e) {
            if(gameOver) return;
            if(e.button === 0) $face.text("😮");
        });

        $grid.on("mouseup", ".ms-cell", function(e) {
            if(gameOver) return;
            if(e.button === 0) $face.text("🙂");
            const r = $(this).data("r");
            const c = $(this).data("c");
            if(e.button === 0) {
                reveal(r, c);
            } else if(e.button === 2) {
                if(grid[r][c].isRevealed) return;
                grid[r][c].isFlagged = !grid[r][c].isFlagged;
                const $cell = $(this);
                if(grid[r][c].isFlagged) {
                    $cell.addClass("flag").text("🚩");
                    flags++;
                } else {
                    $cell.removeClass("flag").text("");
                    flags--;
                }
                $minesLeft.text((minesCount - flags).toString().padStart(3, '0'));
            }
        });

        $face.click(function() { initGame(); });
        $win.find(".close-btn").click(function() { clearInterval(timerInterval); });

        initGame();
    };

    // Solitaire Implementation
    window.createSolitaireWindow = function() {
        if ($("#window-solitaire").length) {
            $("#window-solitaire").addClass("window-visible").show();
            setWindowFocus("window-solitaire");
            return;
        }

        const winId = "window-solitaire";
        const content = `
            <div class="solitaire-window">
                <div class="solitaire-top">
                    <div class="solitaire-deck-area">
                        <div class="sol-placeholder" id="sol-stock"></div>
                        <div class="sol-placeholder" id="sol-waste"></div>
                    </div>
                    <div class="solitaire-foundations">
                        <div class="sol-placeholder" id="sol-found-0" data-suit="h"></div>
                        <div class="sol-placeholder" id="sol-found-1" data-suit="d"></div>
                        <div class="sol-placeholder" id="sol-found-2" data-suit="c"></div>
                        <div class="sol-placeholder" id="sol-found-3" data-suit="s"></div>
                    </div>
                </div>
                <div class="solitaire-tableau">
                    <div class="sol-column" id="sol-tab-0"></div>
                    <div class="sol-column" id="sol-tab-1"></div>
                    <div class="sol-column" id="sol-tab-2"></div>
                    <div class="sol-column" id="sol-tab-3"></div>
                    <div class="sol-column" id="sol-tab-4"></div>
                    <div class="sol-column" id="sol-tab-5"></div>
                    <div class="sol-column" id="sol-tab-6"></div>
                </div>
            </div>
        `;

        const $win = $(`
            <div class="window-container window" id="${winId}" style="top: 50px; left: 100px; width: 800px; height: 600px; display: flex; flex-direction: column;">
                <div class="title-bar">
                    <div class="title-bar-text">Solitaire</div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close" class="close-btn"></button>
                    </div>
                </div>
                <div class="window-body" style="padding: 0; flex-grow: 1; overflow: hidden;">
                    ${content}
                </div>
            </div>
        `);

        $("#desktop").append($win);
        $win.addClass("window-visible").show();
        setupWindow($win, winId);
        registerWindow(winId, "Solitaire", "game");

        // Game State
        const suits = ['h', 'd', 'c', 's'];
        const suitSymbols = {'h': '♥', 'd': '♦', 'c': '♣', 's': '♠'};
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        let deck = [];
        let stock = [];
        let waste = [];
        let foundations = [[], [], [], []];
        let tableau = [[], [], [], [], [], [], []];

        function createDeck() {
            deck = [];
            for (let s of suits) {
                for (let r = 0; r < ranks.length; r++) {
                    deck.push({
                        suit: s,
                        rank: r + 1, // 1-13
                        rankStr: ranks[r],
                        color: (s === 'h' || s === 'd') ? 'red' : 'black',
                        faceUp: false,
                        id: s + (r + 1)
                    });
                }
            }
            // Shuffle
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
        }

        function deal() {
            createDeck();
            stock = [...deck];
            tableau = [[], [], [], [], [], [], []];
            waste = [];
            foundations = [[], [], [], []];

            for (let i = 0; i < 7; i++) {
                for (let j = i; j < 7; j++) {
                    let card = stock.pop();
                    if (j === i) card.faceUp = true;
                    tableau[j].push(card);
                }
            }
            renderGame();
        }

        function getCardHTML(card, topOffset = 0) {
            if (!card.faceUp) {
                return `<div class="sol-card sol-card-back" style="top: ${topOffset}px;"></div>`;
            }
            return `
                <div class="sol-card ${card.color}" id="${card.id}" data-suit="${card.suit}" data-rank="${card.rank}" draggable="true" style="top: ${topOffset}px;">
                    <div style="display:flex; justify-content:space-between;">
                        <span>${card.rankStr}</span>
                        <span>${suitSymbols[card.suit]}</span>
                    </div>
                    <div style="display:flex; justify-content:center; align-items:center; flex-grow:1; font-size:32px;">
                        ${suitSymbols[card.suit]}
                    </div>
                    <div style="display:flex; justify-content:space-between; transform: rotate(180deg);">
                        <span>${card.rankStr}</span>
                        <span>${suitSymbols[card.suit]}</span>
                    </div>
                </div>
            `;
        }

        function renderPile($el, cards, isTableau = false) {
            $el.empty();
            cards.forEach((card, index) => {
                const offset = isTableau ? index * 20 : 0; // Stack or cascade
                const $card = $(getCardHTML(card, offset));
                
                // Make draggable if face up
                if (card.faceUp) {
                    $card.draggable({
                        revert: "invalid",
                        containment: ".solitaire-window",
                        stack: ".sol-card",
                        start: function(e, ui) {
                            $(this).css('z-index', 1000);
                        },
                        stop: function(e, ui) {
                            $(this).css('z-index', '');
                        }
                    });
                    $card.data("card", card);
                    $card.data("from-pile", isTableau ? "tableau" : "waste"); // Approximate
                }
                $el.append($card);
            });
            
            // Make piles droppable
            $el.droppable({
                accept: ".sol-card",
                drop: function(event, ui) {
                    const draggedCard = ui.draggable.data("card");
                    // Logic to handle drop... Simplified for this implementation
                    // Ideally we trace where it came from and update state
                }
            });
        }
        
        // Simplified Render - We just redraw everything on interactions for stability in this format
        function renderGame() {
            // Stock (Draw Pile)
            const $stock = $win.find("#sol-stock");
            $stock.empty();
            if (stock.length > 0) {
                $stock.append(`<div class="sol-card sol-card-back"></div>`);
                $stock.off('click').on('click', function() {
                    if(stock.length === 0) {
                        // Recycle waste
                        stock = waste.reverse();
                        stock.forEach(c => c.faceUp = false);
                        waste = [];
                    } else {
                        // Draw
                        const card = stock.pop();
                        card.faceUp = true;
                        waste.push(card);
                    }
                    renderGame();
                });
            } else if (waste.length > 0) {
                 // Empty stock placeholder to reset
                 $stock.append(`<div class="sol-placeholder" style="border-color:#555;">O</div>`);
                 $stock.off('click').on('click', function() {
                     stock = waste.reverse(); // Standard Klondike 1-card draw recycling
                     stock.forEach(c => c.faceUp = false);
                     waste = [];
                     renderGame();
                 });
            }

            // Waste
            const $waste = $win.find("#sol-waste");
            $waste.empty();
            if (waste.length > 0) {
                const topWaste = waste[waste.length-1];
                const $card = $(getCardHTML(topWaste, 0));
                
                // Make waste drag source
                $card.draggable({
                    revert: "invalid",
                    helper: "clone", // Drag a clone from waste usually
                    start: function() { $(this).hide(); },
                    stop: function() { $(this).show(); }
                });
                $card.data("origin", { type: 'waste' });
                $waste.append($card);
            }

            // Foundations
            foundations.forEach((pile, i) => {
                const $found = $win.find(`#sol-found-${i}`);
                $found.empty();
                 // Droppable logic
                $found.droppable({
                    accept: ".sol-card",
                    drop: function(event, ui) {
                        const origin = ui.draggable.data("origin");
                        const card = getDraggedCard(origin);
                        if(checkFoundationMove(card, i)) {
                            moveCard(origin, {type: 'foundation', index: i});
                            renderGame();
                        }
                    }
                });

                if (pile.length > 0) {
                    const top = pile[pile.length-1];
                    $found.append(getCardHTML(top, 0));
                }
            });

            // Tableau
            tableau.forEach((col, i) => {
                const $col = $win.find(`#sol-tab-${i}`);
                $col.empty();
                
                $col.droppable({
                    accept: ".sol-card",
                    drop: function(event, ui) {
                         const origin = ui.draggable.data("origin");
                         const card = getDraggedCard(origin);
                         // Check if we are dragging a stack?
                         // For simplicity, handle single card or stack logic
                         if(checkTableauMove(card, i)) {
                             moveCard(origin, {type: 'tableau', index: i});
                             renderGame();
                         }
                    }
                });

                col.forEach((card, cIndex) => {
                    const $card = $(getCardHTML(card, cIndex * 25));
                    
                    if (card.faceUp) {
                        $card.css('cursor', 'grab');
                        $card.draggable({
                            revert: "invalid",
                            stack: ".sol-card",
                            zIndex: 100,
                            // If it's not the top card, we need to drag children too visually
                            // Simplified: helper clone
                            helper: function() {
                                const $container = $(`<div></div>`);
                                // Get this card and all below it in this col
                                const stack = col.slice(cIndex);
                                stack.forEach((c, si) => {
                                    $container.append($(getCardHTML(c, si*25)));
                                });
                                return $container;
                            },
                             cursorAt: { top: 10, left: 10 }
                        });
                        $card.data("origin", { type: 'tableau', col: i, index: cIndex });
                    }
                    $col.append($card);
                });
                
                // Allow clicking hidden cards to prevent stuck games if logic fails (cheat/fix)
                // or legitimate expose
            });
        }

        function getDraggedCard(origin) {
            if(origin.type === 'waste') return waste[waste.length-1];
            if(origin.type === 'tableau') return tableau[origin.col][origin.index];
            if(origin.type === 'foundation') return foundations[origin.index][foundations[origin.index].length-1];
            return null;
        }

        function checkFoundationMove(card, foundIdx) {
            // Must be single card (waste or top of tableau)
            // But we passed card object. If from tableau, check if it has children?
            // Simplified: logic handles single card moves to foundation usually.
            
            const pile = foundations[foundIdx];
            if(pile.length === 0) {
                return card.rank === 1; // Ace
            }
            const top = pile[pile.length-1];
            return (card.suit === top.suit && card.rank === top.rank + 1);
        }

        function checkTableauMove(card, tableIdx) {
            const col = tableau[tableIdx];
            if(col.length === 0) {
                return card.rank === 13; // King
            }
            const top = col[col.length-1];
            return (card.color !== top.color && card.rank === top.rank - 1);
        }

        function moveCard(from, to) {
            let movingCards = [];
            
            // Remove from source
            if(from.type === 'waste') {
                movingCards = [waste.pop()];
            } else if(from.type === 'tableau') {
                movingCards = tableau[from.col].splice(from.index);
                // Reveal new top
                if(tableau[from.col].length > 0) {
                    tableau[from.col][tableau[from.col].length-1].faceUp = true;
                }
            } else if(from.type === 'foundation') {
                movingCards = [foundations[from.index].pop()];
            }

            // ADD to dest
            if(to.type === 'foundation') {
                foundations[to.index].push(movingCards[0]); // Can only move 1
            } else if(to.type === 'tableau') {
                tableau[to.index] = tableau[to.index].concat(movingCards);
            }
        }
        
        $win.find(".close-btn").click(function() {
            // Cleanup
        });

        deal();
    };

});
