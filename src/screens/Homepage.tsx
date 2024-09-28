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
    <div className="w-screen h-screen p-10">
      <h1 className="text-4xl font-bold">ChainQuest</h1>
      <div className="w-full">
        <h2>Add Puzzle</h2>
        <div className="space-x-2">
          <input
            type="number"
            value={puzzleId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPuzzleId(parseInt(e.target.value))
            }
            placeholder="Puzzle ID"
          />
          <input
            type="text"
            value={puzzle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPuzzle(e.target.value)
            }
            placeholder="Puzzle"
          />
          <input
            type="text"
            value={solution}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSolution(e.target.value)
            }
            placeholder="Solution"
          />
        </div>
        <button onClick={addPuzzle}>Add Puzzle</button>
      </div>
      <div className="w-full mt-10">
        <h2>Solve Puzzle</h2>
        <div className="flex gap-x-2 w-full">
          <input
            type="number"
            value={puzzleId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPuzzleId(parseInt(e.target.value))
            }
            placeholder="Puzzle ID"
          />
          <input
            type="text"
            value={solution}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSolution(e.target.value)
            }
            placeholder="Solution"
          />
        </div>
        <button onClick={solvePuzzle}>Solve Puzzle</button>
      </div>
      {nftImage && (
        <div>
          <h2>Your NFT</h2>
          <img src={nftImage} alt="Minted NFT" />
        </div>
      )}
    </div>
  );
};

export default Homepage;
