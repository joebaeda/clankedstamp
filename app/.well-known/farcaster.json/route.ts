export async function GET() {

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjEwNDI2NTcsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg1NDg2OWI2Njg5YkZjQzUwMTQxRjFkNUJCOUYwMjQ0NkNiMWI1MEQ0In0",
      payload: "eyJkb21haW4iOiJjbGFua2Vkc3RhbXAudmVyY2VsLmFwcCJ9",
      signature: "MHgyNDNkODJmNDkwZjEyMjcwMTM0ZTZlMjYxNmIwMWEyOWU4MzY0YzIwYTQxYzY4ODI1OTViYjUxNzNjZTcwMGI5Mzc5MThhNjc3M2I1ZTExZWIyYzRjYTlhODk3OGVmYzE1ZWEzYjAxZTk3OWQ1YjVkZDcwZWFhMGEzODViOGVjNDFj"
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