# bruhimg
Bruh is an image format designed to store pictures without metadata or unnecessary EXIF information.

## Installation (JavaScript)
```bash
npm i bruhimg
```

## Usage
With Website:
```url
https://supreme.dev.tc/supreme-web/bruhimg
```

With JavaScript:
```js
import { BruhCodec ] from 'bruhimg';
import fs from "fs"

const i = process.argv[2]||"input.png"
const o = "out.bruh"
const p = "out.png"

const b = fs.readFileSync(i).toString("base64")
const e = await BruhCodec.convert(b, "png")
fs.writeFileSync(o, Buffer.from(e, "base64"))

const eb = fs.readFileSync(o).toString("base64")
const d = BruhCodec.decode(eb)
fs.writeFileSync(p, Buffer.from(d, "base64"))
```
