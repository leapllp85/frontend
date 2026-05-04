Set WshShell = WScript.CreateObject("WScript.Shell")
strDesktop = WshShell.SpecialFolders("Desktop")
Set oShortcut = WshShell.CreateShortcut(strDesktop & "\Team Wellness Dashboard.url")
oShortcut.TargetPath = "d:\mywork\ews\frontend\wellness-dashboard-shortcut.html"
oShortcut.Save
WScript.Echo "Shortcut updated at: " & strDesktop & "\Team Wellness Dashboard.url"
