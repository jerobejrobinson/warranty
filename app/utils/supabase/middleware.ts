import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  // console.log(process.env.wow)
  if(request.nextUrl.pathname.startsWith('/dashboard')) {
    let cookie = request.cookies.get('dist')
    let LtCookie = request.cookies.get('lt')

    if(!cookie) {
      const cred = await fetch(`${process.env.tokenUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: process.env.wow
      }).then(data => data.json())
      
      response.headers.append('Set-Cookie', `dist=${cred.access_token}; Max-Age=${cred.expires_in}; HttpOnly=true; SameSite=true; secure=true;`)
      
      // @ts-ignore
      response.cookies.set({
        name: 'dist',
        value: cred.access_token,
        httpOnly: true,
        maxAge: cred.expires_in
      })
      return response
    }

    if(cookie && !LtCookie) {
      const data = await fetch(`${process.env.ltURL}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `bearer ${cookie.value}`,
            'Charset': 'utf-8',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "Cono": 3,"Oper": "web" })
      }).then(data => data.json())

      console.log(data)
      response.headers.append('Set-Cookie', `lt=${data.Token}; Max-Age=14400; HttpOnly=true; SameSite=true; secure=true;`)
      // @ts-ignore
      response.cookies.set({
        name: 'lt',
        value: data.Token,
        httpOnly: true,
        maxAge: 14400
      })

    }
  }

  return response
}