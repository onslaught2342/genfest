$inputFile = Read-Host "Enter the input file name (with extension)"
$outputFile = Read-Host "Enter the output file name (with extension, e.g., output.webm)"
ffmpeg -i "$inputFile" -vf "colorkey=black:0.3:0.1,format=rgba" -c:v libvpx-vp9 -pix_fmt yuva420p "$outputFile"
