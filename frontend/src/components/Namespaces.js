import React, { useState } from 'react';
import NewNamespaceModal from './modals/NewNamespaceModal';
import newNamespaceImg from '../images/plus.png';
import blankServerImg from '../images/blankserver.png'

/** Namespaces.js contains all of a users servers(namespaces).
  * It lists these namespaces and allows a user to click to join.
  * There is also an option to create or join a server(namespace) 
  * as well.
  */

function Namespaces({ namespaces, setNsActive, nsActive, setNsToCreate, setNsToJoin }) {
  const [newNsModalActive, setNewNsModalActive] = useState(false);

  return (
    <div className="namespaces" data-testid="namespaces-container">
      {namespaces.map(ns => {
        return (
          <div className="namespace" key={ns.endpoint}>
            <p className="ns-title" key={ns.endpoint}>{ns.nsTitle}</p>
            <img className={`namespace-${ns.endpoint}`} src={ns.img || blankServerImg} onClick={() => setNsActive(ns.endpoint)} />
          </div>
        );
      })}
      <div className="namespace" key="newNamespace">
        <p className="ns-title" key="new-namespace">Add Server</p>
        <img className="newNamespace" src={newNamespaceImg} onClick={() => setNewNsModalActive(true)} />
      </div>
      {newNsModalActive ?
      <NewNamespaceModal 
        setNewNsModalActive={setNewNsModalActive}
        setNsToCreate={setNsToCreate}
        setNsToJoin={setNsToJoin}
      /> : null
      }
    </div>
  );
}

export default Namespaces;
