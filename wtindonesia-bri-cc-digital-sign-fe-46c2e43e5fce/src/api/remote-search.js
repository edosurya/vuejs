import requestDummy from '@/utils/requestDummy'

export function searchUser(name) {
  return requestDummy({
    url: '/vue-element-admin/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return requestDummy({
    url: '/vue-element-admin/transaction/list',
    method: 'get',
    params: query
  })
}
