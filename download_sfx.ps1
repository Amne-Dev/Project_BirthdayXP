$files = @{
    "startup.mp3" = "https://www.myinstants.com/media/sounds/windows-xp-startup.mp3"
    "shutdown.mp3" = "https://www.myinstants.com/media/sounds/windows-xp-shutdown.mp3"
    "error.mp3" = "https://www.myinstants.com/media/sounds/windows-xp-error.mp3"
    "ding.mp3" = "https://www.myinstants.com/media/sounds/windows-xp-ding.mp3"
    "hardware_insert.mp3" = "https://www.myinstants.com/media/sounds/windows-xp-hardware-insert.mp3"
    "hardware_remove.mp3" = "https://www.myinstants.com/media/sounds/windows-xp-hardware-remove.mp3"
    "balloon.mp3" = "https://www.myinstants.com/media/sounds/windows-xp-balloon-sound.mp3"
    "navigation_start.mp3" = "https://www.myinstants.com/media/sounds/klick.mp3"
}

$dest = "assets"
if (!(Test-Path $dest)) { New-Item -ItemType Directory -Path $dest }

foreach ($name in $files.Keys) {
    $url = $files[$name]
    $path = Join-Path $dest $name
    Write-Host "Downloading $name..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $path -ErrorAction Stop
        Write-Host "Success."
    } catch {
        Write-Host "Failed to download $name from $url"
        # Create dummy file to prevent 404s in console if download fails?
        # New-Item -Path $path -ItemType File -Force
    }
}
