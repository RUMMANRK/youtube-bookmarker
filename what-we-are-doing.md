This is for Cursor to understand what the project is about.

I need to make a chrome YouTube bookmarker extension that does the following:

1. When the big full width horizontal + plus is pressed on the extension's gui, it's a  button that adds On the current YouTube page, grab the share URL with the current timestamp. E.g. if the video is at 1:20 seconds, then it should be something like this:  https://youtu.be/hPHH5trgC1w?t=80 where t=80 is the parameter to seek the video to the 80 second mark which is 1 minute 20 seconds. 

2. Then this shared URL should be added to a list which will be the GUI of the extension when we click on its icon on the Firefox toolbar.

2.1 The list should have the title of the video, then underneath the title, the duration of the timestamp and when the bookmark was created. 

2.1. Each item on the list should have - minus button to remove the item. It should also have another button for archiving. 

2.1. A small button at the bottom for accessing the archive.

This list should be retained even when the browser quits or is restarted.
