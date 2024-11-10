export function getCookieByKey(cookieName: string) {
    return localStorage.getItem(cookieName) ?? ""
}

/**
 * Sets a cookie in the browser
 * @param {*} cookieName The cookie name
 * @param {*} cookieValue THe value of the cookie
 * @param {*} expiresAt How many days it will take for it to expire.
 */
export function setCookie(cookieName: string, cookieValue: string, expiresAt: number) {
    localStorage.setItem(cookieName, cookieValue)
  }