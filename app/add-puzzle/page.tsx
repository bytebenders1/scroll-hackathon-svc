"use client";
import React, { useState, useEffect } from "react";

import { ethers } from "ethers";
import ChainQuest from "@/src/artifacts/ChainQuest.json";
import { CONTRACT_ADDRESS } from "@/src/libs/constants";

const AddPuzzle = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [puzzleId, setPuzzleId] = useState(0);
  const [puzzle, setPuzzle] = useState("");
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProviderAndContract = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          ChainQuest.abi,
          signer
        );
        setContract(contract);
      } else {
        console.log("Please install MetaMask!");
      }
    };
    loadProviderAndContract();
  }, []);

  const addPuzzle = async () => {
    if (!contract) return;
    setIsLoading(true);
    try {
      const tx = await contract.addPuzzle(puzzleId, puzzle, solution);
      await tx.wait();
      alert("Puzzle added successfully!");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);

      alert("Error adding puzzle");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-8 shadow-lg">
      <h2 className="text-3xl font-bold mb-6">Add New Puzzle</h2>
      <div className="space-y-4">
        <input
          type="number"
          value={puzzleId}
          onChange={(e) => setPuzzleId(parseInt(e.target.value))}
          placeholder="Puzzle ID"
          className="w-full px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="text"
          value={puzzle}
          onChange={(e) => setPuzzle(e.target.value)}
          placeholder="Puzzle"
          className="w-full px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="text"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          placeholder="Solution"
          className="w-full px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <button
        onClick={addPuzzle}
        className="mt-6 w-full bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition duration-300"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Add Puzzle"}
      </button>
    </div>
  );
};

export default AddPuzzle;
