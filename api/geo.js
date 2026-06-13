// Returns the visitor's country from Vercel's edge geo headers.
// Used to default the site currency ($ for US, £ for UK).
export default function handler(req, res) {
  const country =
    req.headers['x-vercel-ip-country'] ||
    req.headers['cf-ipcountry'] ||
    '';
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ country: String(country).toUpperCase() });
}
