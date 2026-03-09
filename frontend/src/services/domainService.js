import apiClient from "./apiClient";

function parseDomainLines(raw, brandName) {
  const lines = raw
    .split(/\n|,|;/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .map((entry) => entry.replace(/^[\d\-.)\s]+/, ""))
    .filter((entry) => /^[a-z0-9-]+\.[a-z]{2,}$/.test(entry));

  if (lines.length) {
    return Array.from(new Set(lines)).slice(0, 8);
  }

  const base = brandName.replace(/[^a-z0-9]/gi, "").toLowerCase() || "brand";
  return [`${base}.com`, `${base}.ai`, `get${base}.com`, `${base}app.com`];
}

export async function generateDomainSuggestions(brandName) {
  const prompt = `Generate 8 domain name suggestions for the brand \"${brandName}\".
Return only domains, one per line. Include .com and .ai where possible.`;

  const { data } = await apiClient.post("/chat", {
    message: prompt,
    use_groq: true
  });

  const domains = parseDomainLines(data?.response || "", brandName);
  return domains.map((name) => ({ name, status: "unknown" }));
}

export async function checkDomainAvailability(name) {
  const { data } = await apiClient.get("/domain/check", {
    params: { name }
  });

  return {
    name: data.name,
    status: data.status || "unknown"
  };
}
