"use client";

import React, { useState } from "react";
import { MdVisibility, MdDelete } from "react-icons/md";
import { FaCube, FaDrawPolygon } from "react-icons/fa";

interface TreeEntry {
  id: string;
  type: "mesh" | "sketch";
  name: string;
  visible: boolean;
}

interface TreeEntryProps {
  entry: TreeEntry;
  toggleVis: (id: string) => void;
  deleteNode: (id: string) => void;
}

const treeIcons = {
  mesh: FaCube,
  sketch: FaDrawPolygon,
};

const TreeEntryComponent = ({ entry, toggleVis, deleteNode }: TreeEntryProps) => {
  const Icon = treeIcons[entry.type];

  return (
    <div className="flex items-center px-4 py-2 text-sm hover:bg-gray-700">
      <Icon className="w-5 h-5 mr-3 text-gray-400" />
      <span className="truncate flex-1">{entry.name}</span>
      <MdVisibility
        className={`w-4 h-4 mx-1 cursor-pointer ${
          entry.visible ? "text-green-400" : "hover:text-blue-400"
        }`}
        onClick={() => toggleVis(entry.id)}
      />
      <MdDelete
        className="w-4 h-4 mx-1 hover:text-red-400 cursor-pointer"
        onClick={() => deleteNode(entry.id)}
      />
    </div>
  );
};

export const Tree = () => {
  const [treeEntries, setTreeEntries] = useState<TreeEntry[]>([
    { id: "object1", type: "mesh", name: "Cube 1", visible: true },
    { id: "object2", type: "sketch", name: "Sketch 1", visible: true },
  ]);

  const toggleVis = (id: string) => {
    setTreeEntries(treeEntries.map(entry =>
      entry.id === id ? { ...entry, visible: !entry.visible } : entry
    ));
  };

  const deleteNode = (id: string) => {
    setTreeEntries(treeEntries.filter(entry => entry.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 text-gray-200">
      <div className="px-4 py-3 border-b border-gray-700">
        <span className="font-medium">Tree Entries</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {treeEntries.map(entry => (
          <TreeEntryComponent
            key={entry.id}
            entry={entry}
            toggleVis={toggleVis}
            deleteNode={deleteNode}
          />
        ))}
      </div>
    </div>
  );
};