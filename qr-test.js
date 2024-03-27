const { toFile } = require('qrcode')
const path = require('path')

const createCodes = (
  codes = [
    { fileName: 'qr1', url: 'https://zaions.com/qr1' },
    { fileName: 'qr2', url: 'https://zaions.com/qr2' },
    { fileName: 'qr3', url: 'https://zaions.com/qr3' },
    { fileName: 'qr4', url: 'https://zaions.com/qr4' },
    { fileName: 'qr5', url: 'https://zaions.com/qr5' },
    {
      fileName: 'android-full-stack',
      url: 'https://zaions.com/android-full-stack'
    },
    { fileName: 'android-kotlin', url: 'https://zaions.com/android-kotlin' },
    { fileName: 'android-java', url: 'https://zaions.com/android-java' },
    {
      fileName: 'extension-developer',
      url: 'https://zaions.com/extension-developer'
    },
    {
      fileName: 'electronjs-developer',
      url: 'https://zaions.com/electronjs-developer'
    },
    {
      fileName: 'reactjs-developer',
      url: 'https://zaions.com/reactjs-developer'
    },
    {
      fileName: 'angular-developer',
      url: 'https://zaions.com/angular-developer'
    },
    {
      fileName: 'flutter-developer',
      url: 'https://zaions.com/flutter-developer'
    },
    {
      fileName: 'mern-stack-developer',
      url: 'https://zaions.com/mern-stack-developer'
    },
    {
      fileName: 'mean-stack-developer',
      url: 'https://zaions.com/mean-stack-developer'
    },
    {
      fileName: 'laravel-developer',
      url: 'https://zaions.com/laravel-developer'
    },
    {
      fileName: 'wordpress-developer',
      url: 'https://zaions.com/wordpress-developer'
    },
    {
      fileName: 'nodejs-developer',
      url: 'https://zaions.com/nodejs-developer'
    },
    {
      fileName: 'firebase-developer',
      url: 'https://zaions.com/firebase-developer'
    },
    {
      fileName: 'designing-6month',
      url: 'https://zaions.com/designing-6month'
    },
    {
      fileName: 'designing-4month',
      url: 'https://zaions.com/designing-4month'
    },
    {
      fileName: 'designing-3month',
      url: 'https://zaions.com/designing-3month'
    },
    {
      fileName: 'photoshop-2month',
      url: 'https://zaions.com/photoshop-2month'
    },
    {
      fileName: 'illustrator-2month',
      url: 'https://zaions.com/illustrator-2month'
    },
    { fileName: 'figma-course', url: 'https://zaions.com/figma-course' },
    {
      fileName: 'premium-pro-course',
      url: 'https://zaions.com/premium-pro-course'
    },
    {
      fileName: 'motion-design-course',
      url: 'https://zaions.com/motion-design-course'
    },
    { fileName: 'canva-course', url: 'https://zaions.com/canva-course' },
    {
      fileName: 'developer-12month',
      url: 'https://zaions.com/developer-12month'
    },
    {
      fileName: 'js-developer-9month',
      url: 'https://zaions.com/js-developer-9month'
    },
    {
      fileName: 'php-developer-9month',
      url: 'https://zaions.com/php-developer-9month'
    },
    {
      fileName: 'react-native-course',
      url: 'https://zaions.com/react-native-course'
    }
  ]
) => {
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i]
    toFile(
      path.resolve(__dirname, 'qr-codes', `${code.fileName}.svg`),
      code.url,
      {
        // color: {
        //   dark: '#ff0000',
        //   light: '#00ff00'
        // },
        type: 'svg'
        // errorCorrectionLevel: 'high',
        // margin: 10,
        // maskPattern: 7,
        // scale: 10,
        // version: 3,
        // width: 1000
        // toSJISFunc
      },
      err => {
        if (err) {
          console.error('Error Occurred', err)
        } else {
          console.log('completed')
        }
      }
    )
  }
}

createCodes()
