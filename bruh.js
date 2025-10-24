import zlib from "zlib"
import { createCanvas, loadImage } from "canvas"

class BruhCodec {
  static async convert(base64, format = "png", maxWidth = 3840, maxHeight = 2160) {
    if (!/^image\//.test(format)) format = `image/${format}`
    const img = await loadImage(`data:${format};base64,${base64}`)
    let { width, height } = img

    if (width > maxWidth || height > maxHeight) {
      const scale = Math.min(maxWidth / width, maxHeight / height)
      width = Math.round(width * scale)
      height = Math.round(height * scale)
    }

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0, 0, width, height)

    const imgData = ctx.getImageData(0, 0, width, height)
    const data = imgData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(data[i] / 16) * 16
      data[i + 1] = Math.round(data[i + 1] / 16) * 16
      data[i + 2] = Math.round(data[i + 2] / 16) * 16
    }

    const compressed = zlib.deflateSync(Buffer.from(data), { level: 9 })
    const header = Buffer.from("BRUH01")
    const wh = Buffer.alloc(4)
    wh.writeUInt16LE(width, 0)
    wh.writeUInt16LE(height, 2)
    const meta = Buffer.from(format.padEnd(16, "\0"))
    const out = Buffer.concat([header, wh, meta, compressed])
    return out.toString("base64")
  }

  static decode(base64) {
    const buf = Buffer.from(base64, "base64")
    if (buf.toString("utf8", 0, 6) !== "BRUH01") throw new Error("Invalid .bruh data")
    const width = buf.readUInt16LE(6)
    const height = buf.readUInt16LE(8)
    const format = buf.toString("utf8", 10, 26).replace(/\0/g, "") || "png"
    const compressed = buf.slice(26)
    const pixels = zlib.inflateSync(compressed)
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext("2d")
    const imgData = ctx.createImageData(width, height)
    imgData.data.set(pixels)
    ctx.putImageData(imgData, 0, 0)
    return canvas.toBuffer(`image/${format}`).toString("base64")
  }
}

export default BruhCodec
