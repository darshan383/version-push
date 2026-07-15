import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";



const Dashboard = () => {
    const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/repo/user/${userId}`
        );
        const data = await response.json();
        setRepositories(data.repositories);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data);
        console.log(suggestedRepositories);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery == "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);


  const handleDelete = async (repoId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this repository?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://localhost:3000/repo/delete/${repoId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    alert(data.message);

    setRepositories((prev) =>
      prev.filter((repo) => repo._id !== repoId)
    );

    setSearchResults((prev) =>
      prev.filter((repo) => repo._id !== repoId)
    );
  } catch (err) {
    console.error(err);
    alert("Unable to delete repository.");
  }
};

const handleEdit = async (repo) => {
  const newDescription = prompt(
    "Update repository description",
    repo.description
  );

  if (newDescription === null) return;

  try {
    const response = await fetch(
      `http://localhost:3000/repo/update/${repo._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: newDescription,
          content: "",
        }),
      }
    );

    const data = await response.json();

    alert(data.message);

    const updatedRepos = repositories.map((r) =>
      r._id === repo._id
        ? { ...r, description: newDescription }
        : r
    );

    setRepositories(updatedRepos);
    setSearchResults(updatedRepos);

  } catch (err) {
    console.error(err);
    alert("Unable to update repository.");
  }
};

  return (
    <>
      <Navbar />
      <section id="dashboard">
        

        <aside className="left-sidebar">

  <div className="profile-card">

    <img
      src="https://avatars.githubusercontent.com/u/9919?s=200&v=4"
      alt="profile"
      className="profile-avatar"
    />

    <h2>Welcome 👋</h2>

    <h3>{localStorage.getItem("username") || "Developer"}</h3>

   

  </div>

  <div className="dashboard-menu">

    <h4>Dashboard</h4>

    <div className="menu-item">
      <span>📁</span>
      <p>Repositories</p>
      <span>{repositories.length}</span>
    </div>

    <div className="menu-item">
      <span>⭐</span>
      <p>Starred</p>
      <span>0</span>
    </div>

    <div className="menu-item">
      <span>👥</span>
      <p>Following</p>
      <span>0</span>
    </div>

    <div className="menu-item">
      <span>🐞</span>
      <p>Issues</p>
      <span>0</span>
    </div>

  </div>

  

</aside>


        <main className="center-content">
  <div className="repo-header">
    <div>
      <h2>Your Repositories</h2>
      <p>{repositories.length} repositories</p>
    </div>

    <button
  className="new-repo-btn"
  onClick={() => {
    console.log("Clicked");
    navigate("/create");
  }}
>
  + New
</button>
  </div>

  <div className="search-box">
    <input
      type="text"
      placeholder="🔍 Search repositories..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>

{searchResults.length === 0 ? (
  <div className="empty-state">
    <h3>No repositories found</h3>
    <p>Create your first repository.</p>
  </div>
) : (
  searchResults.map((repo) => (
    <div className="repository-card" key={repo._id}>
      <div className="repo-top">
        <div>
          <h3>{repo.name}</h3>

          <span
            className={
              repo.visibility
                ? "public-badge"
                : "private-badge"
            }
          >
            {repo.visibility ? "Public" : "Private"}
          </span>
        </div>

        <div className="repo-actions">
          <button
            className="edit-btn"
            onClick={() => handleEdit(repo)}
          >
            ✏ Edit
          </button>

          <button
            className="delete-btn"
            onClick={() => handleDelete(repo._id)}
          >
            🗑 Delete
          </button>
        </div>
      </div>

      <p className="repo-description">
        {repo.description || "No description available."}
      </p>

      <div className="repo-footer">
        <div className="repo-info">
          <span>📂 Files: {repo.content?.length || 0}</span>
          <span>🐞 Issues: {repo.issues?.length || 0}</span>
        </div>
      </div>
    </div>
  ))
)}
    
</main>
        <aside className="right-sidebar">

  {/* Suggested Repositories */}

  <div className="sidebar-card">

    <h3>Suggested Repositories</h3>

    {suggestedRepositories
      .slice(0, 5)
      .map((repo) => (
        <div className="suggested-repo" key={repo._id}>
          <div>
            <h4>{repo.name}</h4>
            <p>{repo.description || "No description"}</p>
          </div>

         
        </div>
      ))}

  </div>

  {/* Statistics */}

  <div className="sidebar-card">

    <h3>Your Statistics</h3>

    <div className="stat-row">
      <span>📁 Repositories</span>
      <strong>{repositories.length}</strong>
    </div>

    <div className="stat-row">
      <span>🌍 Public</span>
      <strong>
        {repositories.filter(repo => repo.visibility).length}
      </strong>
    </div>

    <div className="stat-row">
      <span>🔒 Private</span>
      <strong>
        {repositories.filter(repo => !repo.visibility).length}
      </strong>
    </div>

    <div className="stat-row">
      <span>🐞 Total Issues</span>
      <strong>
        {repositories.reduce(
          (total, repo) => total + (repo.issues?.length || 0),
          0
        )}
      </strong>
    </div>

  </div>

  {/* Activity */}

  <div className="sidebar-card">

    <h3>Recent Activity</h3>

    <ul className="activity-list">
      <li>🚀 Repository created</li>
      <li>⭐ Star feature coming soon</li>
      <li>👥 Follow users coming soon</li>
      <li>💬 Real-time notifications (Socket.IO)</li>
    </ul>

  </div>

</aside>
      </section>
    </>
  );
};

export default Dashboard;