import { clankedStampAbi, clankedStampAddress } from '@/lib/clankedstamp';
import ClankedStampSVG from '@/lib/ClankedStampSVG';
import { ImageResponse } from 'next/og';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

// Helper to decode Base64 tokenURI and extract NFT data
const decodeTokenURI = (base64Uri: string) => {
  try {
    const json = JSON.parse(atob(base64Uri.split(",")[1]));
    return {
      northColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "North Color"
      )?.value || "#000000",
      northeastColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "Northeast Color"
      )?.value || "#000000",
      eastColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "East Color"
      )?.value || "#000000",
      southeastColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "Southeast Color"
      )?.value || "#000000",
      southColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "South Color"
      )?.value || "#000000",
      southwestColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "Southwest Color"
      )?.value || "#000000",
      westColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "West Color"
      )?.value || "#000000",
      northwestColor: json.attributes?.find(
        (attr: { trait_type: string }) => attr.trait_type === "Northwest Color"
      )?.value || "#000000",
    };
  } catch (error) {
    console.error("Error decoding Base64 tokenURI:", error);
    return {
      northColor: "#000000",
      northeastColor: "#000000",
      eastColor: "#000000",
      southeastColor: "#000000",
      southColor: "#000000",
      southwestColor: "#000000",
      westColor: "#000000",
      northwestColor: "#000000",
    };
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenId = searchParams.get('tokenId');

  if (!tokenId) {
    return new ImageResponse(
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundImage: 'url(https://clankedstamp.vercel.app/bg-paper.jpg)',
          backgroundSize: 'cover',
        }}
      >
        <ClankedStampSVG
          northColor={"#696b6a"}
          northeastColor={"#696b6a"}
          eastColor={"#696b6a"}
          southeastColor={"#696b6a"}
          southColor={"#696b6a"}
          southwestColor={"#696b6a"}
          westColor={"#696b6a"}
          northwestColor={"#696b6a"}
        />
      </div>,
      { width: 1200, height: 630 }
    );
  }

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  try {
    const tokenURI = await publicClient.readContract({
      address: clankedStampAddress as `0x${string}`,
      abi: clankedStampAbi,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)],
    }) as string;

    const decodedData = decodeTokenURI(tokenURI);
    const { northColor, northeastColor, eastColor, southeastColor, southColor, southwestColor, westColor, northwestColor } = decodedData;

    if (!northColor || !northeastColor || !eastColor || !southeastColor || !southColor || !southwestColor || !westColor || !northwestColor) {
      throw new Error('Invalid tokenURI format');
    }

    return new ImageResponse(
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundImage: 'url(https://clankedstamp.vercel.app/bg-paper.jpg)',
          backgroundSize: 'cover',
        }}
      >
        {/* Clanked Stamp details */}
        <ClankedStampSVG
          northColor={northColor}
          northeastColor={northeastColor}
          eastColor={eastColor}
          southeastColor={southeastColor}
          southColor={southColor}
          southwestColor={southwestColor}
          westColor={westColor}
          northwestColor={northwestColor}
        />
      </div>,
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new ImageResponse(
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundImage: 'url(https://clankedstamp.vercel.app/bg-paper.jpg)',
          backgroundSize: 'cover',
        }}
      >
        <ClankedStampSVG
          northColor={"#8a8787"}
          northeastColor={"#8a8787"}
          eastColor={"#8a8787"}
          southeastColor={"#8a8787"}
          southColor={"#8a8787"}
          southwestColor={"#8a8787"}
          westColor={"#8a8787"}
          northwestColor={"#8a8787"}
        />
      </div>,
      {
        width: 1200,
        height: 630
      }
    );
  }
}