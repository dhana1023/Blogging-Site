import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "./firebase.js";

const auth = getAuth();
const provider = new GoogleAuthProvider();
const signInButton = document.getElementById("signInButton");
const message = document.getElementById("message");
const dashboardLink = document.getElementById("dashboardLink");
// const editorLink = document.getElementById("editorLink");

signInButton.addEventListener("click", () => {
  const user = auth.currentUser;

  if (user) {
    signOut(auth)
      .then(() => {
        showMessage(`${user.displayName} has successfully signed out.`);
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  } else {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        showMessage(`${user.displayName} has successfully signed in with Google using ${user.email}`);
      })
      .catch((error) => {
        console.error("Sign in error:", error);
      });
  }
});

const showMessage = (text) => {
  if (message) {
    message.textContent = text;
    message.classList.add("show");
    setTimeout(() => {
      message.classList.remove("show");
    }, 3000);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    signInButton.querySelector("button").textContent = "Sign Out";
    dashboardLink.style.display = "inline";
    // editorLink.style.display = "inline";  
  } else {
    signInButton.querySelector("button").textContent = "Sign In with Google";
    dashboardLink.style.display = "none";
    // editorLink.style.display = "none"; 
    if (window.location.pathname.includes("/admin")) {
      window.location.href = "/";
    }
    // if (window.location.pathname.includes("/editor")) {
    //   window.location.href = "/";
    // }
  }
 
});


export {auth};