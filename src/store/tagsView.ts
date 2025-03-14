import { defineStore } from "pinia"
import { TagView } from "@/types/global";

export const useTagsViewStore = defineStore('tagsView', () => {
  // 定义state
  const visitedViews = ref<TagView[]>([]);
  const cachedViews = ref<string[]>([]);

  // 定义action
  function addView(view: TagView) {
    // 如果已经存在于已访问的视图列表中，则不再添加
    if (visitedViews.value.some((v) => v.path === view.path)) {
      return;
    }
    // 如果视图是固定的（affix），则在已访问的视图列表的开头添加
    if (view.affix) {
      visitedViews.value.unshift(view);
    } else {
      // 如果视图不是固定的，则在已访问的视图列表的末尾添加
      visitedViews.value.push(view);
    }
    // 如果视图需要缓存（keepAlive），则将其路由名称添加到缓存视图列表中
    if (view.keepAlive) {
      // 如果缓存视图名称已经存在于缓存视图列表中，则不再添加
      if (!cachedViews.value.includes(view.name)) {
        cachedViews.value.push(view.name);
      }
    }
  }

  function removeView(route) {
  }

  function clearViews() {
    cachedViews.value = [];
  }


  return {
    visitedViews,
    cachedViews,
    addView,
    removeView,
    clearViews,
  }
})