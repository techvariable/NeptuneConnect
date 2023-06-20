function applyDynamicStyle(css) {
  const styleTag = document.createElement('style')
  const dynamicStyleCss = document.createTextNode(css)
  styleTag.appendChild(dynamicStyleCss)
  const header = document.getElementsByTagName('head')[0]
  header.appendChild(styleTag)
}
const theme = localStorage.getItem('generalTheme')
let style = ''
switch (theme) {
  case 'dark-green':
    style = 'filter:invert(.87) hue-rotate(30deg)'
    break
  case 'dark-night':
    style = 'filter:invert(.87) hue-rotate(120deg)'
    break
  case 'dark-violet':
    style = 'filter:invert(.87) hue-rotate(220deg)'
    break
  case 'dark-orange':
    style = 'filter:invert(.87) hue-rotate(320deg)'
    break
  case 'dark-candy':
    style = 'filter:invert(.87) hue-rotate(360deg)'
    break
  case 'light-blue':
    style = 'filter: hue-rotate(330deg)'
    break
  case 'light-orange':
    style = 'filter: hue-rotate(100deg)'
    break
  case 'light-green':
    style = 'filter: hue-rotate(240deg)'
    break
  default:
    style = 'filter:invert(0) hue-rotate(0deg)'
    break
}
applyDynamicStyle(`
  html{
    ${style}
  } 
  `)
