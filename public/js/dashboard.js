import { db, getDocs, collection, query, where } from "./firebase.js";
import { auth } from './auth.js';

const blogSection = document.querySelector('.blogs-section');

auth.onAuthStateChanged((user) => {
    if (user) {
        getUserWrittenBlogs();
    } else {
        console.error("User not authenticated.");
    }
});

const getUserWrittenBlogs = async () => {
    try {
        const q = query(collection(db, 'blogs'), where("author", "==", auth.currentUser.displayName));
        const blogsSnapshot = await getDocs(q);

        blogsSnapshot.forEach((blog) => {
            createBlog(blog);
        });
    } catch (error) {
        console.error("Error getting blogs:", error);
    }
}

const createBlog = (blog)  => { 
    let data = blog.data();
    blogSection.innerHTML += `
    <div class="blog-card">
        <img src="${data.bannerImage}" class="blog-image" alt="">
        <h1 class="blog-title">${data.title.substring(0, 100) + '...'}</h1>
        <p class="blog-overview">${data.article.substring(14, 200) + '...'}</p>
        <div class="blog-buttons">
        <a href="/${blog.id}" class="read-btn">Read</a>
        <a href="/" class="edit-btn">Edit</a>
        <a href="/" class="delete-btn">Delete</a>
    </div></div>
    `;
}



