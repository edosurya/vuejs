<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(lang)
export default {
  name: 'App'
}
</script>
