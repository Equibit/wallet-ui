import stache from 'can-stache'

// This helper renders a Stache after URI-component decoding the supplied stache text
// This is a temporary stopgap until can-view-parser allows '>' characters in attributes
stache.registerHelper('decodeAndRender', function (str, options) {
  const frag = stache(decodeURIComponent(str))(options.scope)
  const div = document.createElement('div')
  div.appendChild(frag)
  return div.innerHTML
})
