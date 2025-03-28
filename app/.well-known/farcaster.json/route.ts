export async function GET() {

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjg5MTkxNCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDRmYzg1YjUzN2FkYzE4RmYzNTRhMzJDNkUxM0JCRGNEZDk0YTZEMDEifQ",
      payload: "eyJkb21haW4iOiJjbGFua2Vkc3RhbXAudmVyY2VsLmFwcCJ9",
      signature: "MHg5NDRiZDdjM2ExZTZmZTk1MjY0ZTAxNjg4OTEwYWMzODQyZTczZWEwMzNlMTljZDczNDU3ZWYzYWVlNmU3NDhiM2ViZGZmZmM5OWM1OWFlMTU3NTFmMjI3MWZmZmJkOGE3Y2YwYTJhYjQxNTAxMWM2NjkwMDQ5N2ZlYmE2ZmYzNzFj"
    },
    frame: {
      version: "1",
      name: "Clanked Stamp",
      iconUrl: "https://clankedstamp.vercel.app/icon.png",
      homeUrl: "https://clankedstamp.vercel.app",
      imageUrl: "https://clankedstamp.vercel.app/og-image.jpg",
      buttonTitle: "Mint Clanked Stamp!",
      splashImageUrl: "https://clankedstamp.vercel.app/splash.png",
      splashBackgroundColor: "#1b1423",
      webhookUrl: "https://clankedstamp.vercel.app/api/webhook"
    },
  };

  return Response.json(config);
}