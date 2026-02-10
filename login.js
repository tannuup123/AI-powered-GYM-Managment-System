<!-- Firebase Scripts -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>

<script>
  // ✅ Firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyC-oca5z39s7l77EDY_Jx1psRroWtfZ2pM",
    authDomain: "fit-track-be443.firebaseapp.com",
    projectId: "fit-track-be443",
    storageBucket: "fit-track-be443.firebasestorage.app",
    messagingSenderId: "485684449281",
    appId: "1:485684449281:web:88991ce3596959c0433000",
    measurementId: "G-ZD4NTCKQH7"
  };

  // 🔥 Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const database = firebase.database();

  // 👁 Toggle Password Visibility
  function togglePassword() {
    const passwordField = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");

    if (passwordField.type === "password") {
      passwordField.type = "text";
      eyeIcon.classList.remove("fa-eye");
      eyeIcon.classList.add("fa-eye-slash");
    } else {
      passwordField.type = "password";
      eyeIcon.classList.remove("fa-eye-slash");
      eyeIcon.classList.add("fa-eye");
    }
  }

  // 🚪 Login Handler
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.querySelector('input[name="email"]').value.trim();
    const password = document.querySelector('input[name="password"]').value;

    if (email === "" || password === "") {
      alert("Please enter both email and password.");
      return;
    }

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const uid = userCredential.user.uid;

        // 🔍 Check role (member, trainer, or owner)
        const userTypes = ["members", "trainers", "owners"];
        let roleFound = false;

        userTypes.forEach((type) => {
          database.ref(`${type}/${uid}`).once("value", (snapshot) => {
            if (snapshot.exists() && !roleFound) {
              roleFound = true;
              // ✅ Redirect to respective dashboard
              switch (type) {
                case "members":
                  window.location.href = "member_dashboard.html";
                  break;
                case "trainers":
                  window.location.href = "trainer_dashboard.html";
                  break;
                case "owners":
                  window.location.href = "owner_dashboard.html";
                  break;
              }
            }
          });
        });

        // If user type isn't found
        setTimeout(() => {
          if (!roleFound) {
            alert("User role not found in database.");
          }
        }, 2000); // wait 2 seconds for role check
      })
      .catch((error) => {
        alert("Login failed: " + error.message);
      });
  });
</script>
