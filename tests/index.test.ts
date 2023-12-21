import { vHighlight } from '../src';
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';

test('test highlight with no matches found', async () => {
  const wrapper = mount(defineComponent({
    directives: { "highlight": vHighlight },
    template: `<div v-highlight="['ipsum', 'foo']">
      <h1>Hello world</h1>
      <p>Hello my world!, I'm a test doing much <a href="/foo" target="_blank">coverage</a></p>
    </div>`
  }));

  const wrapperHtml = wrapper.html();

  expect(wrapperHtml).not.toContain('data-highlighted="1"');

  wrapper.unmount();
});

test('test highlight components in an HTML-safe way', async () => {
  const wrapper = mount(defineComponent({
    directives: { "highlight": vHighlight },
    template: `<div v-highlight="['ipsum', 'hello', 'foo']">
      <h1>Lorem ipsum</h1>
      <p>Hello lorem, I'm a foobar doing much <a href="/foo" target="_blank">ipsum</a></p>
      <footer>test moar ipsums</footer>
    </div>`
  }));

  const wrapperHtml = wrapper.html();

  expect(wrapperHtml).toContain('<h1 data-highlighted="1">Lorem <span style="background: rgb(235, 231, 110);">ipsum</span></h1>');
  expect(wrapperHtml).toContain('<a href="/foo" target="_blank" data-highlighted="1"><span style="background: rgb(235, 231, 110);">ipsum</span></a>');

  wrapper.unmount();
});

test('test highlight components ignoring some', async () => {
  const wrapper = mount(defineComponent({
    directives: { "highlight": vHighlight },
    template: `<div v-highlight="['ipsum', 'hello', 'foo']">
      <h1>Lorem ipsum</h1>
      <p>Hello lorem, I'm a foobar doing much <a href="/foo" target="_blank" data-highlighted="">ipsum</a></p>
      <footer>test moar ipsums</footer>
    </div>`
  }));

  const wrapperHtml = wrapper.html();

  expect(wrapperHtml).toContain('<h1 data-highlighted="1">Lorem <span style="background: rgb(235, 231, 110);">ipsum</span></h1>');
  expect(wrapperHtml).not.toContain('<a href="/foo" target="_blank" data-highlighted="1"><span style="background: rgb(235, 231, 110);">ipsum</span></a>');

  wrapper.unmount();
});

test('test highlight components with custom class', async () => {
  const wrapper = mount(defineComponent({
    directives: { "highlight": vHighlight },
    template: `<div v-highlight:bg-red-500="['ipsum', 'hello', 'foo']">
      <h1>Lorem ipsum</h1>
      <p>Hello lorem, I'm a foobar doing much <a href="/foo" target="_blank" data-highlighted="">ipsum</a></p>
      <footer>test moar ipsums</footer>
    </div>`
  }));

  const wrapperHtml = wrapper.html();

  expect(wrapperHtml).toContain('<h1 data-highlighted="1">Lorem <span class="bg-red-500">ipsum</span></h1>');
  expect(wrapperHtml).not.toContain('<a href="/foo" target="_blank" data-highlighted="1"><span class="bg-red-500">ipsum</span></a>');

  wrapper.unmount();
});

test('test highlight adding dynamically an element via reactivity', async () => {
  const wrapper = mount(defineComponent({
    data() {
      return {
        highlightElements: ['foo', 'hello']
      }
    },
    // mounted() {
    //   setTimeout(() => this.highlightElements.push('ipsum'), 100)
    // },
    directives: { "highlight": vHighlight },
    template: `<div v-highlight="highlightElements">
      <h1>Lorem ipsum</h1>
      <p>Hello lorem, I'm a foobar doing much <a href="/foo" target="_blank">ipsum</a></p>
      <footer>test moar ipsums</footer>
    </div>`
  }));

  wrapper.setData({
    highlightElements: ['ipsum', 'foo', 'hello']
  });

  await nextTick()

  const wrapperHtml = wrapper.html();
  
  expect(wrapperHtml).toContain('<h1 data-highlighted="1">Lorem <span style="background: rgb(235, 231, 110);">ipsum</span></h1>');
  // FIXME: unhighlightElements function when update is breaking HTML elements!
  // expect(wrapperHtml).toContain('<a href="/foo" target="_blank" data-highlighted="1"><span style="background: rgb(235, 231, 110);">ipsum</span></a>');
  
  wrapper.unmount();
});

test('test highlight regex does not crash with some characters', async () => {
  const wrapper = mount(defineComponent({
    directives: { "highlight": vHighlight },
    template: `<div v-highlight="['**ipsum**', 'hello', 'foo']">
      <h1>Lorem **ipsum**</h1>
      <p>Hello lorem, I'm a foobar doing much <a href="/foo" target="_blank">ipsum</a></p>
      <footer>test moar ipsums</footer>
    </div>`
  }));

  const wrapperHtml = wrapper.html();

  expect(wrapperHtml).toContain('<h1 data-highlighted="1">Lorem <span style="background: rgb(235, 231, 110);">**ipsum**</span></h1>');
  expect(wrapperHtml).not.toContain('<a href="/foo" target="_blank" data-highlighted="1"><span style="background: rgb(235, 231, 110);">ipsum</span></a>');

  wrapper.unmount();
});