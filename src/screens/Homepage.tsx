"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ChainQuest from "../artifacts/ChainQuest.json"; // Ensure you have compiled your contract and the JSON is in artifacts folder
import { CONTRACT_ADDRESS } from "../libs/constants";
import { Contract } from "ethers";

const Homepage = () => {
  const [contract, setContract] = useState<ethers.BaseContract | null>(null);
  const [puzzleId, setPuzzleId] = useState(0);
  const [puzzle, setPuzzle] = useState("");
  const [solution, setSolution] = useState("");
  const [nftImage, setNftImage] = useState("");

  const contractAddress = CONTRACT_ADDRESS;

  useEffect(() => {
    const loadProviderAndContract = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = provider.getSigner();
        // initalize smartcontract with the essentials detials.
        const signerInstance = await signer;

        const contract = new ethers.Contract(
          contractAddress as string,
          ChainQuest.abi,
          provider
        );
        const contractWithSigner = contract.connect(signerInstance);
        console.log(contract, contractWithSigner);
        setContract(contractWithSigner);
      } else {
        console.log("Please install MetaMask!");
      }
    };
    loadProviderAndContract();
  }, [contractAddress]);

  const addPuzzle = async () => {
    if (!contract) return;
    try {
      const tx = await (contract as Contract).addPuzzle(
        puzzleId,
        puzzle,
        solution
      );
      await tx.wait();
      alert("Puzzle added successfully!");
    } catch (error) {
      console.error(error);
      alert("Error adding puzzle");
    }
  };

  const solvePuzzle = async () => {
    if (!contract) return;
    try {
      const tx = await (contract as Contract).solvePuzzle(puzzleId, solution);
      await tx.wait();
      alert("Puzzle solved successfully! NFT minted.");

      // Generate image for the NFT
      generateImage(puzzleId, puzzle);
    } catch (error) {
      console.error(error);
      alert("Error solving puzzle");
    }
  };

  const generateImage = (id: number, description: string) => {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = 500;
    canvas.height = 500;

    // Fill background
    if (ctx) {
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add text
      ctx.fillStyle = "#000";
      ctx.font = "30px Arial";
      ctx.fillText(`Puzzle ID: ${id}`, 50, 100);
      ctx.fillText(`Description: ${description}`, 50, 150);

      // Optional: Add more graphics or images
      // Example: Draw a rectangle or circle
      ctx.fillStyle = "#3498db";
      ctx.fillRect(50, 200, 400, 50);

      // Convert the canvas to a data URL (base64 encoded image)
      const imageUrl = canvas.toDataURL("image/png");

      // Set the NFT image state
      setNftImage(imageUrl);
    } else {
      console.log("first");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
          ChainQuest
        </h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Add New Puzzle</h2>
          <div className="space-y-4">
            <input
              type="number"
              value={puzzleId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPuzzleId(parseInt(e.target.value))
              }
              placeholder="Puzzle ID"
              className="w-full px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="text"
              value={puzzle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPuzzle(e.target.value)
              }
              placeholder="Puzzle"
              className="w-full px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="text"
              value={solution}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSolution(e.target.value)
              }
              placeholder="Solution"
              className="w-full px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <button
            onClick={addPuzzle}
            className="mt-6 w-full bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition duration-300"
          >
            Add Puzzle
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Solve Puzzle</h2>
          <div className="space-y-4">
            <input
              type="number"
              value={puzzleId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPuzzleId(parseInt(e.target.value))
              }
              placeholder="Puzzle ID"
              className="w-full px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="text"
              value={solution}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSolution(e.target.value)
              }
              placeholder="Solution"
              className="w-full px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <button
            onClick={solvePuzzle}
            className="mt-6 w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition duration-300"
          >
            Solve Puzzle
          </button>
        </div>

        {nftImage && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-6">Your NFT</h2>
            <img
              src={nftImage}
              alt="Minted NFT"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
