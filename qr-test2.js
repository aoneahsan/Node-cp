const QRCode = require('qrcode')
const { createCanvas, loadImage } = require('canvas')
async function create (dataForQRcode, center_image, width, cwidth) {
  const canvas = createCanvas(width, width)
  QRCode.toCanvas(canvas, dataForQRcode, {
    errorCorrectionLevel: 'H',
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  })

  const ctx = canvas.getContext('2d')
  const img = await loadImage(center_image)
  const center = (width - cwidth) / 2
  ctx.drawImage(img, center, center, cwidth, cwidth)
  return canvas.toDataURL('image/png')
}

async function main () {
  const qrCode = await create(
    'http://shauryamuttreja.com/qr/',
    'https://zaions.com/wp-content/uploads/2022/05/zaions-company-logo.png',
    150,
    50
  )

  console.log(qrCode)
}

main()
