import { db } from './firebase.js';
import { collection, query, orderBy, startAt, endAt, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const searchBox = document.getElementById('search-box');
const searchButton = document.getElementById('search-button');
const blogSection = document.querySelector('.blogs-section');
const dropdownContainer = document.getElementById('autocomplete-dropdown');

let autocompleteData = [];

searchButton.addEventListener('click', searchBlogs);

function searchBlogs() {
    const searchValue = searchBox.value.trim().toLowerCase();

    if (searchValue === "") {
        fetchBlogs();
    } else {
        const q = query(
            collection(db, 'blogs'),
            orderBy('title'),
            startAt(searchValue),
            endAt(searchValue + '\uf8ff')
        );
        updateBlogs(q);
    }
}

const fetchBlogs = async () => {
    try {
        const q = query(collection(db, 'blogs'), orderBy('title'));
        updateBlogs(q);
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }
};

function updateBlogs(q) {
    autocompleteData = [];

    getDocs(q)
        .then((blogs) => {
            blogSection.innerHTML = '';
            if (blogs.size === 0) {
                displayNoResultsMessage();
            } else {
                blogs.forEach(blog => {
                    const data = blog.data();
                    autocompleteData.push({ title: data.title, id: blog.id });
                    createBlog(blog);
                });

                initializeAutocomplete();
            }
        })
        .catch(error => {
            console.error('Error updating blogs:', error);
        });
}

function displayNoResultsMessage() {
    const noResultsMessage = document.createElement('div');
    noResultsMessage.textContent = 'No results found.';
    blogSection.appendChild(noResultsMessage);
}



function createBlog(blog) {
    let data = blog.data();
    const blogCard = document.createElement('div');
    blogCard.className = 'blog-card';
    blogCard.innerHTML = `
        <img src="${data.bannerImage}" class="blog-image" alt="">
        <h1 class="blog-title">${data.title.substring(0, 100) + '...'}</h1>
        <p class="blog-overview">${data.article.substring(0, 200) + '...'}</p>
        <a href="/${blog.id}" class="read-btn">read</a>
    `;

    blogSection.appendChild(blogCard);
}

fetchBlogs();

function initializeAutocomplete() {
    if (searchBox.autocomplete) {
        searchBox.removeEventListener('input', handleAutocomplete);
    }

    searchBox.addEventListener('input', handleAutocomplete);
    document.addEventListener('click', handleDocumentClick);
}

function handleAutocomplete() {
    const searchTerm = searchBox.value.trim().toLowerCase();

    if (searchTerm === "") {
        dropdownContainer.style.display = 'none';
        return;
    }

    const filteredData = autocompleteData.filter(item =>
        item.title.toLowerCase().includes(searchTerm)
    );

    displayAutocompleteResults(filteredData);
}

function displayAutocompleteResults(results) {
    const dropdownContainer = document.getElementById('autocomplete-dropdown');

    dropdownContainer.innerHTML = '';

    results.forEach(result => {
        const dropdownItem = document.createElement('div');
        dropdownItem.className = 'autocomplete-item';
        dropdownItem.textContent = result.title;

        dropdownItem.addEventListener('click', () => {
            dropdownContainer.style.display = 'none';

            if (results.length === 1) {
               
                window.location.href = `/${result.id}`;
            } else {
               
                window.location.href = `/${result.id}`;
            }
        });

        dropdownContainer.appendChild(dropdownItem);
    });

    dropdownContainer.style.display = results.length ? 'block' : 'none';
}

function handleDocumentClick(event) {
    const dropdownContainer = document.getElementById('autocomplete-dropdown');

    if (!dropdownContainer.contains(event.target)) {
        dropdownContainer.style.display = 'none';
    } else {
        dropdownContainer.style.display = 'block';
    }
}


