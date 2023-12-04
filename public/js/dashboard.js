import { db, doc, deleteDoc, getDocs, getDoc, collection, query, where } from "./firebase.js";
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

        blogSection.addEventListener('click', (event) => {
            const deleteBtn = event.target.closest('.delete-btn');
            if (deleteBtn) {
                const blogId = deleteBtn.dataset.blogId;
                handleDelete(event, blogId);
            }
        });


    } catch (error) {
        console.error("Error getting blogs:", error);
    }
}


const createBlog = (blog) => { 
    let data = blog.data();
    blogSection.innerHTML += `
        <div class="blog-card">
            <img src="${data.bannerImage}" class="blog-image" alt="">
            <h1 class="blog-title">${data.title.substring(0, 100) + '...'}</h1>
            <p class="blog-overview">${data.article.substring(14, 200) + '...'}</p>
            <div class="blog-buttons">
                <a href="/${blog.id}" class="read-btn">Read</a>
                <a href="/${blog.id}/editor" class="edit-btn">Edit</a>
                <a href="#" data-blog-id="${blog.id}" class="delete-btn">Delete</a>
            </div>
        </div>
    `;
    
    const deleteBtn = document.querySelector(`[data-blog-id="${blog.id}"]`);
    deleteBtn.addEventListener('click', (event) => handleDelete(event, blog.id));
}

const handleDelete = async (event, blogId) => {
    event.preventDefault();
    event.stopPropagation(); 

    try {
        const isConfirmed = confirm("Are you sure you want to delete this blog?");
        if (!isConfirmed) {
            return;
        }

        await deleteBlog(blogId);
        alert("Blog deleted successfully!");
        location.reload();
    } catch (error) {
        console.error("Error deleting the blog:", error);
        alert("Error deleting the blog. Please try again.");
    }
};

const deleteBlog = async (id) => {
    try {
        const blogRef = doc(db, "blogs", id);
        const blogSnapshot = await getDoc(blogRef);

        if (blogSnapshot.exists()) {
            await deleteDoc(blogRef);
        } else {
            console.error("Blog not found");
        }
    } catch (error) {
        console.error("Error deleting the blog:", error);
        throw error; 
    }
};








