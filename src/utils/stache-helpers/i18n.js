import stache from 'can-stache'
import i18n from '../../i18n/i18n'

const useStacheRegex = /</
const isEmptyText = function (node) {
  return node.nodeType === 3 && node.textContent.trim() === ''
}

// use a naive document type (don't apply certain HTML rules) for parsing the translation strings
//  -- this avoids certain issues with e.g. self-closing tags
const naiveDocument = new window.Document()

stache.registerHelper('i18n', function (key, options) {
  let text = (typeof i18n[key] !== 'undefined') ? i18n[key] : key
  if (typeof text === 'string' && useStacheRegex.test(text)) {
    const childFrag = options.fn(options.scope)
    const prefrag = naiveDocument.createElement('div')
    prefrag.innerHTML = text

    // First move all of the <slot> tag content into a dictionary by slot name
    const slotsMap = {}
    Array.from(childFrag.querySelectorAll('slot')).forEach(slot => {
      slotsMap[slot.getAttribute('name').toUpperCase()] = slot.childNodes
      slot.parentNode.removeChild(slot)
    })

    // Iterate over the non-text nodes in the translation text
    Array.from(prefrag.children).forEach(node => {
      if (node.nodeName.toUpperCase() === 'CONTENT') {
        prefrag.replaceChild(childFrag, node)
      } else {
        const slotNodes = slotsMap[node.nodeName.toUpperCase()]
        // If the node is not found, do not replace.
        //   That means that we can still do regular HTML tags.
        if (slotNodes) {
          const frag = document.createDocumentFragment()
          Array.from(slotNodes).forEach((node, idx, arr) => {
            if ((idx !== 0 && idx !== arr.length - 1) || !isEmptyText(node)) {
              frag.appendChild(node)
            }
          })
          prefrag.replaceChild(frag, node)
        }
      }
    })

    // Copy the output to and return a frag
    const outputFrag = document.createDocumentFragment()
    Array.from(prefrag.childNodes).forEach(outputFrag.appendChild.bind(outputFrag))
    return outputFrag
  } else {
    return text
  }
})
