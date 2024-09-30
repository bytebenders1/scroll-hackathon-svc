"use client";
import React, { useState, useEffect } from "react";

import { ethers } from "ethers";
import ChainQuest from "@/src/artifacts/ChainQuest.json";
import { CONTRACT_ADDRESS } from "@/src/libs/constants";
// import { PinataSDK } from "pinata";

const SolvePuzzle = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [puzzleId, setPuzzleId] = useState(0);
  const [solution, setSolution] = useState("");
  const [nftImage, setNftImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //   const pinata = new PinataSDK({
  //     pinataJwt: process.env.PINATA_JWT,
  //     pinataGateway: process.env.PINATA_GATEWAY,
  //   });

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

  const solvePuzzle = async () => {
    if (!contract) return;
    try {
      setIsLoading(true);
      const tx = await contract.solvePuzzle(puzzleId, solution);
      await tx.wait();
      alert("Puzzle solved successfully! NFT minted.");
      generateImage(puzzleId, "Puzzle solved").then(() => setIsLoading(false));
    } catch (error) {
      console.error(error);
      alert("Error solving puzzle");
    }
  };

  const generateImage = async (id: number, description: string) => {
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
      //   await pinata.upload.url(imageUrl);
      setNftImage(imageUrl);
      setIsLoading(false);
    } else {
      console.log("first");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Solve Puzzle</h2>
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
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Solution"
            className="w-full px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <button
          onClick={solvePuzzle}
          className="mt-6 w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition duration-300"
        >
          {isLoading ? "Solving..." : "Solve Puzzle"}
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
    </>
  );
};

export default SolvePuzzle;
