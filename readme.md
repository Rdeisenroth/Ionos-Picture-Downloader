# Ionos-Picture-Downloader
## What is it?
A very basic tool to download pictures from Ionos Website Builder from 1&1 in the same structure that they are represented on the remote.
## Why?
Because 1&1 doesn't want you to get off their website-builder and provides no other way of downloading **all** images of a website at once than to manually click every single image, one at a time...
## Usage
- clone the repo
- run `npm i` (make sure nodejs is installed)
- login to the Website editor and open the picture uploading tool
- Press F12 and open the networks tab
- depending on ur browser you might have to select or deselect a folder to get the necessary get-Request (the url should be something like: `https://118.sb.mywebsite-editor.com/rest/websites/xxxxxxxxx/storage-files?folderId=xxxxx&search=`) and contain a `X-DiyCSRFToken`-Header.
- Either manually adjust the config or install postman, copy the request as curl, import it in postman and export it as node axios to get the correct config
- Also update the other hardcoded links accordingly (yes, i was lasy)
- run npm start and make sure that the programm has write access

## Disclaimer
This is not a feature-rich tool. I janked it together in ~25 Minutes and i will (likely) not develop it any further (unless enough people show interest). Feel free to contact me if you have any questions, or fork it and make it a decent tool.

Also the bad resolution of the files is due to compression by 1&1.