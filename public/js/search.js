
import { db } from './firebase.js';
import { collection, query, orderBy, startAt, endAt, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const searchBox = document.getElementById('search-box');
const searchButton = document.getElementById('search-button');
const blogSection = document.querySelector('.blogs-section');

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
    blogSection.innerHTML = ''; 
    autocompleteData = []; 

    getDocs(q)
        .then((blogs) => {
            blogs.forEach(blog => {
               
                const data = blog.data();
                autocompleteData.push({ title: data.title, id: blog.id });
            });

            initializeAutocomplete();
        })
        .catch(error => {
            console.error('Error updating blogs:', error);
        });
}

fetchBlogs();

function initializeAutocomplete() {

    if (searchBox.autocomplete) {
        searchBox.removeEventListener('input', handleAutocomplete);
    }

    searchBox.addEventListener('input', handleAutocomplete);
}

function handleAutocomplete() {
    const searchTerm = searchBox.value.trim().toLowerCase();

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
        
            window.location.href = `/${result.id}`;
        });

        dropdownContainer.appendChild(dropdownItem);
    });


    dropdownContainer.style.display = results.length ? 'block' : 'none';
}

