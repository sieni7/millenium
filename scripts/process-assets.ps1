Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Drawing.Drawing2D

$assets = "C:\Users\PC MARKET CI\millenium\public\assets"
$icons  = Join-Path $assets "icons"

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

function Resize-Image([System.Drawing.Bitmap]$src, [int]$size) {
    $dest = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($src, 0, 0, $size, $size)
    $g.Dispose()
    return $dest
}

# ── 1. LOGO HEADER (2134x648) — bords arrondis ──
$hdr = New-Object System.Drawing.Bitmap((Join-Path $assets "logo_millenium_logo_header.png"))
$hdrR = Add-RoundedCorner $hdr 52
$hdrR.Save((Join-Path $assets "logo_header.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$hdrR.Dispose()
Write-Host "logo_header.png OK (2134x648, radius 52)"

# ── 2. LOGO FOOTER (2134x1703) — bords arrondis ──
$ftr = New-Object System.Drawing.Bitmap((Join-Path $assets "logo_millenium_logo_footer.png"))
$ftrR = Add-RoundedCorner $ftr 136
$ftrR.Save((Join-Path $assets "logo_footer.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$ftrR.Dispose()
Write-Host "logo_footer.png OK (2134x1703, radius 136)"

# ── 3. FAVICON (depuis logo_millenium_logo_favico.png 1042x1042) ──
$favSrc = New-Object System.Drawing.Bitmap((Join-Path $assets "logo_millenium_logo_favico.png"))
$favR = Add-RoundedCorner $favSrc 229   # ~22% radius, style iOS/PWA
$sizes = @{
    "favicon-16x16.png" = 16
    "favicon-32x32.png" = 32
    "icon-192.png"      = 192
    "icon-512.png"      = 512
    "apple-touch-icon.png" = 180
}
foreach ($kv in $sizes.GetEnumerator()) {
    $small = Resize-Image $favR $kv.Value
    $small.Save((Join-Path $icons $kv.Key), [System.Drawing.Imaging.ImageFormat]::Png)
    $small.Dispose()
    Write-Host "$($kv.Key) OK ($($kv.Value)x$($kv.Value))"
}

# ── favicon.ico (16/32/48) ──
$ico16 = Resize-Image $favR 16
$ico32 = Resize-Image $favR 32
$ico48 = Resize-Image $favR 48
$icoStream = New-Object System.IO.MemoryStream
$ico16.Save($icoStream, [System.Drawing.Imaging.ImageFormat]::Png)
$ico32.Save($icoStream, [System.Drawing.Imaging.ImageFormat]::Png)
$ico48.Save($icoStream, [System.Drawing.Imaging.ImageFormat]::Png)
# System.Drawing n'écrit pas l'ICO nativement; on écrit le .ico via encodage PNG dans ICO.
$icoPath = Join-Path $assets "favicon.ico"
$fs = [System.IO.File]::Open($icoPath, [System.IO.FileMode]::Create)
$bw = New-Object System.IO.BinaryWriter($fs)
$bw.Write([UInt16]0)
$bw.Write([UInt16]1)
$bw.Write([UInt16]3)
$entries = @(@($ico16,16), @($ico32,32), @($ico48,48))
foreach ($e in $entries) {
    $bw.Write([Byte]$e[1])          # width
    $bw.Write([Byte]$e[1])          # height
    $bw.Write([Byte]0)              # colors
    $bw.Write([Byte]0)              # reserved
    $bw.Write([UInt16]1)            # planes
    $bw.Write([UInt16]32)           # bpp
    $bw.Write([UInt32]0)            # size (patched)
    $bw.Write([UInt32]0)            # offset (patched)
}
$offset = 6 + 16 * 3
for ($i = 0; $i -lt 3; $i++) {
    $e = $entries[$i]
    $img = $e[0]
    $ms = New-Object System.IO.MemoryStream
    $img.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $bytes = $ms.ToArray()
    $ms.Dispose()
    $dirPos = 6 + $i * 16
    $cur = $fs.Position
    $fs.Seek($dirPos + 8, [System.IO.SeekOrigin]::Begin)
    $bw.Write([UInt32]$bytes.Length)
    $bw.Write([UInt32]$offset)
    $fs.Seek(0, [System.IO.SeekOrigin]::End)
    $fs.Write($bytes, 0, $bytes.Length)
    $offset += $bytes.Length
}
$bw.Flush()
$bw.Close()
$fs.Close()
$ico16.Dispose(); $ico32.Dispose(); $ico48.Dispose(); $favR.Dispose()
Write-Host "favicon.ico OK (16/32/48)"

Write-Host "`n== Assets mis à jour =="