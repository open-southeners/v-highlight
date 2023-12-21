/* eslint-disable no-cond-assign */
import { Directive, DirectiveBinding, FunctionDirective } from "vue"

declare module 'vue' {
  export interface ComponentCustomProperties {
    vHighlight: FunctionDirective<HTMLElement, Array<string>>
  }
}

export const vHighlight: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<Array<string>>) {
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

  if (!el || !node.textContent || !el?.textContent?.match(regexp) || "highlighted" in el.dataset) {
    return;
  }

  el.dataset.highlighted = "1";

  node.replaceWith(
    ...node.textContent.split(new RegExp(`(${regexp.source})`, 'gi')).map(textFragment => {
      if (regexp.test(textFragment)) {
        const fragmentToNode = document.createElement('span');

        fragmentToNode.textContent = textFragment;

        if (style) {
          fragmentToNode.classList.value = style;
        } else {
          fragmentToNode.style.background = '#ebe76e';
        }

        return fragmentToNode
      }

      return textFragment
    })
  );
}

const highlightElements = (el: HTMLElement, value: Array<string>, style?: string) => {

  // escape regex special characters (similar to preg_quote in PHP)
  value = value.map(val => val.replace(/[-[\]{}()*+?.,\\^$|#\s]/ig, "\\$&"))
  
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
    if (curr.nodeType === Node.ELEMENT_NODE && curr.dataset?.highlighted === '1') {
      curr.innerHTML = curr.textContent || ""
      delete curr.dataset.highlighted
    }
  
    if (curr.nodeType === Node.ELEMENT_NODE) {
      queue = queue.concat(Array.from(curr.childNodes))
    }
  }
}
