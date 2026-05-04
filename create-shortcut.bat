@echo off
echo Creating Team Wellness Dashboard shortcut on desktop...

powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%USERPROFILE%\Desktop\Team Wellness Dashboard.lnk'); $s.TargetPath = 'msedge.exe'; $s.Arguments = '--app=http://localhost:3000/wellness-dashboard --window-size=1400,900'; $s.WorkingDirectory = '%USERPROFILE%'; $s.Save()"

echo Shortcut created successfully on your desktop!
echo Double-click 'Team Wellness Dashboard' on your desktop to open the wellness dashboard.
pause
