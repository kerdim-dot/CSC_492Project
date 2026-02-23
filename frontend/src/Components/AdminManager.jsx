import { useState } from "react";
function AdminManager(){
  const [activeTab, setActiveTab] = useState("update");

  return (
    <div className="tab-pane-container">
      <HeaderPanel activeTab = {activeTab} setActiveTab={setActiveTab}/>
      <BodyPanel activeTab={activeTab}/>
    </div>
  );
}

export default AdminManager;

function HeaderPanel({activeTab, setActiveTab}){
    return(
        <div className="tab-header">
            <button className={activeTab === "add" ? "tab active" : "tab"}
            onClick={() => setActiveTab("add")}>
            Add
            </button>

            <button
            className={activeTab === "update" ? "tab active" : "tab"}
            onClick={() => setActiveTab("update")}
            >
            Update
            </button>

            <button className={activeTab === "delete" ? "tab active" : "tab"}
            onClick={() => setActiveTab("delete")}>
            Delete
            </button>
        </div>
    )
}

function BodyPanel({activeTab}){
    return(
        <div className="tab-content">
            {activeTab === "add" && 
            <div className="placeholder">
                <p>New Student</p>
                <div className="name-container">
                    <input type= "text" placeholder="first name"/>
                    <input type= "text" placeholder="last name"/>
                </div>
                <div className="graduation-container">
                    <input type="text" placeholder="graduation semester"></input>
                    <input type="text" placeholder="graduation year"></input>
                </div>
                <div>
                    
                </div>
                
            </div>
            }
            {activeTab === "update" && <div className="placeholder">Update Student </div>}
            {activeTab === "delete" && <div className="placeholder">Delete Student </div>}
        </div>
    )
}