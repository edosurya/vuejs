import request from '@/utils/request'

export function getCustomer(token, query) {
  return request({
    url: '/customer',
    method: 'get',
    params: query,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function createCustomer(token, data) {
  return request({
    url: `/customer`,
    method: 'post',
    data: data,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function updateCustomer(token, data) {
  return request({
    url: `/customer/${data.id}`,
    method: 'put',
    data: data,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function sendSMSLink(token, customerId) {
  return request({
    url: `/customer/sms/${customerId}`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function deleteCustomer(token, customerId) {
  return request({
    url: `/customer/${customerId}`,
    method: 'delete',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function getBulkList(token) {
  return request({
    url: '/bulk/customer',
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function blastBulk(token, idBulk) {
  return request({
    url: `/bulk/customer/sms/${idBulk}`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function downloadAll(token, idCustomer) {
  return request({
    url: `/document/download/${idCustomer}`,
    method: 'get',
    responseType: 'arraybuffer',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}
