import { db } from './firebase.js';
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

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
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const blogTitle = blogTitleField.value.split(" ").join("-");
        let id = '';
        for (let i = 0; i < 4; i++) {
            id += letters[Math.floor(Math.random() * letters.length)];
        }

        const docName = `${blogTitle}-${id}`;

        try {
            await addDoc(collection(db, 'blogs'), {
                title: blogTitleField.value,
                article: articleField.value,
                bannerImage: bannerPath,
                publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
            });

            location.href = `/${docName}`;
        } catch (error) {
            console.error('Firebase Error:', error);
            alert("Failed to publish blog. Please try again.");
        }
    }
});
