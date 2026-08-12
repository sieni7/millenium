Add-Type -AssemblyName System.Drawing

$assets = "C:\Users\PC MARKET CI\millenium\public\assets"

function Add-RoundedCorner([System.Drawing.Bitmap]$src, [int]$radius) {
    $w = $src.Width; $h = $src.Height
    if ($radius -gt $w/2) { $radius = [int]($w/2) }
    if ($radius -gt $h/2) { $radius = [int]($h/2) }
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $d = $radius * 2
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(0, 0, $d, $d, 180, 90)
    $path.AddArc($w - $d, 0, $d, $d, 270, 90)
    $path.AddArc($w - $d, $h - $d, $d, $d, 0, 90)
    $path.AddArc(0, $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()

    $g.SetClip($path)
    $g.DrawImageUnscaled($src, 0, 0)
    $g.ResetClip()
    $g.Dispose()
    $src.Dispose()
    return $dest
}

function Resize-To-Width([System.Drawing.Bitmap]$src, [int]$width) {
    $ratio = $width / $src.Width
    $height = [int][Math]::Round($src.Height * $ratio)
    $dest = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($src, 0, 0, $width, $height)
    $g.Dispose()
    return $dest
}

function Save-Png([System.Drawing.Bitmap]$img, [string]$path) {
    $ms = New-Object System.IO.MemoryStream
    $img.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    [System.IO.File]::WriteAllBytes($path, $ms.ToArray())
    $ms.Dispose()
}

# ── 1. LOGO HEADER — ~200px de large, radius 5 ──
$hdr = New-Object System.Drawing.Bitmap((Join-Path $assets "logo_header.png"))
$hdrSmall = Resize-To-Width $hdr 200
$hdr.Dispose()
$hdrR = Add-RoundedCorner $hdrSmall 5
Save-Png $hdrR (Join-Path $assets "logo_header.png")
"logo_header.png -> $($hdrR.Width)x$($hdrR.Height), radius 5"
$hdrR.Dispose()

# ── 2. LOGO FOOTER — ~220px (carré), radius 5 ──
$ftr = New-Object System.Drawing.Bitmap((Join-Path $assets "logo_footer.png"))
$ftrSmall = Resize-To-Width $ftr 220
$ftr.Dispose()
$ftrR = Add-RoundedCorner $ftrSmall 5
Save-Png $ftrR (Join-Path $assets "logo_footer.png")
"logo_footer.png -> $($ftrR.Width)x$($ftrR.Height), radius 5"
$ftrR.Dispose()

Get-ChildItem (Join-Path $assets "logo_header.png"), (Join-Path $assets "logo_footer.png") | Select-Object Name, Length | Format-Table -AutoSize

# ── 3. ICÔNES PWA depuis la source favicon ──
$icons = Join-Path $assets "icons"
New-Item -ItemType Directory -Path $icons -Force | Out-Null
$favSrc = New-Object System.Drawing.Bitmap((Join-Path $assets "logo__favico.png"))
$favR = Add-RoundedCorner $favSrc 229
$sizes = @{
    "favicon-16x16.png" = 16
    "favicon-32x32.png" = 32
    "icon-192.png"      = 192
    "icon-512.png"      = 512
    "apple-touch-icon.png" = 180
}
foreach ($kv in $sizes.GetEnumerator()) {
    $ratio = $kv.Value / $favR.Width
    $dim = [int][Math]::Round($favR.Height * $ratio)
    $small = New-Object System.Drawing.Bitmap($kv.Value, $dim, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($small)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($favR, 0, 0, $kv.Value, $dim)
    $g.Dispose()
    Save-Png $small (Join-Path $icons $kv.Key)
    $small.Dispose()
    "$($kv.Key) OK ($($kv.Value)x$dim)"
}
$favR.Dispose()
Get-ChildItem $icons | Select-Object Name, Length | Format-Table -AutoSize