import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { JSDOM } from 'jsdom'
import { decodeHTML } from 'entities'

export const addClass = (html: string): string => {
  const dom = new JSDOM(html)
  const tags = dom.window.document.body.getElementsByTagName('*')

  for (let i = 0; i < tags.length; i++) {
    tags[i].classList.add('md-' + tags[i].tagName.toLowerCase())
  }

  return dom.window.document.body.innerHTML
}

export const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str, true).value
      } catch (__) {}
    }
    return '' // 使用额外的默认转义
  }
})

const markdown = (markdown: string): string => {
  return md.render(markdown)
}

export const parseMarkdown = (text: string) => {
  const html = markdown(text)
  return decodeHTML(addClass(html))
}
