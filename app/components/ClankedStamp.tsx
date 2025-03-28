"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import Loading from "./svg/Loading";
import { clankedStampAbi, clankedStampAddress } from "@/lib/clankedstamp";
import Image from "next/image";

// Helper to decode Base64 tokenURI and extract NFT data
const decodeTokenURI = (base64Uri: string) => {
  try {
    const json = JSON.parse(atob(base64Uri.split(",")[1]));
    return {
      stampImage: json.image || "",
      northColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "North Color"
      )?.value || "",
      northeastColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "Northeast Color"
      )?.value || "",
      eastColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "East Color"
      )?.value || "",
      southeastColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "Southeast Color"
      )?.value || "",
      southColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "South Color"
      )?.value || "",
      southwestColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "Southwest Color"
      )?.value || "",
      westColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "West Color"
      )?.value || "",
      northwestColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "Northwest Color"
      )?.value || "",
    };
  } catch (error) {
    console.error("Error decoding Base64 tokenURI:", error);
    return {
      stampImage: "",
      northColor: "",
      northeastColor: "",
      eastColor: "",
      southeastColor: "",
      southColor: "",
      southwestColor: "",
      westColor: "",
      northwestColor: "",
    };
  }
};

interface StampColor {
  northColor: string;
  northeastColor: string;
  eastColor: string;
  southeastColor: string;
  southColor: string;
  southwestColor: string;
  westColor: string;
  northwestColor: string;
}

export default function ClankedStamp() {
  const [stampImageURI, setStampImageURI] = useState<string>("");
  const [stampColor, setStampColor] = useState<StampColor>({
    northColor: "",
    northeastColor: "",
    eastColor: "",
    southeastColor: "",
    southColor: "",
    southwestColor: "",
    westColor: "",
    northwestColor: "",
  });
  const [tokenId, setTokenId] = useState<number>(1);
  const [maxTokenId, setMaxTokenId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  // Fetch total supply from the contract
  const fetchTotalSupply = async () => {
    try {
      const totalSupply = await publicClient.readContract({
        address: clankedStampAddress as `0x${string}`,
        abi: clankedStampAbi,
        functionName: "totalSupply",
      });
      setMaxTokenId(Number(totalSupply));
    } catch (error) {
      console.error("Error fetching total supply:", error);
    }
  };

  // Fetch NFT data for a given tokenId
  const fetchClankedStamp = async (tokenId: number) => {
    try {
      setIsLoading(true);
      const tokenURI = await publicClient.readContract({
        address: clankedStampAddress as `0x${string}`,
        abi: clankedStampAbi,
        functionName: "tokenURI",
        args: [BigInt(tokenId)],
      }) as string;

      const decodedData = decodeTokenURI(tokenURI);
      setStampImageURI(decodedData.stampImage);
      setStampColor({
        northColor: decodedData.northColor,
        northeastColor: decodedData.northeastColor,
        eastColor: decodedData.eastColor,
        southeastColor: decodedData.southeastColor,
        southColor: decodedData.southColor,
        southwestColor: decodedData.southwestColor,
        westColor: decodedData.westColor,
        northwestColor: decodedData.northwestColor,
      });
    } catch (error) {
      console.error("Error fetching animation URL:", error);
      setStampImageURI("");
      setStampColor({
        northColor: "",
        northeastColor: "",
        eastColor: "",
        southeastColor: "",
        southColor: "",
        southwestColor: "",
        westColor: "",
        northwestColor: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize component: fetch total supply
  useEffect(() => {
    fetchTotalSupply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch animation URL when tokenId or maxTokenId changes
  useEffect(() => {
    if (maxTokenId > 0) {
      fetchClankedStamp(tokenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenId, maxTokenId]);

  // Navigation handlers
  const handlePrev = () => {
    setTokenId((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setTokenId((prev) => (prev < maxTokenId ? prev + 1 : prev));
  };

  return (
    <main className="w-full bg-[#08060ce3] min-h-screen bg-[radial-gradient(#290f51_1px,transparent_1px)] [background-size:16px_16px] flex flex-col items-center justify-center p-4">
      <div className="w-full flex justify-center mx-auto items-center">
        {/* NFT Display */}
        <div className="relative w-full max-w-[384px] mx-auto flex flex-col items-center justify-center">
          {isLoading ? (
            <div className="absolute z-0 inset-0 flex max-w-[300px] mx-auto justify-center items-center text-gray-500 text-center">
              <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
              <Loading className="rounded-full h-28 w-28" />
            </div>
          ) : stampImageURI ? (
            <>
              <div className="w-full mx-auto grid grid-cols-4 gap-4 max-w-md">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-md" style={{ backgroundColor: stampColor.northColor }}></div>
                  <span className="text-gray-400 text-xs">{stampColor.northColor}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-md" style={{ backgroundColor: stampColor.northeastColor }}></div>
                  <span className="text-gray-400 text-xs">{stampColor.northeastColor}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-md" style={{ backgroundColor: stampColor.eastColor }}></div>
                  <span className="text-gray-400 text-xs">{stampColor.eastColor}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-md" style={{ backgroundColor: stampColor.southeastColor }}></div>
                  <span className="text-gray-400 text-xs">{stampColor.southeastColor}</span>
                </div>
              </div>
              <a
                href={`https://opensea.io/assets/base/${clankedStampAddress}/${tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full z-20"
              >
                <Image
                  src={stampImageURI || "/icon.png"}
                  className="w-full h-full object-cover rounded-xl"
                  width={500}
                  height={500}
                  priority
                  alt="Clanked Stamp"
                />
              </a>
              <div className="w-full mx-auto grid grid-cols-4 gap-4 max-w-md">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-md" style={{ backgroundColor: stampColor.southColor }}></div>
                  <span className="text-gray-400 text-xs">{stampColor.southColor}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-md" style={{ backgroundColor: stampColor.southwestColor }}></div>
                  <span className="text-gray-400 text-xs">{stampColor.southwestColor}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-md" style={{ backgroundColor: stampColor.westColor }}></div>
                  <span className="text-gray-400 text-xs">{stampColor.westColor}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-md" style={{ backgroundColor: stampColor.northwestColor }}></div>
                  <span className="text-gray-400 text-xs">{stampColor.northwestColor}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex max-w-[300px] mx-auto justify-center items-center text-gray-500 text-center">
              No Clanked Stamp found!
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="w-full absolute inset-0 mx-auto bottom-0 flex justify-between items-center p-4">
          <button
            onClick={handlePrev}
            className="relative text-white p-4"
            disabled={tokenId <= 1}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="relative text-white p-4"
            disabled={tokenId >= maxTokenId}
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </main>
  );
}