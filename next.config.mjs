import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/literature/:path*',
        destination: '/letters/:path*',
        permanent: true,
      },
      {
        source: '/other/letters/test',
        destination: '/letters',
        permanent: true,
      },
      {
        source: '/other/cool/:path*',
        destination: '/letters',
        permanent: true,
      },
    ]
  },
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})
 
export default withMDX(nextConfig)