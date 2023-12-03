import { db } from './firebase.js';
import { collection, query, orderBy, startAt, endAt, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const searchBox = document.getElementById('search-box');
const searchButton = document.getElementById('search-button');
const searchSection = document.querySelector('.search-result');
const dropdownContainer = document.getElementById('autocomplete-dropdown');

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
        updateBlogs(searchValue, q);
    }
}

const fetchBlogs = async () => {
    try {
        const q = query(collection(db, 'blogs'), orderBy('title'));
        updateBlogs("", q); 
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }
};

function updateBlogs(searchValue, q) {
    searchSection.innerHTML = '';

    getDocs(q)
        .then((blogs) => {
            if (blogs.size === 0) {
                displayNoResultsMessage();
            } else {
                const autocompleteData = [];

                blogs.forEach(blog => {
                    const data = blog.data();
                    autocompleteData.push({ title: data.title, id: blog.id });
                });

                // Initialize autocomplete functionality with searchValue and autocompleteData
                initializeAutocomplete(searchValue, autocompleteData);
            }
        })
        .catch(error => {
            console.error('Error updating blogs:', error);
        });
}

function displayNoResultsMessage() {
    const noResultsMessage = document.createElement('div');
    noResultsMessage.textContent = 'No specific result found upon your search.';
    searchSection.appendChild(noResultsMessage);

    setTimeout(() => {
        noResultsMessage.style.opacity = '0';
        setTimeout(() => {
            noResultsMessage.remove();
        }, 500); 
    }, 5000);
}

fetchBlogs();

function initializeAutocomplete(searchValue, autocompleteData) {
    if (searchBox.autocomplete) {
        searchBox.removeEventListener('input', handleAutocomplete);
    }

    searchBox.addEventListener('input', function () {
        handleAutocomplete(searchValue, autocompleteData);
    });
    document.addEventListener('click', handleDocumentClick);
}

function handleAutocomplete(searchValue, autocompleteData) {
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
