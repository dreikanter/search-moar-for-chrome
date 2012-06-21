@echo off
echo Loading extension: "%~dp0sources"
start %localappdata%\Google\Chrome\Application\chrome --load-extension="%~dp0sources"
