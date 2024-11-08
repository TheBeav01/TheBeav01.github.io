export function getCookieByKey(cookieName: string) {
    const cookieList = decodeURIComponent(document.cookie);
    const cookieArr = cookieList.split(";");
    for(const cookie in cookieList.split(";")) {
        let name = cookie.split("=")
        if (name.length == 0) {
            continue
        }
        if (name[0].trim() === cookieName) {
            return name[1]
        }

    }
    return ""
}

/**
 * Sets a cookie in the browser
 * @param {*} cookieName The cookie name
 * @param {*} cookieValue THe value of the cookie
 * @param {*} expiresAt How many days it will take for it to expire.
 */
export function setCookie(cookieName: string, cookieValue: string, expiresAt: number) {
    var date = new Date();
    date.setTime(date.getTime() + (expiresAt*1000*60*60*24));
    var expires = "expires=" + date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + "; " + expires + "; path=/";
  }