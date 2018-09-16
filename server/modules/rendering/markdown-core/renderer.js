const md = require('markdown-it')
const _ = require('lodash')

const quoteStyles = {
  Chinese: '””‘’',
  English: '“”‘’',
  French: ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'],
  German: '„“‚‘',
  Greek: '«»‘’',
  Japanese: '「」「」',
  Hungarian: '„”’’',
  Polish: '„”‚‘',
  Portuguese: '«»‘’',
  Russian: '«»„“',
  Spanish: '«»‘’',
  Swedish: '””’’'
}

module.exports = {
  async render() {
    const mkdown = md({
      html: this.config.allowHTML,
      breaks: this.config.linebreaks,
      linkify: this.config.linkify,
      typographer: this.config.typographer,
      quotes: _.get(quoteStyles, this.config.quotes, quoteStyles.English),
      highlight(str, lang) {
        return `<pre><code lang="${lang}">${_.escape(str)}</code></pre>`
      }
    })

    for (let child of this.children) {
      const renderer = require(`../${_.kebabCase(child.key)}/renderer.js`)
      renderer.init(mkdown, child.config)
    }

    return mkdown.render(this.input)
  }
}
