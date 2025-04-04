// Initialize Firebase Authentication and Database
const db = firebase.firestore();
const auth = firebase.auth();
const user = auth.currentUser;

window.onload = function() {
  if (!user) {
    window.location.href = "login.html"; // Redirect if not logged in
  }

  document.getElementById("user-name").textContent = user.displayName || user.email;

  // Fetch and display user's study groups
  fetchUserGroups();
};

function fetchUserGroups() {
  db.collection("groups").where("members", "array-contains", user.uid)
    .get()
    .then(snapshot => {
      const groupList = document.getElementById("group-list");
      snapshot.forEach(doc => {
        const group = doc.data();
        const groupElement = document.createElement("div");
        groupElement.classList.add("group-item");
        groupElement.innerHTML = `
          <h3>${group.name}</h3>
          <p>${group.description}</p>
          <a href="group-chat.html?groupId=${doc.id}">Join Group</a>
        `;
        groupList.appendChild(groupElement);
      });
    })
    .catch(error => console.error("Error fetching groups:", error));
}

// Handle new group creation
const createGroupForm = document.getElementById("create-group-form");
createGroupForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const groupName = document.getElementById("group-name").value;
  const groupDescription = document.getElementById("group-description").value;

  db.collection("groups").add({
    name: groupName,
    description: groupDescription,
    members: [user.uid]
  }).then(() => {
    alert("Group created successfully!");
    window.location.href = "dashboard.html";
  }).catch(error => {
    console.error("Error creating group:", error);
  });
});
