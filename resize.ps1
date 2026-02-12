Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('c:\Users\Hakan\Project\SonVagon\indir.jfif')
Write-Host "Width: $($img.Width), Height: $($img.Height)"

$ratio = [Math]::Min(1920 / $img.Width, 1920 / $img.Height)
if ($ratio -lt 1) {
    $newW = [int]($img.Width * $ratio)
    $newH = [int]($img.Height * $ratio)
} else {
    $newW = $img.Width
    $newH = $img.Height
}

$bmp = New-Object System.Drawing.Bitmap($newW, $newH)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = 'HighQualityBicubic'
$g.DrawImage($img, 0, 0, $newW, $newH)

$ep = [System.Drawing.Imaging.EncoderParameters]::new(1)
$ep.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, 40L)
$jpgCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$bmp.Save('c:\Users\Hakan\Project\SonVagon\indir_small.jpg', $jpgCodec, $ep)

$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Host "Saved smaller version"
