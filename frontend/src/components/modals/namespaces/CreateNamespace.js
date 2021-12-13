import React, { useState } from 'react';

function CreateNamespace({ setNsToCreate, setCreateOrJoin, setNewNsModalActive }) {
  const initialFormData = {
    title: '',
    img: ''
  }

  const [formData, setFormData] = useState(initialFormData);

  const toggleCreateOrJoin = () => {
    setFormData(initialFormData);
    setCreateOrJoin('join');
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
    setNsToCreate(formData);
    // TODO: close modal and add users token in App components useEfect
    setFormData(initialFormData);
    setNewNsModalActive(false);
  };

  return (
    <div className="newNs-create-container">
      <form onSubmit={gatherInput}>
        <label htmlFor="newNs-title">Server Name: </label>
        <input
          id="newNs-title"
          className="modal-text-input"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <label htmlFor="newNs-img">Server Image: </label>
        <input
          id="newNs-img"
          className="modal-text-input"
          placeholder="**Optional"
          name="img"
          value={formData.img}
          onChange={handleChange}
        />
        <button className="modal-submit">Create</button>
      </form>
      <button className="toggleCreateOrJoin" onClick={toggleCreateOrJoin}>Join a server</button>
      <button className="modal-cancel" onClick={() => setNewNsModalActive(false)}>Cancel</button>
    </div>
  );
}

export default CreateNamespace;
