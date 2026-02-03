(() => {
  // <stdin>
  (function() {
    "use strict";
    const postsContainer = document.getElementById("posts-container");
    const loadingIndicator = document.getElementById("loading-indicator");
    if (!postsContainer) return;
    let isLoading = false;
    let currentPage = 1;
    let hasNextPage = postsContainer.dataset.hasNext === "true";
    let nextPageUrl = postsContainer.dataset.nextUrl;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoading && hasNextPage) {
          loadMorePosts();
        }
      });
    }, {
      root: null,
      rootMargin: "200px",
      // Start loading 200px before reaching the bottom
      threshold: 0.1
    });
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
        const doc = parser.parseFromString(html, "text/html");
        const newPostsContainer = doc.getElementById("posts-container");
        if (newPostsContainer) {
          const newPosts = newPostsContainer.querySelectorAll(".post-card");
          newPosts.forEach((post) => {
            postsContainer.appendChild(post.cloneNode(true));
          });
          currentPage++;
          hasNextPage = newPostsContainer.dataset.hasNext === "true";
          nextPageUrl = newPostsContainer.dataset.nextUrl;
          postsContainer.dataset.hasNext = hasNextPage;
          postsContainer.dataset.nextUrl = nextPageUrl;
        }
      } catch (error) {
        console.error("Error loading more posts:", error);
        hasNextPage = false;
      } finally {
        isLoading = false;
        hideLoading();
        if (!hasNextPage && loadingIndicator) {
          loadingIndicator.style.display = "none";
        }
      }
    }
    function showLoading() {
      if (loadingIndicator) {
        loadingIndicator.classList.add("loading");
        loadingIndicator.style.opacity = "1";
      }
    }
    function hideLoading() {
      if (loadingIndicator) {
        loadingIndicator.classList.remove("loading");
        loadingIndicator.style.opacity = "0.5";
      }
    }
    if (!("IntersectionObserver" in window)) {
      window.addEventListener("scroll", function() {
        if (isLoading || !hasNextPage) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        if (scrollTop + windowHeight >= documentHeight - 500) {
          loadMorePosts();
        }
      });
    }
  })();
})();
