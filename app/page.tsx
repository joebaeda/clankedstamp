"use client";

import { useCallback, useEffect, useState } from "react";
import { useViewer } from "./providers/FrameContextProvider";
import {
  BaseError,
  useAccount,
  useBalance,
  useChainId,
  useConnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { base } from "viem/chains";
import sdk from "@farcaster/frame-sdk";
import { LockKeyhole } from "lucide-react";
import { config } from "@/lib/config";
import Image from "next/image";
import { clankedStampAbi, clankedStampAddress } from "@/lib/clankedstamp";
import { parseEther } from "viem";

export default function Home() {
  const [nftAmount, setNFTAmount] = useState<bigint>(BigInt(1));
  const [showError, setShowError] = useState<boolean>(false);
  const [showMintSuccess, setShowMintSuccess] = useState<boolean>(false);
  const [showTermOfMint, setShowTermOfMint] = useState<boolean>(false);

  const { displayName, added } = useViewer();
  const chainId = useChainId();
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const {
    data: txHash,
    error: txError,
    isPending: isTxPending,
    writeContract: clankedStampWrite,
  } = useWriteContract();

  const { data: tokenId } = useReadContract({
    address: clankedStampAddress as `0x${string}`,
    abi: clankedStampAbi,
    chainId: base.id,
    functionName: "totalSupply",
  });

  const ethBalance = useBalance({
    chainId: base.id,
    address: address,
  });

  const { data: mintPrice } = useReadContract({
    address: clankedStampAddress as `0x${string}`,
    abi: clankedStampAbi,
    chainId: base.id,
    functionName: "MINT_PRICE",
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const linkToOpensea = useCallback((tokenId?: number) => {
    if (tokenId) {
      sdk.actions.openUrl(`https://opensea.io/assets/base/${clankedStampAddress}/${tokenId}`);
    }
  }, []);

  const linkToShare = useCallback((tokenId?: number) => {
    if (tokenId) {
      sdk.actions.openUrl(
        `https://warpcast.com/~/compose?text=Clanked%20Stamp%20%23${tokenId}%20has%20been%20minted%20ONCHAIN%20on%20%40base%0A%0AMini%20Apps%20by%20%40joebaeda&embeds[]=https://clankedstamp.vercel.app/${tokenId}`
      );
    }
  }, []);

  useEffect(() => {
    if (!added) {
      sdk.actions.addFrame();
    }
  }, [added]);

  useEffect(() => {
    if (isConfirmed) {
      setShowMintSuccess(true);
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (txError) {
      setShowError(true);
    }
  }, [txError]);

  useEffect(() => {
    if (ethBalance.data?.value && ethBalance.data.value < (mintPrice || parseEther("0.003"))) {
      setShowTermOfMint(true);
    } else {
      setShowTermOfMint(false);
    }
  }, [ethBalance.data?.value, mintPrice]);

  const handleMintSingle = async () => {
    try {
      if (!mintPrice) throw new Error("Mint price not loaded");
      clankedStampWrite({
        abi: clankedStampAbi,
        chainId: base.id,
        address: clankedStampAddress as `0x${string}`,
        functionName: "mint",
        value: mintPrice,
      });
    } catch (error) {
      console.error("Error during minting:", (error as Error).message);
      setShowError(true);
    }
  };

  const handleMintMultiple = async () => {
    try {
      if (!mintPrice) throw new Error("Mint price not loaded");
      const totalPrice = mintPrice * nftAmount;
      clankedStampWrite({
        abi: clankedStampAbi,
        chainId: base.id,
        address: clankedStampAddress as `0x${string}`,
        functionName: "mintMultiple",
        args: [nftAmount],
        value: totalPrice,
      });
    } catch (error) {
      console.error("Error during minting:", (error as Error).message);
      setShowError(true);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || Number(value) <= 0) {
      setNFTAmount(BigInt(1));
    } else {
      setNFTAmount(BigInt(value));
    }
  };

  const isMultipleMint = nftAmount > BigInt(1);

  return (
    <main className="relative flex justify-center items-center w-full min-h-screen text-white bg-[#08060ce3] bg-[radial-gradient(#290f51_1px,transparent_1px)] [background-size:16px_16px]">
      {/* Transaction Success */}
      {showMintSuccess && (
        <div
          onClick={() => setShowMintSuccess(false)}
          className="absolute inset-0 backdrop-blur-lg mx-auto flex items-center justify-center z-30 w-full"
        >
          <div className="relative w-full max-w-[300px] p-4 flex flex-col bg-[#17101f] text-slate-300 rounded-2xl text-center">
            <p className="text-center p-4">🎉 Mint Success 🎉</p>
            <Image
              src="/mint-success.png"
              width={300}
              height={300}
              alt="Clanked Stamp"
              className="w-full h-full p-2 rounded-lg bg-white object-cover"
            />
            <div className="w-full pt-4 justify-between items-center flex flex-row space-x-4">
              <button
                className="w-full p-3 rounded-xl bg-gradient-to-r from-[#201029] to-[#290f37] disabled:cursor-not-allowed"
                onClick={() => linkToShare(Number(tokenId) + 1)}
              >
                Share
              </button>
              <button
                className="w-full p-3 rounded-xl bg-gradient-to-r from-[#290f37] to-[#201029] disabled:cursor-not-allowed"
                onClick={() => linkToOpensea(Number(tokenId) + 1)}
              >
                Opensea
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Error */}
      {showError && txError && (
        <div
          onClick={() => setShowError(false)}
          className="absolute top-1/4 mx-auto flex items-center justify-center p-4 z-10 w-full max-w-[300px]"
        >
          <div className="relative bg-[#230b36cc] bg-opacity-25 backdrop-blur-[10px] text-slate-300 p-6 rounded-2xl shadow-lg text-center">
            <p className="text-center p-4">
              Error: {(txError as BaseError).shortMessage || txError.message}
            </p>
          </div>
        </div>
      )}

      {/* Term of Mint */}
      {showTermOfMint && (
        <div
          onClick={() => setShowTermOfMint(false)}
          className="absolute top-1/4 mx-auto flex items-center justify-center p-4 z-10 w-full max-w-[300px]"
        >
          <div className="relative bg-[#230b36cc] bg-opacity-25 backdrop-blur-[10px] text-slate-300 p-6 rounded-2xl shadow-lg text-center">
            <p className="text-center p-4">
              Sorry {displayName}, you need at least {mintPrice ? `${Number(mintPrice) / 1e18} ETH` : "0.003 ETH"} in your wallet to mint a Clanked Stamp.
            </p>
          </div>
        </div>
      )}

      {/* Navbar Bottom */}
      <div className="flex justify-center items-center gap-4 w-full mx-auto px-4">
        {isConnected && chainId === base.id ? (
          <div className="flex flex-col items-center gap-2">
            <p className="font-extrabold py-5 max-w-[300px]">Hi {displayName} 👋, Mint your Clanked Stamp as many as you can!</p>
            <Image
              src="/icon.png"
              width={300}
              height={300}
              alt="Clanked Stamp"
              className="w-full max-w-[300px] p-2 rounded-lg bg-white object-cover"
            />
            <p className="text-center p-4 font-extrabold">{tokenId} / 3333</p>
            <input
              type="number"
              min="1"
              value={Number(nftAmount)}
              onChange={handleAmountChange}
              className="w-full max-w-[300px] p-2 rounded-xl bg-[#333333c4] border-2 border-[#422255] outline-none text-white text-center"
              disabled={isTxPending || isConfirming}
            />
            <button
              onClick={isMultipleMint ? handleMintMultiple : handleMintSingle}
              disabled={
                !isConnected ||
                isTxPending ||
                isConfirming ||
                chainId !== base.id ||
                !ethBalance.data?.value ||
                ethBalance.data.value < (mintPrice ? mintPrice * nftAmount : parseEther("0.003"))
              }
              className="w-full max-w-[300px] p-2 relative bg-purple-900 rounded-xl"
            >
              {isTxPending || isConfirming ? (
                <span>Loading...</span>
              ) : isMultipleMint ? (
                <span>Mint Multiple</span>
              ) : (
                <span>Mint Single</span>
              )}
            </button>
          </div>
        ) : (
          <button
            className="flex p-4"
            onClick={() => connect({ connector: config.connectors[0] })}
          >
            <LockKeyhole className="w-12 h-12 mx-auto" />
          </button>
        )}
      </div>
    </main>
  );
}