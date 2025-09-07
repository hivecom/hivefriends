import { merge } from 'lodash'

export const rootUrl = 'https://friends.hivecom.net'
export const url = process.env.NODE_ENV === 'development' ? 'localhost:3000' : rootUrl

export function get(url: string, options?: object) {
  return _handleFetch(
    url,
    merge(
      {
        method: 'GET',
      },
      options,
    ),
  )
}

export function post(url: string, body: object | string, options?: object) {
  return _handleFetch(
    url,
    merge(
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
      options,
    ),
  )
}

export function put(url: string, body: object | string, options?: object) {
  return _handleFetch(
    url,
    merge(
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
      options,
    ),
  )
}

/**
 * Special function to handle file uploads
 */

export function upload(url: string, body: object | string, options?: object) {
  return _handleFetch(url, {
    method: 'POST',
    body,
    ...options,
  })
}

export function del(url: string, options?: object) {
  return _handleFetch(
    url,
    merge(
      {
        method: 'DELETE',
      },
      options,
    ),
  )
}

// Private handler functions

async function _handleFetch(url: string, options: object) {
  const token = localStorage.getItem('bearer_token')

  merge(options, {
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return fetch(rootUrl + url, options).then(_handleResponse)
}

async function _handleResponse(response: Response) {
  // Reset on 403
  if ([401, 403].includes(response.status)) {
    localStorage.removeItem('user')
    localStorage.removeItem('bearer_token')

    setTimeout(() => {
      if (window.location.href === '/login') {
        window.location.href = '/login'
      }

      return Promise.reject({
        message: 'Unexpected issue. Please clear site data, reload and try again.',
      })
    }, 50)
  }

  if (response.status !== 200) {
    return response.text().then((text: string) => {
      let message = null

      try {
        const parsed = JSON.parse(text)
        message = parsed.message
      }
      catch (e) {
        message = text
      }

      return Promise.reject({
        status: response.status,
        message: message || `An unexpected error occured: ${response.statusText}`,
      })
    })
  }

  return response.text().then((text: string) => {
    const data = text && JSON.parse(text)

    if (!response.ok) {
      return Promise.reject(data)
    }

    return data
  })
}
