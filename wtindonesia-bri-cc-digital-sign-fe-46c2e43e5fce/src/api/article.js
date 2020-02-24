import requestDummy from '@/utils/requestDummy'

export function fetchList(query) {
  return requestDummy({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return requestDummy({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return requestDummy({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return requestDummy({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return requestDummy({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
