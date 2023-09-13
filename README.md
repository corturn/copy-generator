# COPY GENERATOR
#### Video Demo:  https://youtu.be/V893ZdQaQPE
#### Description:

While taking CS50, I was also working as a social media intern for Primo Artists, an artist management company. I created Copy Generator web app to help automate the process of tagging profiles on Instagram, Threads, Facebook, and X (Twitter). Copy Generator was built to automate my unique tasks at the company, but can be easily altered to meet the needs of others.<br>

## Main Features:

* User types or pastes into the Copy Box of ```index.html``` and the tagged, formatted copy is generated to the right.
* Click the generated copy to copy to clipboard.
* The Copy Generator function searches the plain text copy for any names that also exist in ```artists.db```. The function finds and replaces the first occurrence of profile names with the proper tags for all platforms. If the profile does not exist for any platform, the generator preserves the plain text name.
* When a name is found, the hashtags associated with that name are also added to the copy.
* Add new profiles to the database by adding a row at ```database.html``` after typing all relevant information in the input boxes.

* Database automatically self-sorts based on “Type” (Primo Artist, Artist, Presenter, Venue, Music Festival, Organization, Media Outlet).
* Hashtags are automatically sorted: Primo Artist, Artist, Presenter, Venue, Music Festival, Organization, Media Outlet, general.
* Automatically removes duplicate hashtags.
* Replaces straight quotes (" or ') with curly quotes.
* Adds emoji to TW when first word is a tag. Emoji can be customized for each profile, if two artists in a copy have a different custom emoji, the generator will use the default: 🎶.
* Uses checkbox for Threads since tag is always the same as Instagram.
* Add “%” before a tag to include plain text name before the tag (for cases when tag doesn’t provide enough information to distinguish the person/venue (i.e. @ItsGooz)).


## Built With:

* HTML
* CSS
* JavaScript
* JQuery
* SQLite
* Python
* Flask
* Jinja

## createDatabaseLayout.py

This Python file needs to be run one time to setup ```artists.db``` for use. It creates tables for profiles, profile types, and general tags

## artists.db

The ```artists.db``` SQLite database stores artist names, all of their tags, their type (which sorts the database), and their optional emoji.

## app.py

This is the Python file running Flask that generates the web app. It is in this file that all interactions with SQLite take place.<br>

This file also features the ```copygenerate(caption)``` function, which iterates over ```artists.db``` and replaces plain text names with their respective profiles if found.

## database.html

Using Python to select values from ```artists.db``` and Jinja to add elements to a table, ```database.html``` displays all profile information for each artist in ```artists.db```. Below each ```<td>``` other than the select menu and Threads checkbox, there is a hidden input group that is revealed on click. This allows ```artists.db``` to be edited with a friendly UI while also retaining visual clarity.

## script.js

Copy Generator uses JavaScript and JQuery to allow the user to edit ```artists.db``` and add new rows without needing to refresh. When the user edits data or adds a new row, that information is dynamically added to the page while ```artists.db``` is updated in the background.

## styles.css

The majority of the styling for the page is done through Bootstrap, though ```styles.css``` includes a few custom values. This css file is essential for hidden input fields to load hidden, and also for the "Copied to Clipboard!" alert to show properly.

## layout.html

All other html pages are appended to ```layout.html```. This creates a visually consistent header for the page and allows for navigation between pages.

## index.html

The main UI for generating copy. The user can type into the Copy Box and when they focus out the program will generate their copy in the area to the right. The user can click the area to copy the generated captions to the clipboard.

## other.html

This page is left somewhat open ended for potential future features and other needs. For now, it hosts the general hashtags, which are added to all posts automatically. These, like all of the ```database.html``` rows, can be edited by clicking.

# FUTURE FEATURES

I see this project having great use for social media teams and hope to expand on the generator in the future. The following are just a few ideas that could increase functionality:

* AI could greatly enhance the generator, helping automatically create and/or edit captions.
* I am interested in exploring using API calls to social media sites, making adding to the database an automated or at least partially automated process.