<template>
  <div v-if="tagsView" class="admin-tags">
    <a-tabs
        v-model:activeKey="activeKey"
        type="editable-card"
        class="admin-tabs"
        hide-add
        @edit="onTabRemove"
        @tabClick="onTabClick"
        @mouseup="onTabUp"
    >
      <template #leftExtra>
        <div class="admin-tabs-arrow" @click="scrollLeft">
          <left-outlined />
        </div>
      </template>
      <template #rightExtra>
        <div class="admin-tabs-arrow" @click="scrollRight">
          <right-outlined />
        </div>
      </template>

      <a-tab-pane v-for="tag in tagList" :key="tag.fullPath" :closable="!tag.meta.affix">
        <template #tab>
					<span :key="tag.meta.key">
						{{ tag.meta.title }}
					</span>
        </template>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { useSettingsStore, useTagsViewStore } from '@/store'

const route = useRoute()
const router = useRouter()
const settingsStore = useSettingsStore()
const tagsViewStore = useTagsViewStore()

const tagsView = computed(() => {
  return settingsStore.tagsView
})
const visitedViews = computed(() => {
  return tagsViewStore.visitedViews
})
const tagList = computed(() => {
  return visitedViews.value
})

const activeKey = ref()




const onTabRemove = (tabKey, action) => {
  if (action === 'remove') {
    const tag = tagList.value.find((tag) => tag.fullPath === tabKey)
    // closeSelectedTag(tag)
  }
}
const onTabClick = (tab) => {
  router.push(tab)
}
// 处理鼠标放开事件
const onTabUp = (e) => {
  // 鼠标中键
  if (e.which === 2) {
    // handleTabContextMenu(e)
    // closeTabs()
  }
}
const getTabWrapEl = () => {
  return document.querySelector('.ant-tabs-nav-wrap')
}
const scrollLeft = () => {
  const wrapEl = getTabWrapEl()
  if (wrapEl) {
    const event = new WheelEvent('wheel', { deltaX: 0, deltaY: -100 })
    wrapEl.dispatchEvent(event)
  }
}
const scrollRight = () => {
  const wrapEl = getTabWrapEl()
  if (wrapEl) {
    const event = new WheelEvent('wheel', { deltaX: 0, deltaY: 100 })
    wrapEl.dispatchEvent(event)
  }
}
</script>

<style lang="less">

.admin-tags {
  height: 40px;
  background: var(--background-color);
}

.admin-tabs {
  //overflow: hidden; // 新增
  &.ant-tabs {
    z-index: 99;
    .ant-tabs-nav {
      margin-bottom: 0;
      .ant-tabs-extra-content {
        display: flex;
      }
      .ant-tabs-nav-wrap {
        .ant-tabs-ink-bar {
          visibility: visible;
        }
        .ant-tabs-tab-with-remove {
          padding-right: 4px;
        }
        .ant-tabs-tab {
          background: none;
          height: 40px;
          line-height: 40px;
          transition:
              background-color 0.3s,
              color 0.3s;
          padding: 0 16px;
          border-radius: 0;
          border: none;
          margin: 0;
          .ant-tabs-tab-remove {
            margin: 0;
            padding: 0 5px;
          }
        }
        .ant-tabs-tab-active {
          background: var(--primary-1);
        }
      }
    }
    .admin-tabs-drop,
    .admin-tabs-arrow,
    .ant-tabs-nav-operations .ant-tabs-nav-more {
      padding: 0;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      .anticon {
        font-size: 12px;
        vertical-align: -1px;
      }
    }
  }
}

</style>