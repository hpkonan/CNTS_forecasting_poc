/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Uncomment and set to the repo name if deploying to GitHub Pages under a
  // project path (e.g. https://<user>.github.io/ldis-donor-risk-advisor/).
  // basePath: '/ldis-donor-risk-advisor',
};

export default nextConfig;
