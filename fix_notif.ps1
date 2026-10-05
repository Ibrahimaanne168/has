 = Get-Content -Path 'src\lib\useNotifications.ts' -Raw  
 =  -replace 'renotify: true,[\r\n\s]+data: \{ url \},[\r\n\s]+// @ts-expect-error.*[\r\n\s]+vibrate: \[200, 100, 200\],', 'data: { url },'  
Set-Content -Path 'src\lib\useNotifications.ts' -Value  -NoNewline 
