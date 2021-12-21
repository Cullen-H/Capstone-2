import React, { useState } from 'react';

/** JoinNamespace.js displays the necessary form for 
  * joining an existing namespace to a user. Form data is 
  * handled and passed to App.js to be sent to the server.
  */


function JoinNamespace({ setNsToJoin, setCreateOrJoin, setNewNsModalActive }) {
  const initialFormData = {
    endpoint: ''
  };
  
  const [formData, setFormData] = useState(initialFormData);

  const toggleCreateOrJoin = () => {
    setFormData(initialFormData);
    setCreateOrJoin('create');
  };

  const handleChange = evt => {
    const { name, value } = evt.target;
    setFormData(formData => ({
      ...formData,
      [name]: value
    }));
  };

  const gatherInput = evt => {
    evt.preventDefault();
    setNsToJoin(formData);
    setFormData(initialFormData);
    setNewNsModalActive(false);
  };

  return (
    <div className="newNs-join-container">
      <form onSubmit={gatherInput}>
        <label htmlFor="newNs-endpoint">Server Id: </label>
        <input
          id="newNs-endpoint"
          className="modal-text-input"
          name="endpoint"
          placeholder="eg. 8c116500-7835-4906-a699-65f60135c92f"
          value={formData.endpoint}
          onChange={handleChange}
          required
        />
        <button className="modal-submit">Submit</button>
      </form>
      <button className="toggleCreateOrJoin" onClick={toggleCreateOrJoin}>Create a new server</button>
      <button className="modal-cancel" onClick={() => setNewNsModalActive(false)}>Cancel</button>
    </div>
  );
}

export default JoinNamespace;
