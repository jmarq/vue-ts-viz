import { mount } from '@vue/test-utils';
import SortPage from '@/pages/sort.vue';

describe('sort page', () => {
  it('is a Vue instance', () => {
    const wrapper = mount(SortPage);
    expect(wrapper.vm).toBeTruthy();
  });

  it('can sort an array', async () => {
    // need to look further into how to properly type these wrappers so I can call methods on them
    //  (alternatively, test by using the input/button events instead of calling methods directly)
    const wrapper = mount(SortPage) as any;
    expect(wrapper.vm).toBeTruthy();
    // would like to use newNode function exported from the sort.vue file
    //  but current typescript/nuxt module config doesnt seem to like named exports from these files.
    //   need to investigate further.
    wrapper.vm.$data.list = [
      { value: 3, id: '3', color: 'red' },
      { value: 1, id: '1', color: 'red' },
      { value: 2, id: '2', color: 'red' },
    ];
    wrapper.vm.$data.delay = 0;
    await wrapper.vm.bubbleSort();
    expect(wrapper.vm.$data.list.map((d: any) => d.value)).toEqual([1, 2, 3]);
  });
});
