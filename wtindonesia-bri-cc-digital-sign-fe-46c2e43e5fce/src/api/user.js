import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'admin/signin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/me',
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function getAdmin(token, query) {
  return request({
    url: '/admin',
    method: 'get',
    params: query,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function createAdmin(token, data) {
  return request({
    url: `/admin`,
    method: 'post',
    data: data,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function updateAdmin(token, data) {
  return request({
    url: `/admin/${data.id}`,
    method: 'put',
    data: data,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function deleteAdmin(token, id) {
  return request({
    url: `/admin/${id}`,
    method: 'delete',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
