import { db, setDoc, doc, getDoc } from './firebase.js';
import { auth } from './auth.js';

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

        if (!blogTitleField.value.trim() || !bannerPath) {
            alert('Please enter a title and upload a banner image.');
            return;
        }

        const date = new Date();
        let docName;

        if (blogID === 'editor') { // Use '===' for strict comparison
            // generating id
            let letters = 'abcdefghijklmnopqrstuvwxyz';
            let blogTitle = blogTitleField.value.split(" ").join("-");
            let id = '';
            for (let i = 0; i < 4; i++) {
                id += letters[Math.floor(Math.random() * letters.length)];
            }
            docName = `${blogTitle}-${id}`;
        } else {
            docName = decodeURI(blogID);
        }

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
                alert('User is not authenticated. Please Sign In to publish a blog.');
            }
        } catch (error) {
            console.error('Firebase Error:', error);
            alert("Failed to publish blog. Please try again.");
        }
    } else {
        alert('Please enter both a title and article before publishing.');
    }
});


const blogID = location.pathname.split("/").filter(Boolean)[0]; 

if (blogID !== "editor") {
    const docRef = doc(db, "blogs", decodeURI(blogID));

    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(docSnap.data());
            if(docSnap.exists){
                let data = docSnap.data();
                bannerPath = data.bannerImage;
                banner. style.backgroundImage = `url(${bannerPath})`;
                blogTitleField.value = data.title;
                articleField. value = data.article;
            }else{
                location.replace("/");
           
            }
        } else {
            console.log("Blog not found");
        }
    } catch (error) {
        console.error("Error fetching blog:", error);
    }
}
