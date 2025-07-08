# cloud flare worker
网页直接向osuapi请求会被拦截，这里使用CloudFlare Worker实现一个简单的代理
```javascript
export default {
  async fetch(request, env, ctx) {
    // 取出 ?url=xxx 参数
    const { searchParams } = new URL(request.url)
    const targetUrl = searchParams.get('url')
    if (!targetUrl) {
      return new Response('Missing url parameter', { status: 400 })
    }

    // 构造新的请求
    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    })

    // 发出请求
    let response
    try {
      response = await fetch(proxyRequest)
    } catch (err) {
      return new Response('Error fetching target URL: ' + err.toString(), { status: 502 })
    }

    // 复制响应体
    const responseBody = await response.arrayBuffer()

    // 添加CORS头
    const newHeaders = new Headers(response.headers)
    newHeaders.set('Access-Control-Allow-Origin', '*')
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    newHeaders.set('Access-Control-Allow-Headers', request.headers.get('Access-Control-Request-Headers') || '*')

    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: newHeaders,
      })
    }

    return new Response(responseBody, {
      status: response.status,
      headers: newHeaders,
    })
  },
}

```