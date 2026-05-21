import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const svgBuffer = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="112" fill="#1D9E75"/>
  <path d="M160 140 C160 140 120 140 120 196 L120 308 C120 376 196 410 268 410 C340 410 416 376 416 308 L416 196 C416 140 376 140 376 140"
    stroke="white" stroke-width="36" stroke-linecap="round" fill="none"/>
  <circle cx="268" cy="444" r="44" fill="white"/>
  <circle cx="160" cy="128" r="28" fill="white"/>
  <circle cx="376" cy="128" r="28" fill="white"/>
  <circle cx="268" cy="444" r="22" fill="#1D9E75"/>
</svg>
`)

await sharp(svgBuffer).resize(192, 192).png().toFile(join(publicDir, 'icon-192.png'))
console.log('✅ icon-192.png gerado')

await sharp(svgBuffer).resize(512, 512).png().toFile(join(publicDir, 'icon-512.png'))
console.log('✅ icon-512.png gerado')
