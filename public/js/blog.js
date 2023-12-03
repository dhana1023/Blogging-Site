import { db, doc, getDoc } from './firebase.js';
import { auth } from "./auth.js";

let blogId = decodeURI(location.pathname.split("/").pop());
let docRef = doc(db, "blogs", blogId);
let editBtn = document.getElementById('edit-blog-btn');

getDoc(docRef)
  .then((doc) => {
    if (doc.exists()) {
      // console.log('Document data:', doc.data());
      setupBlog(doc.data());
    } else {
      console.error('Document does not exist.');
      
    }
  })
  .catch((error) => {
    console.error('Error getting document:', error);
  });

const setupBlog = (data) => {
    const banner = document.querySelector('.banner');
    const blogTitle = document.querySelector('.title');
    const titleTag = document.querySelector('title');
    const publish = document.querySelector('.published');

    banner.style.backgroundImage = `url(${data.bannerImage})`;

    titleTag.innerHTML += blogTitle.innerHTML = data.title;
    publish.innerHTML += data.publishedAt;
    publish.innerHTML += ` -- ${data.author}`;

    auth.onAuthStateChanged((user) => {
      if (user) {
        if(data.author == auth.currentUser.displayName ){
          editBtn.style.display = "inline";
          editBtn.href = `${blogId}/editor`;
        }else{
          console.log("User is not the Author")
          editBtn.style.display = "none";
        }
      } else {
          console.error("User not authenticated.");
          editBtn.style.display = "none";
      }
  });

    const article = document.querySelector('.article');
    addArticle(article, data.article);
};

const addArticle = (ele, data) => {
    data = data.split("\n").filter(item => item.length);

    data.forEach(item => {
        if (item.startsWith('#')) {
            let hCount = item.match(/^#+/)[0].length;
            let tag = `h${hCount}`;
            ele.innerHTML += `<${tag}>${item.slice(hCount).trim()}</${tag}>`;
        } else if (item.startsWith("![") && item.includes("](") && item.endsWith(")")) {
            let alt = item.match(/\[([^\]]+)\]/)[1];
            let src = item.match(/\(([^)]+)\)/)[1];
            ele.innerHTML += `<img src="${src}" alt="${alt}" class="article-image">`;
        } else {
            ele.innerHTML += `<p>${item}</p>`;
        }
    });
};


