# EdgeR
**Disclaimer:**  This is not actually malicious software, It's been created for entertainment purposes and is not in any way intended to cause any real damage. You will also be given a super handy uninstall.exe once EdgeR is installed if you ever need to get rid of it fast and easy.
<br>


# About
EdgeR is fetishware that continuously spammes the user with image, video, and audio pop ups of their choice at a customisable rate. EdgeR is more or less just a clone of Edgeware with much better UI, more frequent updates (probably), and a few extra quality of life changes such as being able to pause and resume popups from the system tray.


**This project is inspired by PetitTournesol's [Edgeware](https://github.com/PetitTournesol/Edgeware) I suggest checking it out if you enjoy EdgeR.**
<br>


# How to use
1) Download the zip file
2) Unzip and open the unzipped folder
3) Run EdgeR.exe (this should create a desktop icon)


- Most settings and buttons have tool tips explaining how they work if you hover over them.
- If you would like to request features let me know on [Twitter / X](https://twitter.com/700mps)


# FAQ
`Q:How do I get passed the windows defender warning` <br> A: Click on more info and it will give you a button to run EdgeR anyway. <br><br>
`Q:Is there anything that makes EdgeR better than Edgeware` <br> A: It depends what your looking for, EdgeR has much better UI and customizability with the trade off of having a few less features however i'm working on updates to bring more functionality to the app. <br><br>
`Q:Does this app work on mac/linux` <br> A: EdgeR is built using electron so it should be at least partially useable but I have not tested it on anything other than windows <br><br>
`Q:When will the full version of EdgeR be released` <br> A: The current plan is to have the full version (1.0.0) done and available by June 2024. However there will be more updates before then to add content and fix bugs.<br><br>


# Downloads
> - [v0.8.4 - Zip](https://github.com/700Maps/EdgeR/releases/download/V0.8.3-beta/EdgeR.v0.8.4.zip)
> - [v0.8.4 - Source code](https://github.com/700Maps/EdgeR/archive/refs/tags/V0.8.3-beta.zip)




>- [v0.7.3 - Zip](https://github.com/700Maps/EdgeR/releases/download/V0.7.2-beta/Edger.public.zip)
>- [v0.7.3 - Source code](https://github.com/700Maps/EdgeR/archive/refs/tags/V0.7.2-beta.zip)


# Editing
EdgeR is under the [MIT licence](https://github.com/700Maps/EdgeR/blob/main/LICENSE) therefor you have the ability to copy, modify, merge, publish, or distribute copies of EdgeR however you wish. This also means that EdgeR is given to you without any kind of warranty and I am not responsible for damages or other liability.


- **This is not required but if you are publishing modified copied of edgeR it would be a cool move if you credited me ;)**


# Versions

**V0.8.4**
> - Fixed the tray icon not loading

**V0.8.3 - Shapeshift**
> - Close button can now be disabled
> - Close button can now be fixed to any corner
> - Custom captions can now be overlayed on all popup types
> - Captions now have style options
> - Added new caption editor window
> - Videos can now close automatically after it plays
> - Videos can now change to another video after it plays
> - Videos can now be unmuted
> - Audio windows can now have their content looped
> - Audio windows can now be hidden when created
> - Able to now set custom details and state on discord rich presence
> - Can now choose the maximum and minimum size of popups
> - Can now choose to wait a random amount of time before each popup appears
> - Pop Ups can now be limited to only one per opportunity with multiple types of media enabled
> - A custom amount of popups (1 - 99) can be chosen to appear at every opportunity
> - Link to EdgeR GitHub now goes to the EdgeR repo not my profile
> - Enabled scroll on the y axis in index.html
> - Improved the Readme file (More sections, better explanations, Better formatting, Included versions)
> - Removed and rewrote some redundant code

> - Fixed captions in caption editor not syncing with what's displayed on popups
> - Fixed being able to scroll past all the content on a page
> - Fixed some spelling mistakes (sorry im mega dyslexic xd)


**V0.7.3**
> - Fixed the warnings created when a folder is selected that has no useable material to now correctly show what file types are accepted
> - Cleaned up the code a little bit and labelled things better


**V0.7.2**
> - Fixed resume breaking the app if you pressed while popups were appearing


**V0.7.1**
> - Fixed the app breaking if you pressed while popups were appearing
> - Added a resume button to the tray menu
> - Fixed the app not showing on discord when the box is checked and the program is closed and reopened
> - Sliders now set to whatever number is in the box when a number is manually entered
> - Sliders now set to the proper place when preferences are open
> - Added and option to measure time in milliseconds
> - Fixed windows not appearing as much on the right side of the screen (I think)


**V0.7.0 - Better content**
> - Allowed user to choose a folder for video content
> - Changed video popups to use a video element instead of an iframe
> - Made EdgeR show on discord using rich presence
> - Added a toggle for discord rich presence (off by default lol)
> - Added audio popups
> - Allowed for the user to choose a folder for audio content
> - Fixed video pop ups appearing across the whole screen
> - Fixed content in video popups not fitting to the window
> - Added settings to choose what kind of popups you want
> - Added some safeguards for missing numbers, everything being disabled etc...


**V0.6.0 - Smooth ui**
> - Improved preferences visuals
> - Made the window fade toggle in preferences work
> - Allowed the user to change how long until the window fades out in preferences
> - Made cool sliders to quickly change some settings
> - Fixed preferences resetting once you reopen the home screen
> - Added a version history thing so you can easily look at this inside the app
> - Added some other extra links for fun
> - Fixed some buttons that weren't darkening when hovered over
> - Added some labelling and help sections so people understand what things do
> - Commented out a bunch of testing stuff
> - I see why games and the like are always delayed now, it takes a long ass time to polish stuff and get rid of bugs


**V0.5.9**
> - Changed the alert about missing folder paths to a notification
> - Moved the code to check for missing folder paths to a preload script
> - Made the missing folder path notification work for videos and audio boxes
> - Added a button allowing the user to choose a folder from their pc to be used instead of copy pasting the folder path
> - Can now read the contents of a given folder and get images from inside
> - will now use the images from the designated folder when creating popups instead of a premade list of paths


**V0.4.9**
> - Fixed file paths not working when backslashes were included
> - Added a more control section allowing for more restrictions on the pc
> - I have officially crashed my pc over 20 times while working on this 8)


**V0.4.8**
> - Can now get and display images by using a file path


**V0.4.7**
> - Cleaned up the code in main.js index.html image.html and prelaod.js
> - Fixed an error in the popup frequency that caused the function to be executed in milliseconds instead of seconds


**V0.4.6**
> - Added default settings for when preferences are unset
> - Preferences are now remembered


**V0.4.5**
> - Allow the frequency of popups to be change in preferences
> - Fixed the taskbar icon not using the proper image
> - Added video popups (still buggy)
> - Changed the index to look nice
> - Added a cancel button in preferences


**V0.3.5**
> - Fixed popup windows so they scale to the image inside of them
> - updated tray icon


**V0.3.4**
> - Fixed popups closing when show desktop is used
> - Fixed popups being created off screen
> - Fixed popup background repeating
> - Popup image now centres in the window
> - Moved the popup timer to main.js
> - Added functionality to the "freeze" tray option


**V0.2.4**
> - Moved popup windows to be created in main.js
> - Removed pop ups appearing in the taskbar
> - Made popup always on top
> - Fixed popups closing when the main window is closed
> - Allowed the main window to be reopened via the tray


**V0.1.4**
> - Removed popup frame
> - Removed popup resize
> - Added a custom close button to popups


**V0.1.3**
> - Added functionality to the "quit" tray option
> - Removed the default menu


**V0.1.2**
> - Added buttons in the main window to bring up different pages. about, settings, etc
> - Popup windows now display a random background wallpaper
> - Added a tray icon
> - Added tray icon placeholder options
> - You can now set popup window to appear automatically every 1 second


**V0.0.2**
> - The popup window now appears with a random width and height and at random coordinates across the screen


**V0.0.1**
> - Created a base window and a popup window
