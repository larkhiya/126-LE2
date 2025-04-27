import React from "react";
import "./style/DiscoverStyle.css";
import ActionButton from "../Buttons/ActionButton";
import DeleteIcon from '@mui/icons-material/Delete';

function Discover() {
  return (
    <div className="home-container">
      <div className="home-shelf">
        <div className="discover-contribute">
          <h1>All books</h1>
         
          <ActionButton 
          color="#D77676" 
          icon={<DeleteIcon />} 
          onClick={() => console.log('Delete clicked!')} 
          label="Contribute" 
        />
       
        </div>
      </div>
    </div>
  );
}

export default Discover;
