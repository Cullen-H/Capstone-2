import React, { useState } from 'react';
import JoinNamespace from './namespaces/JoinNamespace';
import CreateNamespace from './namespaces/CreateNamespace';

function NewNamespaceModal({ setNewNsModalActive, setNsToCreate, setNsToJoin }) {
  console.log('rendering NewNamespaceModal');

  const [createOrJoin, setCreateOrJoin] = useState('join');

  const closeModal = () => {
    setCreateOrJoin('join');
    setNewNsModalActive(false);
  };

  return (
    <div className="modal namespaceModal">
      {createOrJoin === 'join' ?
        <JoinNamespace setCreateOrJoin={setCreateOrJoin} setNsToJoin={setNsToJoin} setNewNsModalActive={setNewNsModalActive} /> :
        <CreateNamespace setCreateOrJoin={setCreateOrJoin} setNsToCreate={setNsToCreate} setNewNsModalActive={setNewNsModalActive} />
      }
    </div>
  );
}

export default NewNamespaceModal;
