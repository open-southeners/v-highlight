/* eslint-disable no-cond-assign */
import { DirectiveBinding, FunctionDirective } from "vue"

declare module 'vue' {
  export interface ComponentCustomProperties {
    vHighlight: FunctionDirective<HTMLElement, Array<string>>
  }
}

export const vHighlight = {
  mounted(el: HTMLElement, binding: DirectiveBinding<Array<string>>) {
    console.log(binding)
    highlightElements(el, binding.value, binding.arg)
  },

  updated(el: HTMLElement, binding: DirectiveBinding<Array<string>>) {
    unhighlightElements(el)

    highlightElements(el, binding.value, binding.arg)
  },
}

const parseMatchedTextNode = (regexp: RegExp, node: ChildNode, style?: string) => {
  // TODO: What if this is a text node child from parented v-highlight element??
  // TODO: What if is same as prev but having multiple children
  const el = node.parentElement;

  if (!el || !el?.textContent?.match(regexp)) {
    return;
  }

  el.dataset.highlighted = "";
  let attrs = ` class="${style}"`

  if (!style) {
    attrs = ' style="background-color: #ebe76e;"'
  }

  el.innerHTML = el.innerHTML.replaceAll(regexp, (match) => {
    return `<span${attrs}>${match}</span>`
  });
}

const highlightElements = (el: HTMLElement, value: Array<string>, style?: string) => {
  const regexp = new RegExp(value.join("|"), "gi");

  if (!el.textContent?.match(regexp)) {
    return;
  }

  let queue = Array.from(el.childNodes);
  let curr: HTMLElement | undefined;

  while (curr = queue.pop() as HTMLElement) {
    if (!curr?.textContent?.match(regexp)) {
      continue;
    }

    if (curr.nodeType === Node.TEXT_NODE) {
      parseMatchedTextNode(regexp, curr, style);
    }

    if (curr.nodeType === Node.ELEMENT_NODE) {
      queue = queue.concat(Array.from(curr.childNodes));
    }
  }
}

const unhighlightElements = (el: HTMLElement) => {
  let queue = Array.from(el.childNodes);
  let curr: HTMLElement | undefined;

  while (curr = queue.pop() as HTMLElement) {
    if (curr.nodeType === Node.ELEMENT_NODE && "highlighted" in curr.dataset) {
      curr.innerHTML = curr.textContent || ""
      delete curr.dataset.highlighted
    }
  
    if (curr.nodeType === Node.ELEMENT_NODE) {
      queue = queue.concat(Array.from(curr.childNodes))
    }
  }
}