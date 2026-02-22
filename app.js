import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDShOz9kvrUskPEpYy2nYHtKWMbz56vTc",
  authDomain: "yafustudio.firebaseapp.com",
  projectId: "yafustudio",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.register = async function(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await createUserWithEmailAndPassword(auth, email, password);
  alert("สมัครสำเร็จ");
  window.location.href = "index.html";
}

window.login = async function(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await signInWithEmailAndPassword(auth, email, password);
  alert("เข้าสู่ระบบสำเร็จ");
  window.location.href = "index.html";
}

window.createPost = async function(){
  const user = auth.currentUser;
  if(!user){
    alert("กรุณาเข้าสู่ระบบก่อน");
    return;
  }

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  await addDoc(collection(db,"posts"),{
    title,
    content,
    uid: user.uid,
    createdAt: new Date()
  });

  alert("โพสต์สำเร็จ");
  window.location.href = "index.html";
}

window.loadPosts = async function(){
  const postsDiv = document.getElementById("posts");
  if(!postsDiv) return;

  const querySnapshot = await getDocs(collection(db,"posts"));
  postsDiv.innerHTML = "";

  querySnapshot.forEach((doc)=>{
    const post = doc.data();
    postsDiv.innerHTML += `
      <div class="post">
        <h3>${post.title}</h3>
        <p>${post.content}</p>
      </div>
    `;
  });
}

onAuthStateChanged(auth,(user)=>{
  const authArea = document.getElementById("authArea");
  if(!authArea) return;

  if(user){
    authArea.innerHTML = `
      <p>Logged in as ${user.email}</p>
      <button onclick="logout()">Logout</button>
    `;
  }else{
    authArea.innerHTML = `
      <a href="login.html">Login</a> |
      <a href="register.html">Register</a>
    `;
  }
});

window.logout = async function(){
  await signOut(auth);
  window.location.reload();
}
