Add-Type -AssemblyName System.Drawing

$assets = "C:\Users\PC MARKET CI\millenium\public\assets"

function New-Placeholder($path, $w, $h) {
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(23,76,50), [System.Drawing.Color]::FromArgb(13,45,30), 135)
    $g.FillRectangle($brush, $rect)
    $g.Dispose(); $brush.Dispose()
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "OK $(Split-Path $path -Leaf) ($w x $h)"
}

# Placeholders aux chemins référencés dans public/config.json
New-Placeholder (Join-Path $assets "placeholder-hero.jpg")         1920 1080
New-Placeholder (Join-Path $assets "placeholder-case-study.jpg")   900  640
New-Placeholder (Join-Path $assets "placeholder-guiss.jpg")        400  400
New-Placeholder (Join-Path $assets "placeholder-sieni.jpg")        400  400

Write-Host "`n== Placeholders générés =="