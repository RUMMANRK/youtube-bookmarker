document.addEventListener('DOMContentLoaded', () => {
  const addBookmarkBtn = document.getElementById('addBookmark');
  const bookmarkList = document.getElementById('bookmarkList');
  const archiveList = document.getElementById('archiveList'); 
  const viewArchiveBtn = document.getElementById('viewArchive');
  const backButton = document.getElementById('backButton'); 
  const themeToggleButton = document.getElementById('themeToggleButton'); 

  // SVG icons as strings
  const lightModeIcon = `
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path fill="currentColor" d="M12 17q-2.075 0-3.537-1.463T7 12t1.463-3.537T12 7t3.538 1.463T17 12t-1.463 3.538T12 17m-7-4H1v-2h4zm18 0h-4v-2h4zM11 5V1h2v4zm0 18v-4h2v4zM6.4 7.75L3.875 5.325L5.3 3.85l2.4 2.5zm12.3 12.4l-2.425-2.525L17.6 16.25l2.525 2.425zM16.25 6.4l2.425-2.525L20.15 5.3l-2.5 2.4zM3.85 18.7l2.525-2.425L7.75 17.6l-2.425 2.525z"/>
  </svg>
  `;

  const darkModeIcon = `
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path fill="currentColor" d="M12.058 20q-3.334 0-5.667-2.333T4.058 12q0-3.039 1.98-5.27t4.904-2.634q.081 0 .159.006t.153.017q-.506.706-.801 1.57T10.158 7.5q0 2.667 1.866 4.533t4.534 1.867q.951 0 1.813-.295t1.548-.801q.012.075.017.153t.006.159q-.384 2.923-2.615 4.903T12.057 20"/>
  </svg>
  `;

  const removeIconSVG = `
  <svg width="24" height="24" viewBox="0 0 24 24">
    <g fill="currentColor">
      <path d="M8 11a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2z"/>
      <path fill-rule="evenodd" d="M1 5a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4zm4-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2" clip-rule="evenodd"/>
    </g>
  </svg>
  `;

  const archiveIconSVG = `
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path fill="currentColor" d="m12 18l4-4l-1.4-1.4l-1.6 1.6V10h-2v4.2l-1.6-1.6L8 14zM5 8v11h14V8zm0 13q-.825 0-1.412-.587T3 19V6.525q0-.35.113-.675t.337-.6L4.7 3.725q.275-.35.687-.538T6.25 3h11.5q.45 0 .863.188t.687.537l1.25 1.525q.225.275.338.6t.112.675V19q0 .825-.587 1.413T19 21zm.4-15h13.2l-.85-1H6.25zm6.6 7.5"/>
  </svg>
  `;

  addBookmarkBtn.addEventListener('click', addBookmark);
  viewArchiveBtn.addEventListener('click', viewArchive);
  backButton.addEventListener('click', showBookmarks);
  themeToggleButton.addEventListener('click', toggleTheme);

  loadBookmarks();
  loadThemePreference();

  // Function to add a bookmark
  async function addBookmark() {
      try {
          const tabs = await browser.tabs.query({ active: true, currentWindow: true });
          const tab = tabs[0];
          if (tab.url.includes('youtube.com/watch')) {
              const response = await browser.tabs.sendMessage(tab.id, { action: 'getVideoInfo' });
              if (response) {
                  const { title, currentTime, videoId } = response;
                  const timestamp = Math.floor(currentTime);
                  const url = `https://www.youtube.com/watch?v=${videoId}&t=${timestamp}s`;
                  const dateAdded = new Date().toLocaleString();

                  // Generate a unique ID for the bookmark
                  const bookmarkId = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>(c ^ (Math.random() * 16) >> c / 4).toString(16));

                  // Include id in the bookmark object
                  const bookmark = { id: bookmarkId, title, url, timestamp, dateAdded, videoId };
                  await saveBookmark(bookmark);
                  renderBookmark(bookmark);
              }
          } else {
              alert('Please navigate to a YouTube video.');
          }
      } catch (error) {
          console.error('Error adding bookmark:', error);
      }
  }

  // Function to save a bookmark
  async function saveBookmark(bookmark) {
      try {
          const result = await browser.storage.local.get('bookmarks');
          const bookmarks = result.bookmarks || [];
          bookmarks.push(bookmark);
          await browser.storage.local.set({ bookmarks });
      } catch (error) {
          console.error('Error saving bookmark:', error);
      }
  }

  // Function to load bookmarks
  async function loadBookmarks() {
      try {
          const result = await browser.storage.local.get('bookmarks');
          const bookmarks = result.bookmarks || [];
          bookmarks.forEach(renderBookmark);
      } catch (error) {
          console.error('Error loading bookmarks:', error);
      }
  }

  // Function to render a bookmark
  function renderBookmark(bookmark) {
      const li = document.createElement('li');
      li.className = 'bookmark-item';

      // Thumbnail hyperlink
      const thumbnailLink = document.createElement('a');
      thumbnailLink.href = bookmark.url;
      thumbnailLink.target = '_blank';

      // Thumbnail image
      const thumbnail = document.createElement('img');
      thumbnail.className = 'bookmark-thumbnail';
      thumbnail.src = `https://img.youtube.com/vi/${bookmark.videoId}/0.jpg`;
      thumbnail.alt = `Thumbnail for ${bookmark.title}`;
      thumbnail.style.width = '100%';

      thumbnailLink.appendChild(thumbnail);
      li.appendChild(thumbnailLink);

      // Title hyperlink
      const titleLink = document.createElement('a');
      titleLink.className = 'bookmark-title';
      titleLink.textContent = bookmark.title;
      titleLink.href = bookmark.url;
      titleLink.target = '_blank';
      li.appendChild(titleLink);

      // Bookmark details
      const details = document.createElement('div');
      details.className = 'bookmark-details';
      details.textContent = `Timestamp: ${formatTime(bookmark.timestamp)} | Added: ${bookmark.dateAdded}`;
      li.appendChild(details);

      // Action buttons
      const actions = document.createElement('div');
      actions.className = 'bookmark-actions';

      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = removeIconSVG; // Use SVG icon
      removeBtn.addEventListener('click', () => removeBookmark(bookmark, li));
      actions.appendChild(removeBtn);

      const archiveBtn = document.createElement('button');
      archiveBtn.innerHTML = archiveIconSVG; // Use SVG icon
      archiveBtn.addEventListener('click', () => archiveBookmark(bookmark, li));
      actions.appendChild(archiveBtn);

      li.appendChild(actions);
      bookmarkList.appendChild(li);
  }

  // Function to remove a bookmark
  async function removeBookmark(bookmark, listItem) {
      try {
          const result = await browser.storage.local.get('bookmarks');
          const bookmarks = result.bookmarks || [];
          const updatedBookmarks = bookmarks.filter(b => b.id !== bookmark.id);
          await browser.storage.local.set({ bookmarks: updatedBookmarks });
          listItem.remove();
      } catch (error) {
          console.error('Error removing bookmark:', error);
      }
  }

  // Function to archive a bookmark
  async function archiveBookmark(bookmark, listItem) {
      try {
          const storage = await browser.storage.local.get(['bookmarks', 'archives']);
          const bookmarks = storage.bookmarks || [];
          const archives = storage.archives || [];

          // Update the dateAdded to reflect the archive date
          bookmark.dateAdded = new Date().toLocaleString();
          archives.push(bookmark);

          const updatedBookmarks = bookmarks.filter(b => b.id !== bookmark.id);
          await browser.storage.local.set({ bookmarks: updatedBookmarks, archives });
          listItem.remove();
      } catch (error) {
          console.error('Error archiving bookmark:', error);
      }
  }

  // Function to view the archive
  async function viewArchive() {
      // Hide the bookmarks view
      bookmarkList.style.display = 'none';
      addBookmarkBtn.style.display = 'none';
      viewArchiveBtn.style.display = 'none';

      // Show the archives view
      archiveList.style.display = 'block';
      backButton.style.display = 'block';

      // Clear any existing items in the archive list
      archiveList.innerHTML = '';

      // Load and display archived bookmarks
      await loadArchives();
  }

  // Function to load archives
  async function loadArchives() {
      try {
          const result = await browser.storage.local.get('archives');
          const archives = result.archives || [];
          archives.forEach(renderArchive);
      } catch (error) {
          console.error('Error loading archives:', error);
      }
  }

  // Function to render an archived bookmark
  function renderArchive(bookmark) {
      const li = document.createElement('li');
      li.className = 'bookmark-item';

      // Thumbnail hyperlink
      const thumbnailLink = document.createElement('a');
      thumbnailLink.href = bookmark.url;
      thumbnailLink.target = '_blank';

      // Thumbnail image
      const thumbnail = document.createElement('img');
      thumbnail.className = 'bookmark-thumbnail';
      thumbnail.src = `https://img.youtube.com/vi/${bookmark.videoId}/0.jpg`;
      thumbnail.alt = `Thumbnail for ${bookmark.title}`;
      thumbnail.style.width = '100%';

      thumbnailLink.appendChild(thumbnail);
      li.appendChild(thumbnailLink);

      // Title hyperlink
      const titleLink = document.createElement('a');
      titleLink.className = 'bookmark-title';
      titleLink.textContent = bookmark.title;
      titleLink.href = bookmark.url;
      titleLink.target = '_blank';
      li.appendChild(titleLink);

      // Bookmark details
      const details = document.createElement('div');
      details.className = 'bookmark-details';
      details.textContent = `Timestamp: ${formatTime(bookmark.timestamp)} | Archived: ${bookmark.dateAdded}`;
      li.appendChild(details);

      // Action buttons
      const actions = document.createElement('div');
      actions.className = 'bookmark-actions';

      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = removeIconSVG; // Use SVG icon
      removeBtn.addEventListener('click', () => removeArchive(bookmark, li));
      actions.appendChild(removeBtn);

      const restoreBtn = document.createElement('button');
      restoreBtn.textContent = 'Restore'; // You can replace with an icon if desired
      restoreBtn.addEventListener('click', () => restoreBookmark(bookmark, li));
      actions.appendChild(restoreBtn);

      li.appendChild(actions);
      archiveList.appendChild(li);
  }

  // Function to remove an archived bookmark
  async function removeArchive(bookmark, listItem) {
      try {
          const result = await browser.storage.local.get('archives');
          const archives = result.archives || [];
          const updatedArchives = archives.filter(b => b.id !== bookmark.id);
          await browser.storage.local.set({ archives: updatedArchives });
          listItem.remove();
      } catch (error) {
          console.error('Error removing archive:', error);
      }
  }

  // Function to restore an archived bookmark
  async function restoreBookmark(bookmark, listItem) {
      try {
          const storage = await browser.storage.local.get(['bookmarks', 'archives']);
          const bookmarks = storage.bookmarks || [];
          const archives = storage.archives || [];

          bookmarks.push(bookmark);
          const updatedArchives = archives.filter(b => b.id !== bookmark.id);

          await browser.storage.local.set({ bookmarks, archives: updatedArchives });
          listItem.remove();
      } catch (error) {
          console.error('Error restoring bookmark:', error);
      }
  }

  // Function to show the bookmarks view
  function showBookmarks() {
      // Hide the archives view
      archiveList.style.display = 'none';
      backButton.style.display = 'none';

      // Show the bookmarks view
      bookmarkList.style.display = 'block';
      addBookmarkBtn.style.display = 'block';
      viewArchiveBtn.style.display = 'flex';
  }

  // Function to toggle the theme
  async function toggleTheme() {
      try {
          const body = document.body;
          body.classList.toggle('dark-mode');

          // Update the button icon
          if (body.classList.contains('dark-mode')) {
              themeToggleButton.innerHTML = lightModeIcon;
          } else {
              themeToggleButton.innerHTML = darkModeIcon;
          }

          // Save the theme preference
          await browser.storage.local.set({ theme: body.classList.contains('dark-mode') ? 'dark' : 'light' });
      } catch (error) {
          console.error('Error toggling theme:', error);
      }
  }

  // Function to load the theme preference
  async function loadThemePreference() {
      try {
          const result = await browser.storage.local.get('theme');
          const theme = result.theme || 'light';

          if (theme === 'dark') {
              document.body.classList.add('dark-mode');
              themeToggleButton.innerHTML = lightModeIcon;
          } else {
              document.body.classList.remove('dark-mode');
              themeToggleButton.innerHTML = darkModeIcon;
          }
      } catch (error) {
          console.error('Error loading theme preference:', error);
      }
  }

  // Function to format time in mm:ss
  function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
});
