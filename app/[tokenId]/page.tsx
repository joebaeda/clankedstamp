"use client";

import { useReadContract } from "wagmi";
import { use, useCallback, useEffect, useState } from "react";
import sdk from '@farcaster/frame-sdk';
import { ArrowBigLeft } from "lucide-react";
import { clankedStampAbi, clankedStampAddress } from "@/lib/clankedstamp";
import Image from "next/image";

// Helper to decode Base64 tokenURI and extract the token data
const decodeTokenURI = (base64Uri: string) => {
    try {
        const json = JSON.parse(atob(base64Uri.split(",")[1]));
        return {
            stampImage: json.image || "",
        };
    } catch (error) {
        console.error("Error decoding Base64 tokenURI:", error);
        return { stampImage: "" };
    }
};


export default function TokenDetails({
    params,
}: {
    params: Promise<{ tokenId: string }>
}) {
    const { tokenId } = use(params)
    const [stampImageUri, setStampImageUri] = useState<string>("");

    const { data: tokenURIData } = useReadContract({
        address: clankedStampAddress as `0x${string}`,
        abi: clankedStampAbi,
        functionName: "tokenURI",
        args: [BigInt(tokenId)],
    });

    useEffect(() => {
        if (tokenURIData) {
            const { stampImage } = decodeTokenURI(tokenURIData);
            setStampImageUri(stampImage);
        }
    }, [tokenURIData]);

    const linkToOpensea = useCallback((tokenId?: string) => {
        if (tokenId) {
            sdk.actions.openUrl(`https://opensea.io/assets/base/${clankedStampAddress}/${tokenId}`);
        }
    }, []);

    const closeFrame = () => {
        sdk.actions.close()
    };

    return (
        <main className="w-full min-h-screen bg-[radial-gradient(#290f51_1px,transparent_1px)] [background-size:16px_16px]">

            {/* Header section */}
            <div className="w-full bg-[#4f2d61] p-3 rounded-b-2xl flex flex-row justify-between">

                {/* Back */}
                <button
                    onClick={closeFrame}
                    className="disabled:opacity-50"
                >
                    <ArrowBigLeft className="w-10 h-10 text-gray-200" />
                </button>

                {/* Profile */}
                <button onClick={() => linkToOpensea(tokenId)} className="flex text-white flex-row justify-between items-center gap-2">
                    Place a Bid
                </button>

            </div>

            {/* Words of the Day detail */}
            <div className="w-full max-w-[500px] mx-auto flex items-center justify-center">
                {stampImageUri ? (
                    <Image
                        src={stampImageUri || "/icon.png"}
                        width={300}
                        height={300}
                        priority
                        alt="Clanked Stamp"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full mt-20 max-w-[500px] mx-auto flex items-center justify-center text-gray-500">
                        No Clanked Stamp minted yet!
                    </div>
                )}
            </div>
        </main>
    );
}