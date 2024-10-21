// Function to load external HTML (header, footer, etc.)
function includeHTML() {
    // Select elements with [data-include-html] attribute
    const includes = document.querySelectorAll('[data-include-html]');
    
    includes.forEach(async (el) => {
        const file = el.getAttribute('data-include-html');
        if (file) {
            try {
                const response = await fetch(file); // Fetch file contents
                if (!response.ok) throw new Error('File not found');
                el.innerHTML = await response.text(); // Insert HTML content
            } catch (error) {
                console.error(`Error loading ${file}: `, error); // Handle errors
                el.innerHTML = '<p>Error loading content</p>';
            }
        }
    });
}

// Helper function to get a query parameter from URL (e.g., "id")
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to load the list of posts on the homepage
async function loadPosts() {
    const postsContainer = document.getElementById('posts');
    if (!postsContainer) return; // If posts container doesn't exist

    try {
        const response = await fetch('content.json'); // Fetch post data
        if (!response.ok) throw new Error(`Could not fetch posts`);
        const posts = await response.json(); // Parse the JSON response
        
        postsContainer.innerHTML = ''; // Clear any existing content

        // Loop through the posts and generate HTML for each one
        posts.forEach(post => {
            const postElement = document.createElement('article');

            // Conditional image check
            const imageHTML = post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image-homepage">` : '';

            // Inject post data into the article element
            postElement.innerHTML = `
                ${imageHTML}
                <h3>${post.title}</h3>
                <p>${post.summary}</p>
                <div class="post-meta">Published on: ${post.date}</div>
                <a href="post.html?id=${post.id}">Read more</a>
            `;

            postsContainer.appendChild(postElement); // Append post to the container
        });
    } catch (error) {
        console.error(`Error loading posts: `, error);
        postsContainer.innerHTML = '<p>Error loading posts</p>';
    }
}

// Function to load the content of a single post on the post detail page
async function loadPost() {
    const postId = getQueryParam('id'); // Get post ID from URL
    const postTitle = document.getElementById('post-title');
    const postDate = document.getElementById('post-date');
    const postContent = document.getElementById('post-content');
    
    if (!postId || !postTitle || !postDate || !postContent) return; // Safety check

    try {
        const response = await fetch('content.json'); // Fetch posts data
        if (!response.ok) throw new Error('Could not fetch posts');
        const posts = await response.json(); // Parse JSON

        const post = posts.find(p => p.id == postId); // Find the specific post by ID
        
        if (post) {
            postTitle.textContent = post.title;
            postDate.textContent = `Published on: ${post.date}`;

            const imageHTML = post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image-detail">` : '';
            postContent.innerHTML = imageHTML;

            // Fetch the full content HTML
            try {
                const contentResponse = await fetch(post.content_file);
                if (!contentResponse.ok) throw new Error('Content file not found');
                postContent.innerHTML += await contentResponse.text();
            } catch (contentError) {
                console.error(`Error loading post content: `, contentError);
                postContent.innerHTML += "<p>Error loading post content.</p>";
            }
        } else {
            postTitle.textContent = "Post not found";
            postContent.innerHTML = "<p>The post you're looking for doesn't exist.</p>";
        }
    } catch (error) {
        console.error(`Error loading post: `, error);
        postTitle.textContent = "Error loading post";
        postContent.innerHTML = "<p>There was an issue loading the post.</p>";
    }
}

// DOM Loaded Event Handler
document.addEventListener('DOMContentLoaded', () => {
    includeHTML(); // Load dynamic components (header, footer, etc.)

    // Check if on homepage to load posts
    if (document.getElementById('posts')) {
        loadPosts();
    }
    // Check if on post detail page to load individual post
    if (document.getElementById('post-title')) {
        loadPost();
    }
});