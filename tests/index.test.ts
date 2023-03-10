import { vHighlight } from '../src';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';

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

  expect(wrapperHtml).toContain('<h1 data-highlighted="">Lorem <span style="background: rgb(235, 231, 110);">ipsum</span></h1>');
  expect(wrapperHtml).toContain('<a href="/foo" target="_blank" data-highlighted=""><span style="background: rgb(235, 231, 110);">ipsum</span></a>');

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

  expect(wrapperHtml).toContain('<h1 data-highlighted="">Lorem <span style="background: rgb(235, 231, 110);">ipsum</span></h1>');
  expect(wrapperHtml).not.toContain('<a href="/foo" target="_blank" data-highlighted=""><span style="background: rgb(235, 231, 110);">ipsum</span></a>');

  wrapper.unmount();
})