import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaCloudUploadAlt, FaPlus, FaSearch, 
  FaUsers, FaBookOpen, FaTimes, FaLink, FaUserCircle, FaTrashAlt 
} from "react-icons/fa";
import toast from "react-hot-toast";
import "../../style/AddMaterial.css";

export default function AddMaterial() {
  const navigate = useNavigate();
  const [interns, setInterns] = useState([]);
  const [search, setSearch] = useState("");
  const [showInterns, setShowInterns] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    files: [null],
    links: [{ label: "", url: "" }],
    selectedInterns: [],
  });

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const res = await fetch("http://localhost:3000/mentor/interns", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setInterns(data);
    } catch (e) {
      console.error("Error fetching interns", e);
    }
  };

  const filteredInterns = interns.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAll = (select) => {
    setForm({ ...form, selectedInterns: select ? filteredInterns.map(i => i._id) : [] });
  };

  const handleSelect = (id) => {
    const updated = form.selectedInterns.includes(id) 
      ? form.selectedInterns.filter(item => item !== id) 
      : [...form.selectedInterns, id];
    setForm({ ...form, selectedInterns: updated });
  };

  const removeFileRow = (index) => {
    const updatedFiles = form.files.filter((_, idx) => idx !== index);
    setForm({...form, files: updatedFiles});
  }

  const removeLinkRow = (index) => {
    const updatedLinks = form.links.filter((_, idx) => idx !== index);
    setForm({...form, links: updatedLinks});
  }

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.title.trim()) {
    return toast.error("Title is required");
  }

  if (form.selectedInterns.length === 0) {
    return toast.error("Please select interns");
  }

  const validLinks = form.links.filter(
    (link) => link.label.trim() !== "" && link.url.trim() !== ""
  );

  const validFiles = form.files.filter((file) => file !== null);

  if (validLinks.length === 0 && validFiles.length === 0) {
    return toast.error("Please add at least 1 file or 1 link");
  }

  const formData = new FormData();
  formData.append("title", form.title);
  formData.append("description", form.description);
  formData.append(
    "assignedInterns",
    JSON.stringify(form.selectedInterns)
  );

  formData.append("links", JSON.stringify(validLinks));

  validFiles.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const res = await fetch("http://localhost:3000/mentor/materials", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Material assigned successfully 🚀");
      navigate("/mentor/materials");
    } else {
      toast.error(data.message || "Something went wrong");
    }
  } catch (err) {
    toast.error("Server error");
  }
};
  return (
    <div className="add-material-container">
      <div className="add-material-layout">
        
        <div className="add-material-card">
          <div className="card-header-row">
            <h2 className="add-material-header"><FaBookOpen /> Add Material</h2>
            <button type="button" className="toggle-interns-btn" onClick={() => setShowInterns(!showInterns)}>
              <FaUsers /> {showInterns ? "Hide" : "Select"}
              {form.selectedInterns.length > 0 && <span className="badge">{form.selectedInterns.length}</span>}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="material-section">
              <label className="material-label">Title</label>
              <input type="text" className="material-input" placeholder="Enter title..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>

            <div className="material-section">
              <label className="material-label">Description</label>
              <textarea className="material-input material-textarea" placeholder="Brief details..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>

          
            <div className="material-section">
              <div className="dynamic-section-header">
                <label className="material-label"><FaCloudUploadAlt /> Attachments</label>
                <button type="button" className="add-resource-btn" onClick={() => setForm({...form, files: [...form.files, null]})}>
                   Add File
                </button>
              </div>
              
              {form.files.map((_, i) => (
                <div className="resource-row file-row" key={i}>
                  <input type="file" onChange={e => {
                    const newFiles = [...form.files];
                    newFiles[i] = e.target.files[0];
                    setForm({...form, files: newFiles});
                  }} />
                  <button type="button" className="remove-row-btn" onClick={() => removeFileRow(i)}>
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>

            
            <div className="material-section">
              <div className="dynamic-section-header">
                <label className="material-label"><FaLink /> Links</label>
                <button type="button" className="add-resource-btn" onClick={() => setForm({...form, links: [...form.links, {label:'', url:''}]})}>
                   Add Link
                </button>
              </div>

              {form.links.map((link, i) => (
                <div className="resource-row link-row grid-2col" key={i}>
                  <input type="text" placeholder="Label" value={link.label} onChange={e => {
                    const newLinks = [...form.links]; newLinks[i].label = e.target.value; setForm({...form, links: newLinks});
                  }} />
                  <input type="text" placeholder="URL (http://...)" value={link.url} onChange={e => {
                    const newLinks = [...form.links]; newLinks[i].url = e.target.value; setForm({...form, links: newLinks});
                  }} />
                 
                  <button type="button" className="remove-row-btn" title="Remove" onClick={() => removeLinkRow(i)}>
                    <FaTimes /> 
                  </button>
                </div>
              ))}
            </div>

            <button type="submit" className="submit-btn">Assign Material</button>
          </form>
        </div>

       
        {showInterns && (
          <div className="intern-sidebar">
            <div className="sidebar-header">
              <h3>Intern List</h3>
              <FaTimes onClick={() => setShowInterns(false)} style={{cursor:'pointer', color:'#a0aec0'}}/>
            </div>
            
            <div className="sidebar-ctrls">
              <button type="button" onClick={() => toggleAll(true)}>All</button>
              <button type="button" onClick={() => toggleAll(false)}>None</button>
            </div>

            <div className="sidebar-search-container">
              <FaSearch color="#cbd5e0" size={14} />
              <input type="text" placeholder="Search interns..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="intern-list-scroll">
              {filteredInterns.map(intern => (
                <label className="intern-checkbox-item" key={intern._id}>
                  <input type="checkbox" checked={form.selectedInterns.includes(intern._id)} onChange={() => handleSelect(intern._id)} />
                  <span className="checkmark-custom"></span>
                  <div className="intern-avatar"><FaUserCircle size={22} /></div>
                  <span className="intern-name-text">{intern.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}