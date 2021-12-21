import React, { useState } from 'react';
import JoinNamespace from './namespaces/JoinNamespace';
import CreateNamespace from './namespaces/CreateNamespace';

/** NewNamespaceModal.js displays a modal to the user when toggled.
  * Depending on the user selection, it then displays a form to either
  * create or join a server (namespace).
  */

function NewNamespaceModal({ setNewNsModalActive, setNsToCreate, setNsToJoin }) {
  const [createOrJoin, setCreateOrJoin] = useState('join');

  const closeModal = () => {
    setCreateOrJoin('join');
    setNewNsModalActive(false);
  };

  return (
    <div className="modal namespaceModal" data-testid="modal-container">
      {createOrJoin === 'join' ?
        <JoinNamespace setCreateOrJoin={setCreateOrJoin} setNsToJoin={setNsToJoin} setNewNsModalActive={setNewNsModalActive} /> :
        <CreateNamespace setCreateOrJoin={setCreateOrJoin} setNsToCreate={setNsToCreate} setNewNsModalActive={setNewNsModalActive} />
      }
    </div>
  );
}

export default NewNamespaceModal;
