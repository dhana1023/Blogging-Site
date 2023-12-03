import { db } from './firebase.js';
import { auth } from './auth.js';
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');

const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
});

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
});

function generateDocName() {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `blog-${timestamp}-${randomString}`;
}

const uploadImage = async (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if (file && file.type.includes("image")) {
        const formdata = new FormData();
        formdata.append('image', file);

        try {
            const res = await fetch('/upload', {
                method: 'post',
                body: formdata
            });

            if (!res.ok) {
                throw new Error(`Failed to upload image: ${res.status}`);
            }

            const data = await res.json();

            if (uploadType === "image") {
                addImage(data, file.name);
            } else {
                bannerPath = `${location.origin}/${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        } catch (error) {
            console.error('Image Upload Error:', error);
            alert("Failed to upload image. Please try again.");
        }
    } else {
        alert("Upload image only");
    }
};

const addImage = (imagepath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

publishBtn.addEventListener('click', async () => {
    if (articleField.value.length && blogTitleField.value.length) {
        const date = new Date();
        const blogTitle = blogTitleField.value.split(" ").join("-");
        const docName = generateDocName();

        try {
            const user = auth.currentUser;

            if (user) {
                await setDoc(doc(db, 'blogs', docName), {
                    title: blogTitleField.value,
                    article: articleField.value,
                    bannerImage: bannerPath,
                    publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
                    author: user.displayName || "Anonymous"
                });

                location.href = `/${docName}`;
            } else {
                console.error('User is not authenticated.');
                alert('User is not authenticated. Please log in to publish a blog.');
            }
        } catch (error) {
            console.error('Firebase Error:', error);
            alert("Failed to publish blog. Please try again.");
        }
    }
});
