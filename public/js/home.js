import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const blogSection = document.querySelector('.blogs-section');

const fetchBlogs = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'blogs'));

        querySnapshot.forEach((blog) => {
            if (blog.id !== decodeURI(location.pathname.split("/").pop())) {
                createBlog(blog);
            }
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }
};

fetchBlogs();

function createBlog(blog) {
    let data = blog.data();
    blogSection.innerHTML += `
    <div class="blog-card">
        <img src="${data.bannerImage}" class="blog-image" alt="">
        <h1 class="blog-title">${data.title.substring(0, 100) + '...'}</h1>
        <p class="blog-overview">${data.article.substring(0, 200) + '...'}</p>
        <a href="/${blog.id}" class="btn dark">read</a>
    </div>
    `;
}
