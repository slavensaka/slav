/**
 * Infinite Scroll for Blog Posts
 * Works on desktop and mobile browsers
 */
(function() {
  'use strict';

  const postsContainer = document.getElementById('posts-container');
  const loadingIndicator = document.getElementById('loading-indicator');

  if (!postsContainer) return;

  let isLoading = false;
  let currentPage = 1;
  let hasNextPage = postsContainer.dataset.hasNext === 'true';
  let nextPageUrl = postsContainer.dataset.nextUrl;

  // Create Intersection Observer for efficient scroll detection
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isLoading && hasNextPage) {
        loadMorePosts();
      }
    });
  }, {
    root: null,
    rootMargin: '200px', // Start loading 200px before reaching the bottom
    threshold: 0.1
  });

  // Observe the loading indicator
  if (loadingIndicator) {
    observer.observe(loadingIndicator);
  }

  async function loadMorePosts() {
    if (isLoading || !hasNextPage || !nextPageUrl) return;

    isLoading = true;
    showLoading();

    try {
      const response = await fetch(nextPageUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract new posts
      const newPostsContainer = doc.getElementById('posts-container');
      if (newPostsContainer) {
        const newPosts = newPostsContainer.querySelectorAll('.post-card');

        // Append new posts to the container
        newPosts.forEach(post => {
          postsContainer.appendChild(post.cloneNode(true));
        });

        // Update pagination data
        currentPage++;
        hasNextPage = newPostsContainer.dataset.hasNext === 'true';
        nextPageUrl = newPostsContainer.dataset.nextUrl;

        // Update the container's data attributes
        postsContainer.dataset.hasNext = hasNextPage;
        postsContainer.dataset.nextUrl = nextPageUrl;
      }

    } catch (error) {
      console.error('Error loading more posts:', error);
      hasNextPage = false;
    } finally {
      isLoading = false;
      hideLoading();

      // If no more pages, hide the loading indicator
      if (!hasNextPage && loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }
    }
  }

  function showLoading() {
    if (loadingIndicator) {
      loadingIndicator.classList.add('loading');
      loadingIndicator.style.opacity = '1';
    }
  }

  function hideLoading() {
    if (loadingIndicator) {
      loadingIndicator.classList.remove('loading');
      loadingIndicator.style.opacity = '0.5';
    }
  }

  // Fallback for older browsers without Intersection Observer
  if (!('IntersectionObserver' in window)) {
    window.addEventListener('scroll', function() {
      if (isLoading || !hasNextPage) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Load more when user is 500px from bottom
      if (scrollTop + windowHeight >= documentHeight - 500) {
        loadMorePosts();
      }
    });
  }
})();
