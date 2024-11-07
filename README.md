
# YouTube Timestamp Bookmarker Extension for Firefox

An intuitive Firefox extension to bookmark your favorite moments in YouTube videos with ease. Save timestamps, organize them, and revisit anytime—all within your browser.

## Features

- **Instant Bookmarking**: Press the big, full-width "+" button in the extension's GUI to capture the current video's share URL with the exact timestamp.
- **Organized Bookmark List**:
  - Displays the **video title**.
  - Shows the **timestamp duration** (e.g., `1:20`).
  - Notes **when the bookmark was created**.
- **Manage Your Bookmarks**:
  - **Remove** bookmarks with the "-" minus button.
  - **Archive** bookmarks for future reference.
- **Archive Access**: A dedicated button at the bottom lets you view your archived bookmarks.
- **Persistent Storage**: Your bookmarks are saved locally and remain intact even after restarting the browser.

## Installation

1. **Download the Extension**:
   - Clone or download this repository to your local machine.

2. **Load into Firefox**:
   - Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
   - Click on **"Load Temporary Add-on..."**.
   - Select the `manifest.json` file from the extension folder.

   > **Note**: This will load the extension temporarily. For permanent installation, you need to package the extension and sign it via [Mozilla's Add-on Developer Hub](https://addons.mozilla.org/en-US/developers/).

## Usage

1. **Bookmark a YouTube Timestamp**:
   - While watching a YouTube video, click the extension icon in the Firefox toolbar.
   - In the extension's popup, click the big "+" button to save the current timestamp.

2. **View and Manage Bookmarks**:
   - Click the extension icon to see your list of bookmarks.
   - Each entry shows the video title, timestamp, and creation date.
   - Use the "-" button to remove a bookmark.
   - Click the archive button to move a bookmark to the archive.

3. **Access Archived Bookmarks**:
   - At the bottom of the bookmarks list, click the archive button to view archived items.

## Notes

- **Timestamp Linking**: Bookmarks use YouTube's shareable URL format with timestamps (e.g., `https://youtu.be/VIDEO_ID?t=80`).
- **Browser Compatibility**: Designed specifically for Firefox.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for enhancements or bug fixes.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or suggestions, please open an issue or contact [Rumman Kalam](mailto:rumman@rantages.com).

---