import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./createRepo.css";

const CreateRepository = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);

  const createRepository = async (e) => {
    e.preventDefault();

    const owner = localStorage.getItem("userId");

    if (!name.trim()) {
      return alert("Repository name is required.");
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/repo/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            owner,
            name,
            description,
            visibility,
            content: [],
            issues: [],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        setLoading(false);
        return;
      }

      alert("Repository created successfully!");

      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Unable to create repository.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="create-page">

        <div className="create-card">

          <h1>Create a new repository</h1>

          <p>
            A repository contains all your project files and revision history.
          </p>

          <form onSubmit={createRepository}>

            <label>Repository Name</label>

            <input
              type="text"
              value={name}
              placeholder="my-awesome-project"
              onChange={(e) => setName(e.target.value)}
            />

            <label>Description</label>

            <textarea
              value={description}
              placeholder="Write a short description..."
              onChange={(e) => setDescription(e.target.value)}
            />

            <h3>Visibility</h3>

            <div className="visibility">

              <label>

                <input
                  type="radio"
                  checked={visibility}
                  onChange={() => setVisibility(true)}
                />

                Public

              </label>

              <label>

                <input
                  type="radio"
                  checked={!visibility}
                  onChange={() => setVisibility(false)}
                />

                Private

              </label>

            </div>

            <button
              className="create-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Repository"}
            </button>

          </form>

        </div>

      </div>
    </>
  );
};

export default CreateRepository;