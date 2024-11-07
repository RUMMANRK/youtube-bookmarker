document.addEventListener('DOMContentLoaded', () => {
    const addBookmarkBtn = document.getElementById('addBookmark');
    const bookmarkList = document.getElementById('bookmarkList');
    const viewArchiveBtn = document.getElementById('viewArchive');
  
    addBookmarkBtn.addEventListener('click', addBookmark);
    viewArchiveBtn.addEventListener('click', viewArchive);
  
    loadBookmarks();
  
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
      
              // Include videoId in the bookmark object
              const bookmark = { title, url, timestamp, dateAdded, videoId };
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
  
    async function loadBookmarks() {
      try {
        const result = await browser.storage.local.get('bookmarks');
        const bookmarks = result.bookmarks || [];
        bookmarks.forEach(renderBookmark);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }
  
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
        removeBtn.textContent = '-';
        removeBtn.addEventListener('click', () => removeBookmark(bookmark, li));
        actions.appendChild(removeBtn);
      
        const archiveBtn = document.createElement('button');
        archiveBtn.textContent = 'Archive';
        archiveBtn.addEventListener('click', () => archiveBookmark(bookmark, li));
        actions.appendChild(archiveBtn);
      
        li.appendChild(actions);
        bookmarkList.appendChild(li);
      }
      
      
      
  
    async function removeBookmark(bookmark, listItem) {
      try {
        const result = await browser.storage.local.get('bookmarks');
        const bookmarks = result.bookmarks || [];
        const updatedBookmarks = bookmarks.filter(b => b.url !== bookmark.url);
        await browser.stoxrage.local.set({ bookmarks: updatedBookmarks });
        listItem.remove();
      } catch (error) {
        console.error('Error removing bookmark:', error);
      }
    }
  
    async function archiveBookmark(bookmark, listItem) {
      try {
        const storage = await browser.storage.local.get(['bookmarks', 'archives']);
        const bookmarks = storage.bookmarks || [];
        const archives = storage.archives || [];
        archives.push(bookmark);
        const updatedBookmarks = bookmarks.filter(b => b.url !== bookmark.url);
        await browser.storage.local.set({ bookmarks: updatedBookmarks, archives });
        listItem.remove();
      } catch (error) {
        console.error('Error archiving bookmark:', error);
      }
    }
  
    function viewArchive() {
      // Logic to display archived bookmarks
      alert('Archive feature coming soon!');
    }
  
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  });
  