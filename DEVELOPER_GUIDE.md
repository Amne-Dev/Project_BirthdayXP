# Developer Guide: Customizing Project_BirthdayXP

This guide explains how to add new text files, create new applications, and modify the Windows XP simulation.

## 1. Adding New Text Files

The file system in this project is simulated using a JavaScript object structure in `script.js`. You do not need to create actual files on your computer; you just define them in the code.

### Step-by-Step:
1.  Open `script.js`.
2.  Search for the `const fileSystem` object (usually around line 240).
3.  Navigate to the directory (path) where you want to add the file. Directories are keys in the object (e.g., `"C:/Users/Amine/Desktop"`).
4.  Add a new object to the array for that directory.

### Configuration Format:
```javascript
{
    name: "Filename.ext",   // The name displayed in File Explorer
    type: "file",           // Must be "file"
    icon: "icon_type",      // Icon key (txt, doc, py, mp3, zip, etc.)
    content: "Your text content here.\nNew lines use \\n."
}
```

### Example: Adding a Note to the Desktop
To add `MyNote.txt` to the Desktop:

```javascript
"C:/Users/Amine/Desktop": [
    // ... existing files ...
    {
        name: "MyNote.txt",
        type: "file",
        icon: "txt",
        content: "Hello!\nThis is a custom text file."
    }
],
```

### Supported Extensions & Icons:
Check the `iconMap` object in `script.js` to see available icon types:
- `txt`: Notepad file
- `doc`: WordPad document
- `py`: Python script
- `mp3`: Audio file
- `zip`: Zip archive

---

## 2. Adding New Applications

Adding a new "app" involves creating a function that generates the window HTML and registering it.

### Step 1: Create the Window Function
Add a new function in `script.js` (e.g., `createMyAppWindow`).

```javascript
window.createMyAppWindow = function() {
    const id = "window-myapp-" + Date.now(); // Unique ID
    
    // HTML Structure for the window
    const $win = $(`
        <div class="window-container window" id="${id}" style="top: 100px; left: 100px; width: 400px; height: 300px;">
            <div class="title-bar">
                <div class="title-bar-text">My Application</div>
                <div class="title-bar-controls">
                    <button aria-label="Close" class="close-btn"></button>
                </div>
            </div>
            <div class="window-body">
                <!-- AMNE-DEV: Your App HTML Goes Here -->
                <h1>Hello World</h1>
                <button id="btn-${id}">Click Me</button>
            </div>
        </div>
    `);

    // Add to Desktop
    $("#desktop").append($win);
    
    // Make it visible and draggable (setupWindow helper)
    $win.addClass("window-visible").show();
    setupWindow($win, id);
    
    // Add to Taskbar
    registerWindow(id, "My Application", "default"); // "default" is the icon type

    // Add Logic
    $win.find(`#btn-${id}`).click(function() {
        alert("Button clicked!");
    });
};
```

### Step 2: Add to Start Menu (Optional)
1. Open `index.html`.
2. Find the `<div class="start-col right-col">` or `left-col` section.
3. Add a new item:

```html
<div class="start-item" onclick="createMyAppWindow()">
    <img src="path/to/icon.png">
    <span>My App</span>
</div>
```

---

## 3. Adding to the "Run" Command
If you want to open your app via the internal `openWindow(id)` logic:
1. Go to `window.openWindow` in `script.js`.
2. Add a condition:

```javascript
if (id === "myapp") {
    createMyAppWindow();
    return;
}
```

## 4. Key Functions Reference
- `setupWindow($win, id)`: Handles basic window behaviors (drag, z-index, close button logic).
- `registerWindow(id, title, type)`: Adds the window button to the taskbar.
- `closeWindow(id)`: Closes the window and removes it from the taskbar.
- `showNotification(title, message, type)`: Shows a balloon notification in the tray.
